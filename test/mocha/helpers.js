/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as didKey from '@digitalbazaar/did-method-key';
import {getCapabilitySigners, ZcapClient} from '@digitalbazaar/ezcap';
import {Agent} from 'node:https';
import {decodeSecretKeySeed} from 'bnid';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';
import {httpClient} from '@digitalbazaar/http-client';

const agent = new Agent({rejectUnauthorized: false});
const baseUrl = 'https://localhost:18443';
const didKeyDriver = didKey.driver();

export const api = {
  async post({path, json, headers}) {
    const url = path.startsWith('http') ? path : `${baseUrl}/${path}`;
    return _makeRequest({url, json, headers, method: 'POST'});
  },
  async put({path, json, headers}) {
    const url = path.startsWith('http') ? path : `${baseUrl}/${path}`;
    return _makeRequest({url, json, headers, method: 'PUT'});
  },
  async get({path, headers}) {
    const url = path.startsWith('http') ? path : `${baseUrl}/${path}`;
    return _makeRequest({url, headers, method: 'GET'});
  }
};

export const delegateRootZcap = async ({
  secretKeySeed = process.env.DID_KEY_SECRET
} = {}) => {
  const seed = secretKeySeed ? decodeSecretKeySeed({secretKeySeed}) : undefined;
  const {didDocument, keyPairs} = await didKeyDriver.generate({seed});
  const {delegationSigner} = getCapabilitySigners({didDocument, keyPairs});
  const zcapClient = new ZcapClient({
    agent,
    delegationSigner,
    SuiteClass: Ed25519Signature2020
  });
  const invocationTarget = `${baseUrl}/delegateExample`;
  const controller = 'did:key:z6MkogR2ZPr4ZGvLV2wZ7cWUamNMhpg3bkVeXARDBrKQVn2c';
  return zcapClient.delegate({invocationTarget, controller});
};

async function _makeRequest({url, json, headers, method}) {
  let response;
  let error;
  try {
    response = await httpClient(url, {
      method, json, headers, agent
    });
  } catch(e) {
    error = e;
  }
  return {response, error, data: response?.data};
}

