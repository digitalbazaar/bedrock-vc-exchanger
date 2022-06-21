export const shouldNotError = ({response, error, data, path}) => {
  should.not.exist(error, `Expected path ${path} to not error.`);
  should.exist(response, `Expected path ${path} to return a response.`);
  should.exist(data, `Expected path ${path} to return data.`);
};

export const shouldError = ({response, error, data, path, expected = {}}) => {
  should.exist(error, `Expected path ${path} to error.`);
  should.not.exist(response, `Expected path ${path} to not return a response.`);
  should.not.exist(data, `Expected path ${path} to not return data.`);
  if(expected.status) {
    error.response.status.should.equal(
      expected.status,
      `Expected status ${expected.status} from ${path}`
    );
  }
};

export const shouldHaveVpForStep = ({
  data,
  path,
  verifiablePresentationRequest
}) => {
  data.should.be.an(
    'object',
    `Expected data from ${path} to be an object.`
  );
  data.should.eql(
    {verifiablePresentationRequest},
    `Expected data from ${path} to match Vp from initial step.`
  );
};

export const shouldHaveVpWithTransactionId = ({
  data,
  path,
  verifiablePresentationRequest
}) => {
  data.should.be.an(
    'object',
    `Expected data from ${path} to be an object.`
  );
  data.should.not.eql(
    {verifiablePresentationRequest},
    `Expected data from ${path} to not match Vp from initial step.`
  );
  should.exist(
    data.verifiablePresentationRequest,
    'Expected data to have property "verifiablePresentationRequest"'
  );
  data.verifiablePresentationRequest.should.be.an(
    'object',
    'Expected Vp to be an object'
  );
  should.exist(
    data.verifiablePresentationRequest.interact,
    'Expected Vp to have property `interact`.'
  );
};
