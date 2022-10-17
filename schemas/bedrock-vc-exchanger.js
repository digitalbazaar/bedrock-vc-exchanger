/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const object = {
  title: 'An object',
  description: 'An object',
  type: 'object'
};

const vpRequestWithQuery = {
  title: 'VP Request With Query',
  description: 'A Verifiable Presentations Request with a Query',
  type: 'object',
  additionalItems: true,
  required: ['query'],
  properties: {
    query: {
      title: 'VP Request Query',
      type: 'array',
      items: {type: 'object'}
    }
  }
};

export const initiateExchange = () => ({
  title: 'Initiate Exchange Request',
  anyOf: [object, vpRequestWithQuery]
});
