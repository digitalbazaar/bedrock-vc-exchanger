/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {api} from './helpers.js';
import {
  presentations,
  testExchanges
} from '../mock.data.js';
import {
  shouldError,
  shouldNotError,
  shouldHaveVpForStep,
  shouldHaveVpWithTransactionId
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
      interact.should.be.an('object', 'Expected `interact` to be an Object');
      should.exist(interact.service, 'Expected `interact.service` to exist.');
      interact.service.should.be.an(
        'Array',
        'Expected `interact.service` to be an Array.'
      );
      interact.service.length.should.eql(1, 'Expected one `interact.service`.');
      const [interactService] = interact.service;
      should.exist(
        interactService.type,
        'Expected `interactService.type` to exist.'
      );
      should.exist(
        interactService.serviceEndpoint,
        'Expected `interactService.serviceEndpoint` to exist.'
      );
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
      interact.should.be.an('object', 'Expected `interact` to be an Object');
      should.exist(interact.service, 'Expected `interact.service` to exist.');
      interact.service.should.be.an(
        'Array',
        'Expected `interact.service` to be an Array.'
      );
      interact.service.length.should.eql(1, 'Expected one `interact.service`.');
      const [interactService] = interact.service;
      should.exist(
        interactService.type,
        'Expected `interactService.type` to exist.'
      );
      should.exist(
        interactService.serviceEndpoint,
        'Expected `interactService.serviceEndpoint` to exist.'
      );
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
      interact.should.be.an('object', 'Expected `interact` to be an Object');
      should.exist(interact.service, 'Expected `interact.service` to exist.');
      interact.service.should.be.an(
        'Array',
        'Expected `interact.service` to be an Array.'
      );
      interact.service.length.should.eql(1, 'Expected one `interact.service`.');
      const [interactService] = interact.service;
      should.exist(
        interactService.type,
        'Expected `interactService.type` to exist.'
      );
      should.exist(
        interactService.serviceEndpoint,
        'Expected `interactService.serviceEndpoint` to exist.'
      );
      interactService.serviceEndpoint.should.be.a(
        'string',
        'Expected serviceEndpoint to be a string.'
      );
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
      interact.should.be.an('object', 'Expected `interact` to be an Object');
      should.exist(interact.service, 'Expected `interact.service` to exist.');
      interact.service.should.be.an(
        'Array',
        'Expected `interact.service` to be an Array.'
      );
      interact.service.length.should.eql(1, 'Expected one `interact.service`.');
      const [interactService] = interact.service;
      should.exist(
        interactService.type,
        'Expected `interactService.type` to exist.'
      );
      should.exist(
        interactService.serviceEndpoint,
        'Expected `interactService.serviceEndpoint` to exist.'
      );
      interactService.serviceEndpoint.should.be.a(
        'string',
        'Expected serviceEndpoint to be a string.'
      );
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
      const exchangePath = `exchange-instances/${exchangeId}/initial/delegate?controller=` +
        encodeURIComponent(presentations.two.capability.example.controller);
      const exchangeStepResponse = await api.get({
        path: exchangePath,
      });
      shouldNotError({
        ...exchangeStepResponse,
        path: exchangePath
      });
      exchangeStepResponse.data.should.eql(presentations.two);
    });
  });
});
