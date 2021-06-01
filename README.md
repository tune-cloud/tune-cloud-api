# ![tune-cloud-logo](https://github.com/tune-cloud/tune-cloud-images/blob/main/logo.png?raw=true) Tune Cloud API [![Build and Deploy](https://github.com/tune-cloud/tune-cloud-api/actions/workflows/build.yml/badge.svg)](https://github.com/tune-cloud/tune-cloud-api/actions/workflows/build.yml) 
GraphQL api to query song and artist information using the [Genius API.](https://genius.com/)

## [Playground](https://nbl977s1aj.execute-api.us-east-1.amazonaws.com/dev/graphql)

# Build
To build `tune-cloud-api` run the following command.

```shell
npm install
```

# Tests

## Unit
To run all unit tests run the following command:

```shell
npm test
```

## End to End
To run all unit tests run the following command:

```shell
npm run test:e2e
```

# Run

to start `tune-cloud-api` locally run the following command:

```shell
npm run start
```

# Deploy
To deploy `tune-cloud-api` from local run the following command:
```shell
serverless deploy
```

# Scanning

All Scans are ran as part of the build pipeline.

## Sonar

The sonar client can be used to run locally.

## Snyk
to run Snyk scans locally run the following command:

```shell
snyk test
```

## CodeQL
TODO: Run scan locally
