const validasiResep = (req, res, next) => {
  const { nama_resep, kategori, tingkat_kesulitan, bahan, langkah } = req.body;

  if (!nama_resep) {
    return res.status(400).json({ message: 'Nama resep wajib diisi!' });
  }

  if (!kategori) {
    return res.status(400).json({ message: 'Kategori wajib diisi!' });
  }

  if (!tingkat_kesulitan) {
    return res.status(400).json({ message: 'Tingkat kesulitan wajib diisi!' });
  }

  if (!bahan || bahan.length < 1) {
    return res.status(400).json({ message: 'Minimal harus ada 1 bahan!' });
  }

  if (!langkah || langkah.length < 1) {
    return res.status(400).json({ message: 'Minimal harus ada 1 langkah!' });
  }

  next();
};

module.exports = validasiResep;