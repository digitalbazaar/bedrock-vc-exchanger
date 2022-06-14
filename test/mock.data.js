export const testExchanges = {
  // one is a simple valid exchange
  oneStep: {
    steps: {
      initial: {
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
  multiStep: {
    steps: {
      initial: {
        // this is a multi step exchange
        next: 'end',
        verifiablePresentationRequest: {
          query: [],
          interact: {
            service: []
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
