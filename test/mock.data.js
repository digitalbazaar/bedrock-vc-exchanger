export const testExchanges = {
  // one is a simple valid exchange
  oneStep: {
    steps: {
      initial: {
        // this is a one step exchange
        next: null,
        verifiablePresentationRequest: {
          query: []
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
          query: []
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
          query: []
        }
      },
      end: {
        next: null,
        verifiablePresentationRequest: {
          query: []
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
