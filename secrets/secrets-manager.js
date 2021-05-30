class SecretsManager {
    constructor(client) {
        this.client = client;
    }

    getSecrets(id) {
        return new Promise((resolve, reject) => {
            this.client.getSecretValue({SecretId: id}, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data.SecretString));
                }
            });
        });
    }
}

module.exports = SecretsManager;
