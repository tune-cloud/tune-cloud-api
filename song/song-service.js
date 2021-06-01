const {Constants} = require('genius-lyrics');

class SongService {
  constructor(client) {
    this.client = client;
  }

  async getSongs(artistId) {
    console.info(`Fetching songs for artist. artistId=${artistId}`);
    const songs = await this._fetchSongs(artistId);
    // eslint-disable-next-line max-len
    console.info(`Completed song fetch for artist. artistId=${artistId}, results=${songs.length}`);

    return songs.map((song) =>{
      return {
        id: song.id,
        title: song.title,
        artist: {
          id: song.artist?.id,
          name: song.artist?.name,
        },
      };
    });
  }

  async _fetchSongs(artistId) {
    console.info(`Fetching artist info. artistId=${artistId}`);
    const artist = await this.client.artists.get(artistId);
    console.info(`Completed fetching artist info. artistId=${artistId}`);
    const songs = [];
    let pageNumber = 1;
    let page = null;
    while (page == null || page.length !== 0) {
      console.info(`Fetching songs. artistId=${artistId}, page=${pageNumber}`);
      page = await this._fetchPage(artist, pageNumber);
      console.info(`Completed page fetch. results=${page.length}`);
      songs.push(...page);
      pageNumber++;
    }
    return songs;
  }

  async _fetchPage(artist, page) {
    try {
      return await artist.songs({per_page: 50, page: page, sort: 'popularity'});
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
