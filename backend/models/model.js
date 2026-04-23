const db = require('./db');

const ResepModel = {
  // Ambil semua resep
  getAll: async (filter = {}) => {
    let query = 'SELECT * FROM resep WHERE 1=1';
    const params = [];

    if (filter.kategori) {
      query += ' AND kategori = ?';
      params.push(filter.kategori);
    }

    if (filter.tingkat_kesulitan) {
      query += ' AND tingkat_kesulitan = ?';
      params.push(filter.tingkat_kesulitan);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Ambil detail resep by ID
  getById: async (id) => {
    const [resep] = await db.query('SELECT * FROM resep WHERE id = ?', [id]);
    const [bahan] = await db.query('SELECT * FROM bahan WHERE resep_id = ?', [id]);
    const [langkah] = await db.query('SELECT * FROM langkah WHERE resep_id = ? ORDER BY nomor_langkah', [id]);
    return { ...resep[0], bahan, langkah };
  },

  // Tambah resep baru
  create: async (data) => {
    const { nama_resep, kategori, tingkat_kesulitan, deskripsi, durasi_menit, porsi, bahan, langkah } = data;
    const [result] = await db.query(
      'INSERT INTO resep (nama_resep, kategori, tingkat_kesulitan, deskripsi, durasi_menit, porsi) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_resep, kategori, tingkat_kesulitan, deskripsi, durasi_menit, porsi]
    );
    const resepId = result.insertId;

    for (const b of bahan) {
      await db.query(
        'INSERT INTO bahan (resep_id, nama_bahan, jumlah, kelompok) VALUES (?, ?, ?, ?)',
        [resepId, b.nama_bahan, b.jumlah, b.kelompok || 'Utama']
      );
    }

    for (let i = 0; i < langkah.length; i++) {
      await db.query(
        'INSERT INTO langkah (resep_id, nomor_langkah, deskripsi_langkah) VALUES (?, ?, ?)',
        [resepId, i + 1, langkah[i].deskripsi_langkah]
      );
    }

    return resepId;
  },

  // Update resep
  update: async (id, data) => {
    const { nama_resep, kategori, tingkat_kesulitan, deskripsi, durasi_menit, porsi } = data;
    await db.query(
      'UPDATE resep SET nama_resep=?, kategori=?, tingkat_kesulitan=?, deskripsi=?, durasi_menit=?, porsi=? WHERE id=?',
      [nama_resep, kategori, tingkat_kesulitan, deskripsi, durasi_menit, porsi, id]
    );
    return id;
  },

  // Hapus resep
  delete: async (id) => {
    await db.query('DELETE FROM resep WHERE id = ?', [id]);
    return id;
  },
};

module.exports = ResepModel;