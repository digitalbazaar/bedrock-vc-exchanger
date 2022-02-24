/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import bedrock from 'bedrock';
const {config} = bedrock;

const namespace = 'vc-exchanger';
const cfg = config[namespace] = {};

cfg.exchangeInstances = {
  // TTL for exchange instances in database.
  ttl: 15 * 1 * 60 * 1000 // 15min
};

// Configures the supported exchanges for exchanger service
cfg.exchanges = {};

const exchange = '/exchanges/:exchangeId';
const exchangeInstance = '/exchange-instances/:exchangeInstanceId';
cfg.routes = {
  exchange,
  exchangeTransaction: `${exchange}/:transactionId`,
  exchangeInstanceStep: `${exchangeInstance}/:stepId`,
  exchangeInstanceStepCapabilities: `${exchangeInstance}/:stepId/delegate`,
};
