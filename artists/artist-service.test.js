const sinon = require('sinon');
const {expect} = require('chai');
const Genius = require('genius-lyrics');
const ArtistService = require('./artist-service');

describe('ArtistService', ()=>{
  describe('find', ()=>{
    it('should find artists', async ()=>{
      const Client = sinon.mock(new Genius.Client());
      const songsClient = new Genius.SongsClient();
      const expectedArtist = {id: 1, name: 'artist', thumbnail: 'https://img.jpg'};
      sinon.stub(songsClient, 'search').returns([{
        name: 'song',
        artist: expectedArtist,
      }]);
      Client.songs = songsClient;

      const artistService = new ArtistService(Client);
      const artists = await artistService.find('artist');
      expect(artists).to.deep.equal([expectedArtist]);
    });
  });
});
