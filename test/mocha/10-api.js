/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {api} from './helpers.js';

const exchange = '/exchanges/:exchangeId';
const exchangeInstance = '/exchange-instances/:exchangeInstanceId';

describe('api', () => {
  describe(exchange, () => {
    it('should get a VP from a valid service.', async () => {
      const path = 'exchanges/oneStep';
      const {response, error, data} = await api.post({path});
      should.not.exist(error, `Expected path ${path} to not error.`);
      should.exist(response, `Expected path ${path} to return a response.`);
      should.exist(data, `Expected path ${path} to return data.`);
    });
    it('should error if service doesn\'t exist.', async () => {
      const path = 'exchanges/nonExistent';
      const {response, error, data} = await api.post({path});
      should.exist(error, `Expected path ${path} to error.`);
      should.not.exist(
        response, `Expected path ${path} to not return a response.`);
      should.not.exist(data, `Expected path ${path} to not return data.`);
    });
  });
  describe(`${exchange}/:transactionId`, () => {

  });
  describe(`${exchangeInstance}/:stepId`, () => {

  });
  describe(`${exchangeInstance}/:stepId/delegate`, () => {

  });
});
