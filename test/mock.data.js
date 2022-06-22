/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
export const testExchanges = {
  // one is a simple valid exchange
  oneStep: {
    steps: {
      initial: {
        next: null,
        verifiablePresentationRequest: {
          query: [],
          interact: {
            service: []
          }
        }
      }
    }
  },
  invalidServiceType: {
    steps: {
      initial: {
        next: null,
        verifiablePresentationRequest: {
          query: [],
          interact: {
            service: [{
              type: 'invalidServiceType',
              serviceEndpointBasePath: '/exchanges'
            }]
          }
        }
      }
    }
  },
  // sets up an invalid exchange because there is no initial step.
  noInitialStep: {
    steps: {
      notInitial: {
        // this is a one step exchange
        next: null,
        verifiablePresentationRequest: {
          query: [],
          interact: {
            service: []
          }
        }
      }
    }
  },
  multiStepUnmediated: {
    steps: {
      initial: {
        // this is a multi step exchange
        next: 'end',
        verifiablePresentationRequest: {
          query: [],
          interact: {
            service: [{
              type: 'UnmediatedPresentationService2021',
              serviceEndpointBasePath: '/exchanges/'
            }]
          }
        }
      },
      end: {
        next: null,
        verifiablePresentationRequest: {
          query: [],
          interact: {
            service: []
          }
        }
      }
    }
  },
  multiStepDelegated: {
    steps: {
      initial: {
        // this is a multi step exchange
        next: 'end',
        verifiablePresentationRequest: {
          query: [],
          interact: {
            service: [{
              type: 'UnmediatedPresentationService2021',
              serviceEndpointBasePath: '/exchanges/'
            }]
          }
        }
      },
      end: {
        next: null,
        verifiablePresentationRequest: {
          query: [],
          interact: {
            service: []
          }
        }
      }
    }
  }
};

export const presentations = {
  one: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    verifiableCredential: [{
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1'
      ],
      id: 'urn:uuid:86294362-4254-4f36-854f-3952fe42555d',
      type: [
        'VerifiableCredential',
        'TestCredential'
      ],
      issuer: 'did:key:z6MkptjaoxjyKQFSqf1dHXswP6EayYhPQBYzprVCPmGBHz9S',
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        id: 'did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b'
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: '2022-05-17T19:49:26Z',
        verificationMethod: 'did:key:z6MkptjaoxjyKQFSqf1dHXswP6EayYh' +
          'PQBYzprVCPmGBHz9S#z6MkptjaoxjyKQFSqf1dHXswP6EayYhPQBYzprVCPmGBHz9S',
        proofPurpose: 'assertionMethod',
        proofValue: 'z57ZtkyQJXVYK5UXDhcr4bEF4kkBpCpet9odGxBmeWNCTAwy' +
          '9bVbeDSGGzDHNveD4pgDJQudCqohptQf1Z4SPqphR'
      }
    }]
  },
  // contains a zcap
  two: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    capability: {
      // this is set in the test
      example: {}
    }
  }
};
