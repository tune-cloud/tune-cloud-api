const {expect} = require('chai');
const {BeforeAll, AfterAll, Given, When, Then,
  setDefaultTimeout} = require('@cucumber/cucumber');
const {ApolloServer} = require('apollo-server');
const {ApolloClient, InMemoryCache, gql, HttpLink} = require('@apollo/client');
const {readFileSync} = require('fs');
const fetch = require('cross-fetch');
const config = require('config');
const resolvers = require('../../resolvers');
const typeDefs = readFileSync('./schema.graphql').toString('utf-8');

let server;
let client;
let query;
let queryResult;
let artistId;
let filter = null;
setDefaultTimeout(300 * 1000);

BeforeAll(()=>{
  server = new ApolloServer({
    typeDefs,
    resolvers,

    playground: {
      endpoint: '/dev/graphql',
    },
    cors: true,
  });
  server.listen(4000, ()=>{
    console.log('server started on port 4000');
    console.log('http://localhost:4000');
  });

  client = new ApolloClient({
    link: new HttpLink({uri: config.get('graphQL.url'), fetch}),
    cache: new InMemoryCache(),
  });
});

AfterAll(()=>{
  server.stop();
});

Given('an artist name', ()=>{
  query = gql`
   query {
       artists(search: "The Beatles") {
           id
           name
       }
   }
   `;
});

Given('search close to the artist', ()=>{
  query = gql`
        query {
            artists(search: "Front Bottoms") {
                id
                name
            }
        }
    `;
});

Given('a valid artist id', async ()=>{
  const query = gql`
        query {
            artists(search: "Front Bottoms") {
                id
                name
            }
        }
    `;
  const queryResult = client.query({
    query: query,
  });

  artistId = (await queryResult).data.artists[0].id;
});

Given('a valid artist id with multiple bands', async ()=>{
  const query = gql`
    query {
      artists(search: "Kevin Devine") {
        id
        name
      }
    }
  `;
  const queryResult = client.query({
    query: query,
  });

  artistId = (await queryResult).data.artists[0].id;
});

Given('a song filter', async ()=>{
  const query = gql`
        query {
            songs(artistId: ${artistId}) {
                id
                title
                artist {
                    id
                    name
                }
            }
        }
    `;
  const queryResult = await client.query({
    query: query,
  });

  filter = {
    songs: queryResult.data.songs.slice(0, 2).map((song) => song.id),
  };
});

Given('an artist filter', async ()=>{
  filter = {
    artits: [artistId],
  };
});

When('searching for an artist', ()=>{
  queryResult = client.query({
    query: query,
  });
});

When('getting songs', ()=>{
  const songs = filter?.songs ? `[${filter.songs.toString()}]` : null;
  const artists = filter?.artits ? `[${filter.artits.toString()}]` : null;
  const query = gql`
        query {
            songs(artistId: ${artistId}, filter: {
                songs: ${songs},
                artists: ${artists}
            }) {
                id
                title
                artist {
                    id
                    name
                }
            }
        }
    `;
  queryResult = client.query({
    query: query,
  });
});

Then('the artist is returned', async ()=>{
  const result = await queryResult;
  const artists = result.data.artists;
  expect(artists[0].name).to.equal('The Beatles');
  expect(artists[0].id).to.not.be.null;
});

Then('an artist matching the search is returned', async ()=>{
  const result = await queryResult;
  const artists = result.data.artists;
  expect(artists[0].name).to.equal('The Front Bottoms');
  expect(artists[0].id).to.not.be.null;
});

Then('songs are returned', async ()=>{
  const result = await queryResult;
  const songs = result.data.songs;

  expect(songs[0].id).to.not.be.null;
  expect(songs[0].title).to.not.be.null;
  expect(songs[0].artist.id).to.not.be.null;
  expect(songs[0].artist.name).to.equal('The Front Bottoms');
});

Then('a filtered song list is returned', async ()=> {
  const result = await queryResult;
  const songs = result.data.songs;

  expect(songs.length).to.be.equal(2);
});

Then('a song list filtered on artist is returned', async ()=>{
  const result = await queryResult;
  const songs = result.data.songs;

  expect(songs.map((song)=>song.artist.id)
      .every((artist)=> expect(artist).to.be.equal(artistId)))
      .to.be.equal(true);
});
