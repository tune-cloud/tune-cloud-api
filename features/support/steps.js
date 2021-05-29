const { expect } = require('chai');
const { BeforeAll, AfterAll, Given, When, Then } = require('@cucumber/cucumber');
const { ApolloServer } = require('apollo-server');
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');
const { readFileSync } = require('fs');
const fetch = require('cross-fetch');
const config = require('config');
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
        link: new HttpLink({ uri: config.get('graphQL.url'), fetch}),
        cache: new InMemoryCache(),
        cors: true,
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

Given('search close to the artist', ()=>{
    query = gql`
        query {
            artists(search: "Front Bottoms") {
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

Then('an artist matching the search is returned', async ()=>{
    const result = await queryResult;
    const artists = result.data.artists;
    expect(artists[0].name).to.equal('The Front Bottoms');
    expect(artists[0].id).to.not.be.null;
});
