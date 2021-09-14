const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs values($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    await this._cacheService.delete(`playlistsong-${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistsSong(playlistId) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._cacheService.get(`playlistsong-${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      // jika di cache tidak ada maka diambil dari database
      const query = {
        text: `SELECT playlistsongs.id, songs.title, songs.performer FROM playlistsongs JOIN 
            songs on playlistsongs.song_id=songs.id WHERE playlistsongs.playlist_id = $1`,
        values: [playlistId],
      };
      const result = await this._pool.query(query);
      // Lagu akan disimpan pada cache sebelum fungsi SongsFromPlaylist dikembalikan
      await this._cacheService.set(`playlistsong-${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deleteSongPlaylists(playlistId, songId) {
    const query = {
      text: 'delete from playlistsongs where playlist_id = $1 and song_id = $2 returning id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError(' Lagu gagal dihapus');
    }
    await this._cacheService.delete(`playlistsong-${playlistId}`);
  }

  async verifyPlaylistSongOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlists = result.rows[0];
    if (playlists.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistSongOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      } try {
        await this._collaborationService.verifyCollabolator(playlistId, userId);
        console.log();
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistSongsService;
