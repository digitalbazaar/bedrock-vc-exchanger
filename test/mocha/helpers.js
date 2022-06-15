/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

import {httpClient} from '@digitalbazaar/http-client';
import {Agent} from 'node:https';

const agent = new Agent({rejectUnauthorized: false});
const baseUrl = 'https://localhost:18443';

const makeRequest = async ({url, json, headers, method}) => {
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
};

export const api = {
  async post({path, json, headers}) {
    const url = path.startsWith('http') ? path : `${baseUrl}/${path}`;
    return makeRequest({url, json, headers, method: 'POST'});
  },
  async put({path, json, headers}) {
    const url = path.startsWith('http') ? path : `${baseUrl}/${path}`;
    return makeRequest({url, json, headers, method: 'PUT'});
  },
  async get({path, headers}) {
    const url = path.startsWith('http') ? path : `${baseUrl}/${path}`;
    return makeRequest({url, headers, method: 'GET'});
  }
};
