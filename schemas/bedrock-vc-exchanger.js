/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
const constants = {
  CREDENTIALS_CONTEXT_V1_URL: 'https://www.w3.org/2018/credentials/v1',
  VERIFIABLE_PRESENTATION: 'VerifiablePresentation'
};

export const verifiablePresentation = {
  title: 'Verifiable Presentation',
  type: 'object',
  required: [
    '@context',
    'type'
  ],
  properties: {
    '@context': {
      title: 'JSON-LD context',
      description: 'A JSON-LD Context',
      anyOf: [{
        const: constants.CREDENTIALS_CONTEXT_V1_URL
      }, {
        type: 'object'
      }, {
        type: 'array',
        items: [{const: constants.CREDENTIALS_CONTEXT_V1_URL}],
        additionalItems: true
      }]
    },
    type: {
      title: 'JSON-LD type',
      description: 'A JSON-LD Type',
      anyOf: [{
        const: constants.VERIFIABLE_PRESENTATION
      }, {
        type: 'array',
        items: [{const: constants.VERIFIABLE_PRESENTATION}],
        additionalItems: true
      }]
    },
    holder: {
      title: 'Verifiable Credential Holder',
      type: 'string'
    },
    verifiableCredential: {
      title: 'Verifiable Credential',
      anyOf: [{
        type: 'object',
      }, {
        type: 'array',
        items: {type: 'object'}
      }]
    },
    proof: {type: 'object'}
  }
};

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

export const initiateExchange = {
  title: 'Initiate Exchange Request',
  anyOf: [object, vpRequestWithQuery]
};