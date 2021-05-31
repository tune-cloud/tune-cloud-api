class ArtistService {
  constructor(client) {
    this.client = client;
  }

  async find(searchQuery) {
    const songs = this.client.songs.search(searchQuery);
    const artists = (await songs).map((song) => {
      return {id: song.artist.id, name: song.artist.name};
    });
    return [...new Map(artists.map((item) => [item.id, item])).values()];
  }
}

module.exports = ArtistService;
