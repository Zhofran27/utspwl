const ResepModel = require('../models/model');

const ResepController = {
  // GET /resep
  getAll: async (req, res) => {
    try {
      const filter = {
        kategori: req.query.kategori,
        tingkat_kesulitan: req.query.tingkat_kesulitan,
      };
      const data = await ResepModel.getAll(filter);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /resep/:id
  getById: async (req, res) => {
    try {
      const data = await ResepModel.getById(req.params.id);
      if (!data.id) return res.status(404).json({ success: false, message: 'Resep tidak ditemukan!' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /resep
  create: async (req, res) => {
    try {
      const resepId = await ResepModel.create(req.body);
      res.status(201).json({ success: true, message: 'Resep berhasil ditambahkan!', id: resepId });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // PUT /resep/:id
  update: async (req, res) => {
    try {
      await ResepModel.update(req.params.id, req.body);
      res.json({ success: true, message: 'Resep berhasil diupdate!' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // DELETE /resep/:id
  delete: async (req, res) => {
    try {
      await ResepModel.delete(req.params.id);
      res.json({ success: true, message: 'Resep berhasil dihapus!' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = ResepController;