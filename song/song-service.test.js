const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Genius = require('genius-lyrics');
const SongService = require('./song-service');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('SongService', ()=> {
  let artist;
  let songService;

  beforeEach(()=>{
    const Client = sinon.mock(new Genius.Client());
    artist = new Genius.Artist({}, '1234', null, {});

    const artistClient = new Genius.ArtistsClient();
    sinon.stub(artistClient, 'get').returns(artist);
    Client.artists = artistClient;

    songService = new SongService(Client);
  });

  describe('_fetchPage', ()=> {
    it('should fetch a page of songs', async ()=> {
      const expectedSongs = [{
        id: 'id',
        title: 'title',
      }];

      sinon.stub(artist, 'songs').returns(expectedSongs);

      const songs = await songService._fetchPage(artist, 1);
      expect(songs).to.deep.equal(expectedSongs);
    });

    it('should return an empty list when results are not found', async ()=> {
      sinon.stub(artist, 'songs').throws(new Error(Genius.Constants.NO_RESULT));

      const songs = await songService._fetchPage(artist, 1);
      expect(songs).to.deep.equal([]);
    });

    it('should throw an error if failed to fetch page', ()=> {
      sinon.stub(artist, 'songs').throws(new Error());
      return expect(songService._fetchPage(artist, 1)).to.eventually.throw;
    });
  });

  describe('_fetchSongs', ()=>{
    it('should fetch each song for an artist', async ()=>{
      const Client = sinon.mock(new Genius.Client());
      Client.artists = new Genius.ArtistsClient();

      const artist = new Genius.Artist({}, '1234', null, {});

      const expectedSongs = [{
        id: 'id',
        title: 'title',
      }];
      sinon.stub(artist, 'songs').onCall(0).returns(expectedSongs)
          .onCall(1).throws(new Error(Genius.Constants.NO_RESULT));

      const songService = new SongService(Client);
      const songs = await songService._fetchSongs(artist);

      expect(songs).to.deep.equal(expectedSongs);
    });
    it('should fetch only the desired page size', async ()=>{
      const Client = sinon.mock(new Genius.Client());
      const artistClient = new Genius.ArtistsClient();
      Client.artists = artistClient;

      const artist = new Genius.Artist({}, '1234', null, {});
      sinon.stub(artistClient, 'get').returns(artist);

      const expectedSongs = [{
        id: 'id',
        title: 'title',
      }];
      const songsStub = sinon.stub(artist, 'songs').onCall(0)
          .returns(expectedSongs).onCall(1)
          .throws(new Error(Genius.Constants.NO_RESULT));

      const songService = new SongService(Client);
      const songs = await songService._fetchSongs(artist, 1);

      expect(songs).to.deep.equal(expectedSongs);
      expect(songsStub.getCalls()[0].args).to.deep.equal([{per_page: 1,
        page: 1, sort: 'popularity'}]);
    });
  });

  describe('getSongs', ()=> {
    it('should get songs', async ()=>{
      const expectedSongs = [{
        id: 'id',
        title: 'title',
        artist: {
          id: 'id',
          name: 'name',
          thumbnail: 'https://imgur.jpg',
        },
      }];
      sinon.stub(artist, 'songs').onCall(0).returns(expectedSongs)
          .onCall(1).throws(new Error(Genius.Constants.NO_RESULT));

      const songs = await songService.getSongs('1234');

      expect(songs).to.deep.equal(expectedSongs);
    });
  });

  describe('_filter', ()=>{
    it('should filter on artistId', ()=>{
      const songs = [{
        title: 'title',
        artist: {
          id: 1,
        },
      },
      {
        title: 'title',
        artist: {
          id: 2,
        },
      }];

      const expectedSongs = [{
        title: 'title',
        artist: {
          id: 1,
        }}];

      const filteredSongs = songService._filter(songs, {artists: [1]});
      expect(filteredSongs).to.deep.equal(expectedSongs);
    });

    it('should filter on songId', ()=>{
      const songs = [{
        title: 'title',
        id: 1,
      },
      {
        title: 'title',
        id: 2,
      }];

      const expectedSongs = [{
        title: 'title',
        id: 1,
      }];

      const filteredSongs = songService._filter(songs, {songs: [1]});
      expect(filteredSongs).to.deep.equal(expectedSongs);
    });
  });
});
