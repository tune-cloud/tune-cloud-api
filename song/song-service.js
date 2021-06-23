const {Constants} = require('genius-lyrics');

class SongService {
  constructor(client) {
    this.client = client;
    SongService.MAX_PAGE_SIZE = 50;
  }

  async getSongs(artistId, numberOfSongs, filter) {
    console.info(`Fetching songs for artist. artistId=${artistId}`);
    const artist = await this._fetchArtistInfo(artistId);
    const songs = await this._fetchSongs(artist, numberOfSongs, filter);
    // eslint-disable-next-line max-len
    console.info(`Completed song fetch for artist. artistId=${artistId}, artist=${artist.name}, results=${songs.length}`);

    return songs.map((song) =>{
      return {
        id: song.id,
        title: song.title,
        artist: {
          id: song.artist?.id,
          name: song.artist?.name,
          thumbnail: song.artist?.thumbnail,
        },
      };
    });
  }

  async _fetchArtistInfo(artistId) {
    console.info(`Fetching artist info. artistId=${artistId}`);
    const artist = await this.client.artists.get(artistId);
    console.info(`Completed fetching artist info. artistId=${artistId}`);
    return artist;
  }

  async _fetchSongs(artist, numberOfSongs, filter) {
    const songs = [];
    let pageNumber = 1;
    let page = null;
    while (this._shouldFetchMore(page, songs, numberOfSongs)) {
      const numberOfSongsToFetch = this
          ._calculatePageSize(numberOfSongs, songs);
      // eslint-disable-next-line max-len
      console.info(`Fetching songs. artistId=${artist.id}, page=${pageNumber}, numberOfSongsToFetch=${numberOfSongsToFetch}`);
      page = await this._fetchPage(artist, pageNumber,
          numberOfSongsToFetch, filter);
      console.info(`Completed page fetch. results=${page?.length}`);
      songs.push(...page);
      pageNumber++;
    }
    return songs;
  }

  _shouldFetchMore(page, songs, numberOfSongs) {
    return page == null || (page.length !==0 &&
      (songs.length < numberOfSongs || !numberOfSongs));
  }

  _calculatePageSize(numberOfSongs, songs) {
    if (!numberOfSongs ||
      numberOfSongs - songs.length >= SongService.MAX_PAGE_SIZE) {
      return SongService.MAX_PAGE_SIZE;
    } else {
      return numberOfSongs - songs.length;
    }
  }

  async _fetchPage(artist, page, perPage, filter) {
    try {
      const songs = await artist.songs({per_page: perPage,
        page: page, sort: 'popularity'});
      return this._filter(songs, filter);
    } catch (e) {
      if (e.message === Constants.NO_RESULT) {
        return [];
      } else {
        throw e;
      }
    }
  }

  _filter(songs, filter) {
    return songs.filter((song) => !filter?.artists || filter.artists
        .includes(song.artist.id))
        .filter((song) => !filter?.songs || filter.songs
            .includes(song.id));
  }
}

module.exports = SongService;
