/*!
 * Copyright (c) 2022-2025 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import * as database from '@bedrock/mongodb';
import {decodeId, encodeId, generateId} from './helpers.js';
import assert from 'assert-plus';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';
import {getAppIdentity} from '@bedrock/app-identity';
import {httpsAgent} from '@bedrock/https-agent';
import {ZcapClient} from '@digitalbazaar/ezcap';

const {util: {BedrockError}} = bedrock;

let ZCAP_CLIENT;
bedrock.events.on('bedrock.init', () => {
  // FIXME: Should this be the app identity or another "service" identity
  // create signer using the application's capability delegation key
  const {keys: {capabilityDelegationKey}} = getAppIdentity();

  ZCAP_CLIENT = new ZcapClient({
    agent: httpsAgent,
    delegationSigner: capabilityDelegationKey.signer(),
    SuiteClass: Ed25519Signature2020
  });
});

const COLLECTION_NAME = 'vc-exchanger-exchangeInstance';

bedrock.events.on('bedrock-mongodb.ready', async () => {
  await database.openCollections([COLLECTION_NAME]);
  // Exchange Instance Record
  // const record = {
  //   meta: {
  //     created: new Date(),
  //     updated: new Date()
  //   },
  //   exchangeInstance: {
  //     id: 'unique-bnid',
  //     exchangeId: 'id-of-exchange',
  //     expires: new Date(),
  //     sequence: 0,
  //     steps: {
  //       initial: {
  //         transactionId: 'some-bnid',
  //         data: null
  //       },
  //       middle: {
  //         transactionId: 'another-bnid',
  //         data: null
  //       },
  //       end: {
  //         transactionId: 'yet-another-bnid',
  //         data: null
  //       }
  //     }
  //   }
  // };

  await database.createIndexes([{
    collection: COLLECTION_NAME,
    fields: {'exchangeInstance.id': 1},
    options: {unique: true}
  }, {
    // automatically expire exchange instances
    collection: COLLECTION_NAME,
    fields: {'exchangeInstance.expires': 1},
    options: {
      unique: false,
      expireAfterSeconds: 0
    }
  }]);
});

/**
 * Generates and stores an exchange instance to be completed within the
 * configured time frame.
 *
 * @param {object} options - The options to use.
 * @param {object} options.exchangeId - The exchangeId.
 *
 * @returns {Promise<object>} The exchange instance.
 */
export async function createExchangeInstance({exchangeId}) {
  // generate exchange instance id
  const exchangeInstanceId = await generateId();
  // insert and return exchange instance
  const cfg = bedrock.config['vc-exchanger'];
  const {ttl} = cfg.exchangeInstances;
  await _insert({exchangeInstanceId, exchangeId, ttl});

  return {exchangeInstance: {id: exchangeInstanceId}};
}

export async function getExchangeInstanceRecord({
  exchangeInstanceId, explain = false
} = {}) {
  const projection = {_id: 0};

  exchangeInstanceId = decodeId({id: exchangeInstanceId});
  const collection = database.collections[COLLECTION_NAME];
  const query = {'exchangeInstance.id': exchangeInstanceId};

  if(explain) {
    // 'find().limit(1)' is used here because 'updateOne()' doesn't return a
    // cursor which allows the use of the explain function.
    const cursor = await collection.find(query, projection).limit(1);
    return cursor.explain('executionStats');
  }

  const exchangeInstanceRecord = await collection.findOne(query, projection);
  if(!exchangeInstanceRecord) {
    return null;
  }

  const {id} = exchangeInstanceRecord.exchangeInstance;
  exchangeInstanceRecord.exchangeInstance.id = encodeId({data: id});

  return exchangeInstanceRecord;
}

export function getStepIdByTransaction({
  exchangeInstance, transactionId
}) {
  const {steps} = exchangeInstance;
  for(const [stepId, step] of Object.entries(steps)) {
    if(step.transactionId === transactionId) {
      return stepId;
    }
  }

  throw new Error(`Step not found for "${transactionId}"`);
}

