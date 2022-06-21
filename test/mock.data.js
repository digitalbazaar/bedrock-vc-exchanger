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
        verificationMethod: 'did:key:z6MkptjaoxjyKQFSqf1dHXswP6EayYhPQBYzprVCPmGBHz9S#z6MkptjaoxjyKQFSqf1dHXswP6EayYhPQBYzprVCPmGBHz9S',
        proofPurpose: 'assertionMethod',
        proofValue: 'z57ZtkyQJXVYK5UXDhcr4bEF4kkBpCpet9odGxBmeWNCTAwy9bVbeDSGGzDHNveD4pgDJQudCqohptQf1Z4SPqphR'
      }
    }]
  },
  // contains a zcap
  two: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    capability: [{
      '@context': [
        'https://w3id.org/zcap/v1',
        'https://w3id.org/security/suites/ed25519-2020/v1'
      ],
      id: 'urn:uuid:86f2c11e-9bb4-4f03-b71d-2852c04856ec',
      controller: 'did:key:z6MkogR2ZPr4ZGvLV2wZ7cWUamNMhpg3bkVeXARDBrKQVn2c',
      parentCapability: 'urn:zcap:root:https%3A%2F%2Fzcap.example%2Fitems',
      invocationTarget: 'https://zcap.example/items',
      expires: '2022-06-20T18:02:40Z',
      proof: {
        type: 'Ed25519Signature2020',
        created: '2022-06-20T17:57:40Z',
        verificationMethod: 'did:key:z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b#z6MktKwz7Ge1Yxzr4JHavN33wiwa8y81QdcMRLXQsrH9T53b',
        proofPurpose: 'capabilityDelegation',
        capabilityChain: [
          'urn:zcap:root:https%3A%2F%2Fzcap.example%2Fitems'
        ],
        proofValue: 'zmGMxhr8Puv1WQFvFBonPaT9VoTeSFbmL5sXX37EQKpdeZbE17eQBc1G6T44bVWSitP2dg6cSCjW8AN2LtS3byNL'
      }
    }]
  }
};
