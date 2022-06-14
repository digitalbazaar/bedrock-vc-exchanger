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
  transactionOne: {
    steps: {

    }
  },
  delegateOne: {
    steps: {

    }
  }
};
