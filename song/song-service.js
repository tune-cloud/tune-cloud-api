const {Constants} = require('genius-lyrics');

class SongService {
    constructor(client) {
        this.client = client;
    }

    async getSongs(artistId) {
        const songs = await this._fetchSongs(artistId);
        console.log(songs);
        return songs.map(song =>{
            return {
                id: song.id,
                title: song.title,
                artist: {
                    id: song.artist?.id,
                    name: song.artist?.name
                }
            }
        });
    }

    async _fetchSongs(artistId) {
        const artist = await this.client.artists.get(artistId);
        const songs = [];
        let pageNumber = 1;
        let page = null;
        while (page == null || page.length !== 0) {
            page = await this._fetchPage(artist, pageNumber);
            songs.push(...page);
            pageNumber++;
        }
        return songs;
    }

    async _fetchPage(artist, page) {
        try {
            return await artist.songs({per_page: 50, page: page})
        } catch (e) {
            if (e.message === Constants.NO_RESULT) {
                return [];
            } else {
                throw e;
            }
        }
    }
}

module.exports = SongService;
