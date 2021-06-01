const AWS = require('aws-sdk');
const Genius = require('genius-lyrics');
const ArtistService = require('./artists/artist-service');
const SongService = require('./song/song-service');
const SecretsManager = require('./secrets/secrets-manager');

const client = new AWS.SecretsManager({
  region: 'us-east-1',
});
const secretsManager = new SecretsManager(client);

const artistService = (async ()=>{
  const apiKey = await secretsManager.getSecrets('genius/apiKey');
  return new ArtistService(new Genius.Client(apiKey.GENIUS_API_KEY));
})();

const songService = (async ()=>{
  const apiKey = await secretsManager.getSecrets('genius/apiKey');
  return new SongService(new Genius.Client(apiKey.GENIUS_API_KEY));
})();


module.exports = {
  Query: {
    async artists(parent, args, context, info) {
      return (await artistService).find(args.search).then((result) => {
        return result;
      }).catch((e)=>{
        const error =
          new Error(`error searching for artist. query=${args.search}`);
        console.error(error);
        console.error(e);
        throw error;
      });
    },
    async songs(parent, args, context, info) {
      return (await songService).getSongs(args.artistId)
          .then((result) => {
            const filteredResults = result
                .filter((song) => !args.filter?.artists || args.filter.artists
                    .includes(song.artist.id))
                .filter((song) => !args.filter?.songs || args.filter.songs
                    .includes(song.id));
            return filteredResults;
          }).catch((e) => {
            const error =
              new Error(`error getting songs for artist=${args.artistId}`);
            console.error(error);
            console.error(e);
            throw error;
          });
    },
  },
};
