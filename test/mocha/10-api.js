/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {api, delegateRootZcap} from './helpers.js';
import {
  presentations,
  testExchanges
} from '../mock.data.js';
import {
  shouldError,
  shouldNotError,
  shouldHaveVpForStep,
  shouldHaveVpWithTransactionId,
  shouldHaveInteractService
} from './assertions.js';

const exchange = '/exchanges/:exchangeId';
const exchangeInstance = '/exchange-instances/:exchangeInstanceId';

describe('API', () => {
  describe(exchange, () => {
    it('should get a Vp from a valid service with only one step.', async () => {
      const path = 'exchanges/oneStep';
      const {response, error, data} = await api.post({path});
      shouldNotError({response, error, data, path});
      const {
        verifiablePresentationRequest
      } = testExchanges.oneStep.steps.initial;
      shouldHaveVpForStep({data, path, verifiablePresentationRequest});
    });
    it('should error if service doesn\'t exist.', async () => {
      const path = 'exchanges/nonExistent';
      const {response, error, data} = await api.post({path});
      //FIXME this is a client error where the wrong service was
      // requested and should probably return 404.
      const expected = {status: 500};
      shouldError({response, error, data, path, expected});
    });
    it('should error if service doesn\'t have an initial step.', async () => {
      const path = 'exchanges/noInitialStep';
      const {response, error, data} = await api.post({path});
      const expected = {status: 500};
      shouldError({response, error, data, path, expected});
    });
    it('should error if in interact a service has an invalid type.',
      async () => {
        const path = 'exchanges/invalidServiceType';
        const {response, error, data} = await api.post({path});
        const expected = {status: 500};
        shouldError({response, error, data, path, expected});
      });
  });
  describe(`${exchange}/:transactionId`, () => {
    it('should return a service with a transactionId', async () => {
      const path = 'exchanges/multiStepUnmediated';
      const initialResponse = await api.post({path});
      shouldNotError({...initialResponse, path});
      const {
        verifiablePresentationRequest
      } = testExchanges.oneStep.steps.initial;
      shouldHaveVpWithTransactionId({
        data: initialResponse.data,
        path,
        verifiablePresentationRequest
      });
      const {interact} = initialResponse.data.verifiablePresentationRequest;
      shouldHaveInteractService({interact});
      const [interactService] = interact.service;
      const interactResponse = await api.put({
        path: interactService.serviceEndpoint,
        json: presentations.one
      });
      shouldNotError({
        ...interactResponse,
        path: interactService.serviceEndpoint
      });
    });
    it('should error if transactionId is not found', async () => {
      const path = 'exchanges/multiStepUnmediated';
      const initialResponse = await api.post({path});
      shouldNotError({...initialResponse, path});
      const {
        verifiablePresentationRequest
      } = testExchanges.oneStep.steps.initial;
      shouldHaveVpWithTransactionId({
        data: initialResponse.data,
        path,
        verifiablePresentationRequest
      });
      const {interact} = initialResponse.data.verifiablePresentationRequest;
      shouldHaveInteractService({interact});
      const [interactService] = interact.service;
      const interactResponse = await api.put(
        {path: interactService.serviceEndpoint + 'notFound'});
      //FIXME this should probably be 404 as the user is requesting
      // an incorrect instanceId
      shouldError({
        ...interactResponse,
        path: interactService.serviceEndpoint,
        expected: {
          status: 500
        }
      });
    });

  });
  describe(`${exchangeInstance}/:stepId`, () => {
    it('should be able to get data for a step', async () => {
      const path = 'exchanges/multiStepUnmediated';
      const initialResponse = await api.post({path});
      shouldNotError({...initialResponse, path});
      const {
        verifiablePresentationRequest
      } = testExchanges.oneStep.steps.initial;
      shouldHaveVpWithTransactionId({
        data: initialResponse.data,
        path,
        verifiablePresentationRequest
      });
      const {interact} = initialResponse.data.verifiablePresentationRequest;
      shouldHaveInteractService({interact});
      const [interactService] = interact.service;
      const interactResponse = await api.put({
        path: interactService.serviceEndpoint,
        json: presentations.one
      });
      shouldNotError({
        ...interactResponse,
        path: interactService.serviceEndpoint
      });
      const transactionId = interactService.serviceEndpoint.split('/').pop();
      const exchangeId = transactionId.split('-').shift();
      const exchangePath = `exchange-instances/${exchangeId}/initial`;
      const exchangeStepResponse = await api.get({
        path: exchangePath,
      });
      shouldNotError({
        ...exchangeStepResponse,
        path: exchangePath,
        expected: {status: 200}
      });
      exchangeStepResponse.data.should.eql(presentations.one);
    });

  });
  describe(`${exchangeInstance}/:stepId/delegate`, () => {
    it('should delegate zcaps for a step', async () => {
      const path = 'exchanges/multiStepDelegated';
      const initialResponse = await api.post({path});
      shouldNotError({...initialResponse, path});
      const {
        verifiablePresentationRequest
      } = testExchanges.oneStep.steps.initial;
      shouldHaveVpWithTransactionId({
        data: initialResponse.data,
        path,
        verifiablePresentationRequest
      });
      const {interact} = initialResponse.data.verifiablePresentationRequest;
      shouldHaveInteractService({interact});
      const [interactService] = interact.service;
      const exampleZcap = await delegateRootZcap();
      presentations.two.capability.example = exampleZcap;
      const interactResponse = await api.put({
        path: interactService.serviceEndpoint,
        json: presentations.two
      });
      shouldNotError({
        ...interactResponse,
        path: interactService.serviceEndpoint
      });
      const transactionId = interactService.serviceEndpoint.split('/').pop();
      const exchangeId = transactionId.split('-').shift();
      const exchangeInstance = `exchange-instances/${exchangeId}/`;
      const exchangePath = `${exchangeInstance}initial/delegate?controller=` +
        encodeURIComponent(presentations.two.capability.example.controller);
      const exchangeStepResponse = await api.get({
        path: exchangePath,
      });
      shouldNotError({
        ...exchangeStepResponse,
        path: exchangePath
      });
      should.exist(
        exchangeStepResponse.data,
        `Expected ${exchangePath} to return data`
      );
      exchangeStepResponse.data.should.be.an(
        'object',
        `Expected ${exchangePath} data to be an object`
      );
      should.exist(
        exchangeStepResponse.data.example,
        `Expected ${exchangePath} to return example delegated zcap.`
      );
      const delegatedZcap = exchangeStepResponse.data.example;
      delegatedZcap.should.not.eql(
        presentations.two,
        'Expected delegated zcap got a presentation.'
      );
      delegatedZcap.should.not.eql(
        exampleZcap,
        'Delegated zcap should not match original zcap.'
      );
      should.exist(
        delegatedZcap['@context'],
        'Expected delegatedZcap to have a context.'
      );
      delegatedZcap['@context'].should.be.an(
        'Array',
        'Expected delegatedZcap[\'@context\'] to be an array.'
      );
      delegatedZcap['@context'].should.eql(
        exampleZcap['@context'],
        'Expected delegatedZcap[\'@context\'] to match ' +
          'exampleZcap[\'@context\']'
      );
      should.exist(delegatedZcap.id, 'Expected delegatedZcap to have an id.');
      delegatedZcap.id.should.be.a(
        'string',
        'Expected "delegatedZcap.id" to be a string.'
      );
      delegatedZcap.id.should.not.equal(
        exampleZcap.id,
        'Expected delegatedZcap.id to not match the original zcap\'s id.'
      );
      should.exist(
        delegatedZcap.parentCapability,
        'Expected "delegatedZcap.parentCapability" to exist.'
      );
      delegatedZcap.parentCapability.should.be.a(
        'string',
        'Expected "delegatedZcap.parentCapability" to be a string.'
      );
      delegatedZcap.parentCapability.should.not.equal(
        exampleZcap.parentCapability,
        'Expected "delegatedZcap.parentCapability" to not match ' +
          'original parentCapability.'
      );
      should.exist(
        delegatedZcap.invocationTarget,
        'Expected "delegatedZcap.invocationTarget" to exist.'
      );
      delegatedZcap.invocationTarget.should.be.a(
        'string',
        'Expected "delegatedZcap.invocationTarget" to be a string.'
      );
      delegatedZcap.invocationTarget.should.equal(
        exampleZcap.invocationTarget,
        'Expected "delegatedZcap.invocationTarget" to match ' +
          'original invocationTarget.'
      );
      should.exist(
        delegatedZcap.proof,
        'Expected "delegatedZcap.proof" to exist.'
      );
      delegatedZcap.proof.should.be.an(
        'object',
        'Expected "delegatedZcap.proof" to be an object.'
      );
      delegatedZcap.proof.should.not.equal(
        exampleZcap.proof,
        'Expected "delegatedZcap.proof" to not match ' +
          'original proof.'
      );
    });
  });
});
