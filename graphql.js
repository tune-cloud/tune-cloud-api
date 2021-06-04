const {ApolloServer} = require('apollo-server-lambda');
const {readFileSync} = require('fs');
const resolvers = require('./resolvers');
const typeDefs = readFileSync('./schema.graphql').toString('utf-8');

const server = new ApolloServer({
  typeDefs,
  resolvers,

  playground: {
    endpoint: '/dev/graphql',
  },
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: ['http://localhost:3000',
      'https://tune-cloud.github.io'],
  },
});
