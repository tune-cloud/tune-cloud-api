const {ApolloServer} = require('apollo-server');
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

server.listen(4000, ()=>{
  console.log('server started on port 4000');
  console.log('http://localhost:4000');
});
