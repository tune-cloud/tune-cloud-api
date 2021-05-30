const AWS = require('aws-sdk');

const client = new AWS.SecretsManager({
    region: "us-east-1"
});

module.exports = () => {
    return new Promise((resolve, reject) => {
        client.getSecretValue({SecretId: "genius/apiKey"}, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.SecretString);
            }
        });
    });
}
