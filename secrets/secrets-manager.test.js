const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const AWS = require('aws-sdk');
const SecretsManager = require('./secrets-manager');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('SecretsManager', ()=>{
    describe('getSecrets', ()=>{
        it('Should get secrets', ()=>{
            const client = new AWS.SecretsManager();
            const secret = {secret: "value"}
            sinon.stub(client, 'getSecretValue').yields(null, {
                SecretString: JSON.stringify(secret)
            })
            const secretsManager = new SecretsManager(client);
            return expect(secretsManager.getSecrets('secretID')).to.eventually.deep.equal(secret);
        });
    })
})
