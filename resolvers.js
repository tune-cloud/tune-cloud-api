const Genius = require("genius-lyrics");
const Client = new Genius.Client();
const ArtistService = require('./artists/artist-service');

const artistService = new ArtistService(Client);

const resolvers = {
    Query: {
        artists(parent, args, context, info) {
            return artistService.find(args.search).then((result) => {
                console.log(result);
                return result;
            });
        },
    },
};

module.exports = resolvers;
