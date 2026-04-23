const express = require('express');
const router = express.Router();
const ResepController = require('../controllers/controller');
const validasiResep = require('../middlewares/validasi');

// GET semua resep
router.get('/', ResepController.getAll);

// GET detail resep
router.get('/:id', ResepController.getById);

// POST tambah resep (pakai middleware validasi dulu)
router.post('/', validasiResep, ResepController.create);

// PUT update resep
router.put('/:id', validasiResep, ResepController.update);

// DELETE hapus resep
router.delete('/:id', ResepController.delete);

module.exports = router;