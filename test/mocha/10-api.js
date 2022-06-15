/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {api} from './helpers.js';
import {testExchanges} from '../mock.data.js';
import {
  shouldError,
  shouldNotError,
  shouldHaveVpForStep
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
      shouldError({response, error, data, path});
    });
    it('should error if service doesn\'t have an initial step.', async () => {
      const path = 'exchanges/noInitialStep';
      const {response, error, data} = await api.post({path});
      shouldError({response, error, data, path});
    });
    it('should error if in interact a service has an invalid type.',
      async () => {
        const path = 'exchanges/invalidServiceType';
        const {response, error, data} = await api.post({path});
        shouldError({response, error, data, path});
      });
  });
  describe(`${exchange}/:transactionId`, () => {
    it('should return a service with a transactionId', async () => {
      const path = 'exchanges/multiStepUnmediated';
      const {response, error, data} = await api.post({path});
      shouldNotError({response, error, data, path});
      const {
        verifiablePresentationRequest
      } = testExchanges.oneStep.steps.initial;
      data.should.be.an(
        'object',
        `Expected data from ${path} to be an object.`
      );
      data.should.not.eql(
        {verifiablePresentationRequest},
        `Expected data from ${path} to not match Vp from initial step.`
      );
      should.exist(
        data.verifiablePresentationRequest,
        'Expected data to have property "verifiablePresentationRequest"'
      );
      data.verifiablePresentationRequest.should.be.an(
        'object',
        'Expected Vp to be an object'
      );
      should.exist(
        data.verifiablePresentationRequest.interact,
        'Expected Vp to have property `interact`.'
      );
      const {interact} = data.verifiablePresentationRequest;
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
      const interactResponse = await api.post(
        {path: interactService.serviceEndpoint});
      console.log({interactResponse});
    });
  });
  describe(`${exchangeInstance}/:stepId`, () => {

  });
  describe(`${exchangeInstance}/:stepId/delegate`, () => {

  });
});
