/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

const constants = {
  CREDENTIALS_CONTEXT_V1_URL: 'https://www.w3.org/2018/credentials/v1',
  VERIFIABLE_PRESENTATION: 'VerifiablePresentation'
};

export const verifiablePresentation = schemas => {
  const schema = schemas.verifiablePresentation;
  return schema({
    required: ['@context', 'type'],
    properties: {
      '@context': {
        title: 'JSON-LD context',
        description: 'A JSON-LD Context',
        type: 'array',
        prefixItems: [{const: constants.CREDENTIALS_CONTEXT_V1_URL}],
        items: [{type: 'string'}]
      },
    }
  });
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

export const initiateExchange = () => ({
  title: 'Initiate Exchange Request',
  anyOf: [object, vpRequestWithQuery]
});
