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
    it('should get a VP from a valid service with only one step.', async () => {
      const path = 'exchanges/oneStep';
      const {response, error, data} = await api.post({path});
      shouldNotError({response, error, data, path});
      const {
        verifiablePresentationRequest
      } = testExchanges.oneStep.steps.initial;
      shouldHaveVpForStep({data, path, verifiablePresentationRequest});
    });
    it('should get a VP from a valid service with two steps.', async () => {
      const path = 'exchanges/multiStep';
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

  });
  describe(`${exchange}/:transactionId`, () => {

  });
  describe(`${exchangeInstance}/:stepId`, () => {

  });
  describe(`${exchangeInstance}/:stepId/delegate`, () => {

  });
});
