const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const Genius = require("genius-lyrics");
const SongService = require('./song-service');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('SongService', ()=> {
    describe('_fetchPage', ()=> {
        let artist;
        let songService;

        beforeEach(()=>{
            const Client = sinon.mock(new Genius.Client());
            artist = new Genius.Artist({}, "1234", null, {});
            songService = new SongService(Client);
        });

        it('should fetch a page of songs', async ()=> {
            const expectedSongs = [{
                id: 'id',
                title: 'title'
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
            const artistClient = new Genius.ArtistsClient();
            Client.artists = artistClient;

            const artist = new Genius.Artist({}, "1234", null, {});
            sinon.stub(artistClient, 'get').returns(artist);

            const expectedSongs = [{
                id: 'id',
                title: 'title'
            }];
            sinon.stub(artist, 'songs').onCall(0).returns(expectedSongs)
                .onCall(1).throws(new Error(Genius.Constants.NO_RESULT));

            const songService = new SongService(Client);
            const songs = await songService._fetchSongs('1234');

            expect(songs).to.deep.equal(expectedSongs);
        });
    });

    describe('getSongs', ()=> {
        it('should get songs',  async ()=>{
            const Client = sinon.mock(new Genius.Client());
            const artistClient = new Genius.ArtistsClient();
            Client.artists = artistClient;

            const artist = new Genius.Artist({}, "1234", null, {});
            sinon.stub(artistClient, 'get').returns(artist);

            const expectedSongs = [{
                id: 'id',
                title: 'title',
                artist: {
                    id: 'id',
                    name: 'name'
                }
            }];
            sinon.stub(artist, 'songs').onCall(0).returns(expectedSongs)
                .onCall(1).throws(new Error(Genius.Constants.NO_RESULT));

            const songService = new SongService(Client);
            const songs = await songService.getSongs('1234');

            expect(songs).to.deep.equal(expectedSongs);
        });
    });
})
