/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import * as exchange from './exchange.js';
import {asyncHandler} from '@bedrock/express';
import cors from 'cors';
import {
  createExchangeInstance, initializeTransaction, getExchangeInstanceRecord,
  getStepIdByTransaction, storeResponseForExchangeStep, delegateZcap
} from './exchangeInstance.js';

const {util: {BedrockError}} = bedrock;

bedrock.events.on('bedrock-express.configure.routes', app => {
  const {routes} = bedrock.config['vc-exchanger'];

  app.options(routes.exchange, cors());
  app.post(routes.exchange, cors(), asyncHandler(async (req, res) => {
    const {exchangeId} = req.params;
    const stepId = 'initial';

    await exchange.exists({exchangeId});
    const {exchangeInstance} = await createExchangeInstance({exchangeId});
    const transactionId = await initializeTransaction({
      exchangeInstance,
      stepId
    });
    const response = await exchange.generateResponse({
      exchangeId,
      transactionId,
      stepId,
      exchangeInstanceId: exchangeInstance.id,
    });

    res.json(response);
  }));

  app.options(routes.exchangeTransaction, cors());
  app.put(routes.exchangeTransaction, cors(), asyncHandler(async (req, res) => {
    const {exchangeId} = req.params;
    const {exchangeInstanceId, localTransactionId} = _parsePublicTransactionId({
      transactionId: req.params.transactionId
    });
    let {exchangeInstance} = await getExchangeInstanceRecord({
      exchangeInstanceId
    });

    const currentStepId = getStepIdByTransaction({
      exchangeInstance, transactionId: localTransactionId
    });
    await exchange.validateResponse({
      exchangeId,
      stepId: currentStepId,
      data: req.body
    });

    let insertSuccess = false;
    while(!insertSuccess) {
      try {
        await storeResponseForExchangeStep({
          exchangeInstance, stepId: currentStepId, data: req.body
        });

        insertSuccess = true;
      } catch(e) {
        if(e.name === 'InvalidStateError') {
          ({exchangeInstance} = await getExchangeInstanceRecord({
            exchangeInstanceId
          }));
        }

        throw e;
      }
    }
    const nextStepId = await exchange.getNextStep({exchangeId, currentStepId});
    const response = await exchange.generateResponse({
      exchangeId,
      exchangeInstanceId: exchangeInstance.id,
      transactionId: localTransactionId,
      stepId: nextStepId
    });

    res.json(response);
  }));

  app.get(
    routes.exchangeInstanceStep,
    cors(),
    asyncHandler(async (req, res) => {
      const {exchangeInstanceId, stepId} = req.params;
      const record = await getExchangeInstanceRecord({exchangeInstanceId});
      if(!record) {
        throw new BedrockError(
          'Exchange instance not found.', 'NotFoundError', {
            httpStatusCode: 404,
            public: true
          });
      }

      const {exchangeInstance} = record;
      const step = _getStep({exchangeInstance, stepId});
      res.json(step.data);
    }));

  app.get(
    routes.exchangeInstanceStepCapabilities,
    cors(),
    asyncHandler(async (req, res) => {
      const {exchangeInstanceId, stepId} = req.params;
      const {controller} = req.query;
      if(!controller) {
        throw new BedrockError(
          'Missing "controller" query parameter.', 'DataError', {
            httpStatusCode: 400,
            public: true
          });
      }
      const record = await getExchangeInstanceRecord({exchangeInstanceId});
      if(!record) {
        throw new BedrockError(
          'Exchange instance not found.', 'NotFoundError', {
            httpStatusCode: 404,
            public: true
          });
      }

      const {exchangeInstance} = record;
      const step = _getStep({exchangeInstance, stepId});
      _ensureCapabilitiesForExchangeInstance({exchangeInstance, stepId});

      const promises = [];
      Object.entries(step.data.capability).forEach(([referenceId, zcap]) => {
        const promise = (async zcap => {
          return {
            referenceId,
            zcap: await delegateZcap({zcap, controller})
          };
        })(zcap);
        promises.push(promise);
      });

      const results = await Promise.all(promises);
      const response = {};
      for(const {referenceId, zcap} of results) {
        response[referenceId] = zcap;
      }

      res.json(response);
    }));
});

function _parsePublicTransactionId({transactionId}) {
  const splitResult = transactionId.split('-');
  const [exchangeInstanceId, localTransactionId, ...rest] = splitResult;
  if(rest.length !== 0) {
    throw new BedrockError(
      'The given url is malformed.', 'DataError', {
        publicTransactionId: transactionId,
        exchangeInstanceId,
        localTransactionId,
        extraData: rest.join(''),
        httpStatusCode: 400,
        public: true,
      });
  }

  return {exchangeInstanceId, localTransactionId};
}

function _getStep({exchangeInstance, stepId}) {
  const step = exchangeInstance.steps[stepId];
  if(!step) {
    throw new BedrockError(
      'The given "stepId" is invalid.', 'DataError', {
        httpStatusCode: 400,
        public: true
      });
  }

  return step;
}

function _ensureCapabilitiesForExchangeInstance({exchangeInstance, stepId}) {
  const step = exchangeInstance.steps[stepId];
  if(!(step.data && step.data.capability)) {
    throw new BedrockError(
      'Invalid request for capability delegation.', 'DataError', {
        httpStatusCode: 400,
        public: true
      });
  }
}
