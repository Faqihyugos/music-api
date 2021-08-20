const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const InvanrianError = require('../../exceptions/InvariantError');

class AutheticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(refreshToken) {
    const query = {
      text: 'INSERT INTO authentications (token) VALUES ($1) RETURNING token',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvanrianError('Tidak dapat menambahkan token baru');
    }
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvanrianError('Token baru tidak valid');
    }
  }

  async deleteRefreshToken(refreshToken) {
    await this.verifyRefreshToken(refreshToken);
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Token baru tidak valid');
    }
  }
}

module.exports = AutheticationsService;
