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

export const shouldHaveInteractService = ({interact}) => {
  interact.should.be.an('object', 'Expected `interact` to be an Object');
  should.exist(interact.service, 'Expected `interact.service` to exist.');
  interact.service.should.be.an(
    'Array',
    'Expected `interact.service` to be an Array.'
  );
  interact.service.length.should.eql(1, 'Expected one `interact.service`.');
  const [interactService] = interact.service;
  should.exist(
    interactService.type,
    'Expected `interactService.type` to exist.'
  );
  should.exist(
    interactService.serviceEndpoint,
    'Expected `interactService.serviceEndpoint` to exist.'
  );
  interactService.serviceEndpoint.should.be.a(
    'string',
    'Expected serviceEndpoint to be a string.'
  );
};

export const shouldBeDelegatedZcap = ({delegatedZcap, originalZcap}) => {
  delegatedZcap.should.not.eql(
    originalZcap,
    'Delegated zcap should not match original zcap.'
  );
  should.exist(
    delegatedZcap['@context'],
    'Expected delegatedZcap to have a context.'
  );
  delegatedZcap['@context'].should.be.an(
    'Array',
    'Expected delegatedZcap[\'@context\'] to be an array.'
  );
  delegatedZcap['@context'].should.eql(
    originalZcap['@context'],
    'Expected delegatedZcap[\'@context\'] to match ' +
      'originalZcap[\'@context\']'
  );
  should.exist(delegatedZcap.id, 'Expected delegatedZcap to have an id.');
  delegatedZcap.id.should.be.a(
    'string',
    'Expected "delegatedZcap.id" to be a string.'
  );
  delegatedZcap.id.should.not.equal(
    originalZcap.id,
    'Expected delegatedZcap.id to not match the original zcap\'s id.'
  );
  should.exist(
    delegatedZcap.controller,
    'Expected delegatedZcap to have a controller.'
  );
  delegatedZcap.controller.should.be.a(
    'string',
    'Expected "delegatedZcap.controller" to be a string.'
  );
  should.exist(
    delegatedZcap.expires,
    'Expected delegatedZcap to have expires.'
  );
  delegatedZcap.expires.should.be.a(
    'string',
    'Expected "delegatedZcap.expires" to be a string.'
  );
  should.exist(
    delegatedZcap.parentCapability,
    'Expected "delegatedZcap.parentCapability" to exist.'
  );
  delegatedZcap.parentCapability.should.be.a(
    'string',
    'Expected "delegatedZcap.parentCapability" to be a string.'
  );
  delegatedZcap.parentCapability.should.not.equal(
    originalZcap.parentCapability,
    'Expected "delegatedZcap.parentCapability" to not match ' +
      'original parentCapability.'
  );
  should.exist(
    delegatedZcap.invocationTarget,
    'Expected "delegatedZcap.invocationTarget" to exist.'
  );
  delegatedZcap.invocationTarget.should.be.a(
    'string',
    'Expected "delegatedZcap.invocationTarget" to be a string.'
  );
  delegatedZcap.invocationTarget.should.equal(
    originalZcap.invocationTarget,
    'Expected "delegatedZcap.invocationTarget" to match ' +
      'original invocationTarget.'
  );
  should.exist(
    delegatedZcap.proof,
    'Expected "delegatedZcap.proof" to exist.'
  );
  delegatedZcap.proof.should.be.an(
    'object',
    'Expected "delegatedZcap.proof" to be an object.'
  );
  delegatedZcap.proof.should.not.equal(
    originalZcap.proof,
    'Expected "delegatedZcap.proof" to not match ' +
      'original proof.'
  );
};
