const Genius = require("genius-lyrics");
const ArtistService = require('./artists/artist-service');

const artistService = (async ()=>{
    const secret = await require('./secret/secret')();
    return new ArtistService(new Genius.Client(JSON.parse(secret).GENIUS_API_KEY));
})();


module.exports = {
    Query: {
        async artists(parent, args, context, info) {
            const service = await artistService;
            return service.find(args.search).then((result) => {
                console.log(result);
                return result;
            });
        },
    },
};
