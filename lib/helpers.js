/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as bedrock from '@bedrock/core';
import * as bnid from 'bnid';

const {util: {BedrockError}} = bedrock;
const {IdEncoder} = bnid;

const ID_ENCODER = new IdEncoder({
  encoding: 'base58',
  multibase: true,
  multihash: true,
  expectedSize: 16
});

export async function generateId() {
  // 128-bit random number, base58 multibase + multihash encoded
  return bnid.generateId({
    bitLength: 128,
    encoding: 'base58',
    multibase: true,
    multihash: true
  });
}

export function decodeId({id}) {
  // convert to `Buffer` for database storage savings
  try {
    return Buffer.from(bnid.decodeId({
      id,
      encoding: 'base58',
      multibase: true,
      multihash: true,
      expectedSize: 16
    }));
  } catch(e) {
    throw new BedrockError(
      'Invalid id.', 'DataError', {
        httpStatusCode: 400,
        public: true
      });
  }
}

export function encodeId({data}) {
  // convert `Buffer` to string
  try {
    return ID_ENCODER.encode(data);
  } catch(e) {
    throw new BedrockError(
      'Invalid data.', 'DataError', {
        httpStatusCode: 400,
        public: true
      });
  }
}
