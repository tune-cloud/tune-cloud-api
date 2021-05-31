const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const AWS = require('aws-sdk');
const SecretsManager = require('./secrets-manager');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('SecretsManager', ()=>{
  describe('getSecrets', ()=>{
    it('Should get secrets', ()=>{
      const client = new AWS.SecretsManager();
      const secret = {secret: 'value'};
      sinon.stub(client, 'getSecretValue').yields(null, {
        SecretString: JSON.stringify(secret),
      });
      const secretsManager = new SecretsManager(client);
      return expect(secretsManager.getSecrets('secretID'))
          .to.eventually.deep.equal(secret);
    });

    it('Should throw an error if failed to get secret', ()=>{
      const client = new AWS.SecretsManager();
      const error = new Error();
      sinon.stub(client, 'getSecretValue').yields(error, null);
      const secretsManager = new SecretsManager(client);
      return expect(secretsManager.getSecrets('secretID'))
          .to.eventually.rejectedWith(error);
    });
  });
});
