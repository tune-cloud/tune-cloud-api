const { expect } = require('chai');
const { BeforeAll, AfterAll, Given, When, Then } = require('@cucumber/cucumber');
const { ApolloServer } = require('apollo-server');
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');
const { readFileSync } = require('fs');
const fetch = require('cross-fetch');
const resolvers = require('../../resolvers');
const typeDefs = readFileSync('./schema.graphql').toString('utf-8')

let server;
let client;
let query;
let queryResult;
BeforeAll(()=>{
    server = new ApolloServer({
        typeDefs,
        resolvers,

        playground: {
            endpoint: "/dev/graphql"
        }
    });
    server.listen(4000, ()=>{
        console.log('server started on port 4000');
        console.log('http://localhost:4000')
    });

    client = new ApolloClient({
        link: new HttpLink({ uri: 'http://localhost:4000/', fetch}),
        cache: new InMemoryCache()
    });
});

AfterAll(()=>{
    server.stop();
})

Given('an artist name', ()=>{
   query = gql`
   query {
       artists(search: "The Beatles") {
           id
           name
       }
   }
   `
});

When('searching for an artist', ()=>{
   queryResult = client.query({
       query: query
   })
});

Then('the artist is returned', async ()=>{
    const result = await queryResult;
    const artists = result.data.artists;
    expect(artists[0].name).to.equal('The Beatles');
    expect(artists[0].id).to.not.be.null;
})
