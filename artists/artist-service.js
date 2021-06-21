class ArtistService {
  constructor(client) {
    this.client = client;
  }

  async find(searchQuery) {
    console.info(`Starting search for artist. query=${searchQuery}`);
    const songs = this.client.songs.search(searchQuery);
    const artists = (await songs).map((song) => {
      return {id: song.artist.id, name: song.artist.name,
        thumbnail: song.artist.thumbnail};
    });

    const resultsWithoutDuplicates =
      [...new Map(artists.map((item) => [item.id, item])).values()];

    // eslint-disable-next-line max-len
    console.info(`Completed search for artist. results=${resultsWithoutDuplicates.length}`);

    return resultsWithoutDuplicates;
  }
}

module.exports = ArtistService;