export async function initializeTransaction({
  exchangeInstance, stepId, explain = false
} = {}) {
  assert.object(exchangeInstance, 'exchangeInstance');
  assert.string(stepId, 'stepId');
  assert.bool(explain, 'explain');

  const exchangeInstanceId = decodeId({id: exchangeInstance.id});
  const transactionId = await generateId();
  const collection = database.collections[COLLECTION_NAME];

  const query = {
    'exchangeInstance.id': exchangeInstanceId,
    'exchangeInstance.sequence': exchangeInstance.sequence
  };
  const $inc = {
    'exchangeInstance.sequence': 1,
  };
  const $set = {
    'meta.updated': Date.now(),
    [`exchangeInstance.steps.${stepId}`]: {
      transactionId,
      data: null
    }
  };
  const options = {
    // return document after the update
    returnDocument: 'after',
    includeResultMetadata: true
  };

  if(explain) {
    // 'find().limit(1)' is used here because 'updateOne()' doesn't return a
    // cursor which allows the use of the explain function.
    const cursor = await collection.find(query).limit(1);
    return cursor.explain('executionStats');
  }

  // FIXME: Handle exceptions due to invalid sequence
  const result = await collection.findOneAndUpdate(
    query, {$inc, $set}, options);

  if(!result.value) {
    // no document found, exchange instance invalid or expired
    throw new BedrockError(
      'Invalid or expired exchange instance.', 'DataError', {
        httpStatusCode: 400,
        public: true
      });
  }

  return transactionId;
}

export async function storeResponseForExchangeStep({
  exchangeInstance, stepId, data, explain = false
} = {}) {
  assert.object(exchangeInstance, 'exchangeInstance');
  assert.string(stepId, 'stepId');
  assert.object(data, 'data');
  assert.bool(explain, 'explain');

  const {steps} = exchangeInstance;

  const step = steps[stepId];
  if(!step) {
    throw new Error('Step not found.');
  }

  if(step.data && Object.keys(step.data).length !== 0) {
    throw new Error('Step previously executed.');
  }

  const exchangeInstanceId = decodeId({id: exchangeInstance.id});
  const collection = database.collections[COLLECTION_NAME];

  const query = {
    'exchangeInstance.id': exchangeInstanceId,
    'exchangeInstance.sequence': exchangeInstance.sequence
  };
  const $inc = {
    'exchangeInstance.sequence': 1,
  };
  const $set = {
    'meta.updated': Date.now(),
    [`exchangeInstance.steps.${stepId}.data`]: data
  };
  const options = {
    // return document after the update
    returnDocument: 'after',
    includeResultMetadata: true
  };

  if(explain) {
    // 'find().limit(1)' is used here because 'updateOne()' doesn't return a
    // cursor which allows the use of the explain function.
    const cursor = await collection.find(query).limit(1);
    return cursor.explain('executionStats');
  }

  // FIXME: Handle exceptions due to invalid sequence
  const result = await collection.findOneAndUpdate(
    query, {$inc, $set}, options);

  if(!result.value) {
    // no document found, exchange instance invalid or expired
    throw new BedrockError(
      'Invalid or expired exchange instance.', 'DataError', {
        httpStatusCode: 400,
        public: true
      });
  }

  return result.value;
}

export async function delegateZcap({zcap, controller}) {
  // expiration is 5 minutes in the future
  const fiveMinExpiration = Date.now() + 5 * 60 * 1000;
  const expires = new Date(
    Math.min(Date.parse(zcap.expires, fiveMinExpiration))
  );
  return ZCAP_CLIENT.delegate({
    capability: zcap,
    controller,
    expires
  });
}

/**
 * Inserts a new challenge into storage.
 *
 * @param {object} options - The options to use.
 * @param {string} options.exchangeInstanceId - The id of the exchange instance.
 * @param {string} options.exchangeId - The id of the exchange .
 * @param {number} options.ttl - The time to live for the exchange instance.
 *
 * @returns {Promise<object>} Resolves with an object representing the
 *   challenge record.
 */
async function _insert({exchangeInstanceId, exchangeId, ttl} = {}) {
  assert.string(exchangeInstanceId, 'exchangeInstanceId');
  assert.string(exchangeId, 'exchangeId');
  assert.number(ttl, 'ttl');
  exchangeInstanceId = decodeId({id: exchangeInstanceId});

  // insert the configuration and get the updated record
  const now = Date.now();
  const meta = {created: now, updated: now};
  const expires = new Date(now + ttl);
  const record = {
    exchangeInstance: {
      id: exchangeInstanceId,
      exchangeId,
      expires,
      steps: {}
    },
    meta
  };
  try {
    const collection = database.collections[COLLECTION_NAME];
    await collection.insertOne(record);
    return record;
  } catch(e) {
    if(!database.isDuplicateError(e)) {
      throw e;
    }
    // should never happen; challenge values are sufficiently large and random
    throw new BedrockError(
      'Duplicate challenge.',
      'DuplicateError', {
        public: true,
        httpStatusCode: 409
      }, e);
  }
}

/**
 * @typedef ExplainObject - MongoDB explain object.
 */
