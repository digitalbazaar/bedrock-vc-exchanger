/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

import {httpClient} from '@digitalbazaar/http-client';
import {Agent} from 'node:https';

const agent = new Agent({rejectUnauthorized: false});
const baseUrl = 'https://localhost:18443';

export const api = {
  async post({path, json, headers}) {
    const url = `${baseUrl}/${path}`;
    let response;
    let error;
    try {
      response = await httpClient.post(url, {agent, json, headers});
    } catch(e) {
      error = e;
    }
    return {response, error, data: response?.data};
  },
  async get({path, headers}) {
    const url = `${baseUrl}/${path}`;
    let response;
    let error;
    try {
      response = await httpClient.get(url, {agent, headers});
    } catch(e) {
      error = e;
    }
    return {response, error, data: response?.data};
  }
};
