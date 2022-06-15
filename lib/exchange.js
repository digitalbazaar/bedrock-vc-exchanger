/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import assert from 'assert-plus';
import {getAppIdentity} from '@bedrock/app-identity';
import rfdc from 'rfdc';

const {util: {BedrockError}} = bedrock;

const clone = rfdc();

let APP_ID;
bedrock.events.on('bedrock.init', () => {
  const {id} = getAppIdentity();
  APP_ID = id;
});

export async function generateResponse({
  exchangeId, exchangeInstanceId, transactionId, stepId
}) {
  const {verifiablePresentationRequest} = await generateVpRequest({
    exchangeId, stepId
  });

  const interactServices = generateInteractServices({
    serviceConfigs: verifiablePresentationRequest.interact.service,
    exchangeId,
    transactionId: `${exchangeInstanceId}-${transactionId}`
  });

  verifiablePresentationRequest.interact = {
    service: interactServices
  };

  return {verifiablePresentationRequest};
}

// eslint-disable-next-line no-unused-vars
export async function exists({exchangeId}) {
  return true;
}

// eslint-disable-next-line no-unused-vars
export async function validateResponse({exchangeId, stepId, data}) {
  return {valid: true};
}

export function getNextStep({exchangeId, currentStepId}) {
  const cfg = bedrock.config['vc-exchanger'];
  const step = cfg.exchanges[exchangeId].steps[currentStepId];

  if(!step) {
    throw new Error(
      `Exchange "${exchangeId}" with step id "${currentStepId}" not found.`
    );
  }

  if(step.next === undefined) {
    throw new Error(
      `Exchange "${exchangeId}" with step id "${currentStepId}" next step` +
      ' is undefined.'
    );
  }

  return step.next;
}

async function generateVpRequest({exchangeId, stepId}) {
  const cfg = bedrock.config['vc-exchanger'];
  const step = clone(cfg.exchanges[exchangeId].steps[stepId]);
  if(!step) {
    throw new Error(
      `Exchange "${exchangeId}" with step id "${stepId}" not found.`
    );
  }

  if(step && step.verifiablePresentationRequest &&
    step.verifiablePresentationRequest.query) {
    let {query} = step.verifiablePresentationRequest;
    query = Array.isArray(query) ? query : [query];

    for(const q of query) {
      if(q.type === 'ZcapQuery') {
        let {capabilityQuery} = q;
        capabilityQuery = Array.isArray(capabilityQuery) ? capabilityQuery :
          [capabilityQuery];

        for(const zcapRequest of capabilityQuery) {
          if(zcapRequest.controller === '$APP_ID') {
            zcapRequest.controller = APP_ID;
          }
        }
      }
    }
  }

  const {verifiablePresentationRequest} = step;
  return {verifiablePresentationRequest};
}

function generateInteractServices({serviceConfigs, exchangeId, transactionId}) {
  assert.object(serviceConfigs, 'serviceConfigs');
  assert.string(exchangeId, 'exchangeId');
  assert.string(transactionId, 'transactionId');

  serviceConfigs = Array.isArray(serviceConfigs) ? serviceConfigs :
    [serviceConfigs];

  const services = [];
  for(const {type, serviceEndpointBasePath} of serviceConfigs) {
    const {host} = bedrock.config.server;
    const baseUrl = `https://${host}${serviceEndpointBasePath}`;
    const service = generateInteractService({
      type,
      baseUrl,
      exchangeId,
      transactionId
    });
    services.push(service);
  }

  return services;
}

function generateInteractService({type, baseUrl, exchangeId, transactionId}) {
  assert.string(type, 'type');
  assert.string(baseUrl, 'baseUrl');
  assert.string(exchangeId, 'exchangeId');
  assert.string(transactionId, 'transactionId');

  if(type === 'UnmediatedPresentationService2021') {
    const serviceEndpoint = `${baseUrl}${exchangeId}/${transactionId}`;
    return {type, serviceEndpoint};
  }

  if(type === 'MediatedPresentationService2021') {
    const paramsObj = {transactionId};
    const searchParams = new URLSearchParams(paramsObj);
    const serviceEndpoint = `${baseUrl}?${searchParams.toString()}`;
    return {type, serviceEndpoint};
  }
  throw new BedrockError(
    `Unsupported service type: "${type}".`,
    'NotSupportedError', {
      httpStatusCode: 400,
      public: true
    });
}
