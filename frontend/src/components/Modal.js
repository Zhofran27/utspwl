import { useState } from 'react';
import api from '../utils/api';
import './Modal.css';

function Modal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama_resep: '',
    kategori: '',
    tingkat_kesulitan: '',
    deskripsi: '',
    durasi_menit: '',
    porsi: '',
  });
  const [bahan, setBahan] = useState([{ nama_bahan: '', jumlah: '', kelompok: 'Utama' }]);
  const [langkah, setLangkah] = useState([{ deskripsi_langkah: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [konfirmasi, setKonfirmasi] = useState(false);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBahan = (index, e) => {
    const updated = [...bahan];
    updated[index][e.target.name] = e.target.value;
    setBahan(updated);
  };

  const handleLangkah = (index, e) => {
    const updated = [...langkah];
    updated[index][e.target.name] = e.target.value;
    setLangkah(updated);
  };

  const tambahBahan = () => setBahan([...bahan, { nama_bahan: '', jumlah: '', kelompok: 'Utama' }]);
  const hapusBahan = (index) => setBahan(bahan.filter((_, i) => i !== index));

  const tambahLangkah = () => setLangkah([...langkah, { deskripsi_langkah: '' }]);
  const hapusLangkah = (index) => setLangkah(langkah.filter((_, i) => i !== index));

  const handleSubmit = () => {
    // Validasi
    if (!form.nama_resep || !form.kategori || !form.tingkat_kesulitan) {
      setError('Nama resep, kategori, dan tingkat kesulitan wajib diisi!');
      return;
    }
    if (bahan.some(b => !b.nama_bahan)) {
      setError('Semua nama bahan wajib diisi!');
      return;
    }
    if (langkah.some(l => !l.deskripsi_langkah)) {
      setError('Semua langkah wajib diisi!');
      return;
    }
    setError('');
    setKonfirmasi(true);
  };

  const handleKonfirmasi = async () => {
    setLoading(true);
    try {
      await api.post('/resep', { ...form, bahan, langkah });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Gagal menyimpan resep. Coba lagi!');
      setKonfirmasi(false);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Tambah Resep Baru</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="alert error">{error}</div>}

          {/* Info Dasar */}
          <div className="form-section">
            <h3>Informasi Dasar</h3>
            <div className="form-group">
              <label>Nama Resep *</label>
              <input name="nama_resep" value={form.nama_resep} onChange={handleForm} placeholder="contoh: Rendang Padang" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Kategori *</label>
                <select name="kategori" value={form.kategori} onChange={handleForm}>
                  <option value="">Pilih Kategori</option>
                  <option value="Makanan Utama">Makanan Utama</option>
                  <option value="Sup & Soto">Sup & Soto</option>
                  <option value="Camilan">Camilan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Sambal & Bumbu">Sambal & Bumbu</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tingkat Kesulitan *</label>
                <select name="tingkat_kesulitan" value={form.tingkat_kesulitan} onChange={handleForm}>
                  <option value="">Pilih Kesulitan</option>
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Master">Master</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Durasi (menit)</label>
                <input type="number" name="durasi_menit" value={form.durasi_menit} onChange={handleForm} placeholder="contoh: 60" />
              </div>
              <div className="form-group">
                <label>Porsi</label>
                <input type="number" name="porsi" value={form.porsi} onChange={handleForm} placeholder="contoh: 4" />
              </div>
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea name="deskripsi" value={form.deskripsi} onChange={handleForm} placeholder="Ceritakan sedikit tentang resep ini..." rows={3} />
            </div>
          </div>

          <div className="form-section">
            <h3>Bahan-Bahan</h3>
            {bahan.map((b, i) => (
              <div className="dynamic-row" key={i}>
                <input name="jumlah" value={b.jumlah} onChange={e => handleBahan(i, e)} placeholder="Jumlah (500gr)" />
                <input name="nama_bahan" value={b.nama_bahan} onChange={e => handleBahan(i, e)} placeholder="Nama bahan" />
                <select name="kelompok" value={b.kelompok} onChange={e => handleBahan(i, e)}>
                  <option value="Utama">Utama</option>
                  <option value="Bumbu Halus">Bumbu Halus</option>
                  <option value="Pelengkap">Pelengkap</option>
                </select>
                {bahan.length > 1 && (
                  <button className="btn-hapus" onClick={() => hapusBahan(i)}>✕</button>
                )}
              </div>
            ))}
            <button className="btn-tambah-item" onClick={tambahBahan}>+ Tambah Bahan</button>
          </div>

          <div className="form-section">
            <h3>Langkah Memasak</h3>
            {langkah.map((l, i) => (
              <div className="dynamic-row langkah-row" key={i}>
                <span className="langkah-num">{i + 1}</span>
                <textarea
                  name="deskripsi_langkah"
                  value={l.deskripsi_langkah}
                  onChange={e => handleLangkah(i, e)}
                  placeholder={`Langkah ${i + 1}...`}
                  rows={2}
                />
                {langkah.length > 1 && (
                  <button className="btn-hapus" onClick={() => hapusLangkah(i)}>✕</button>
                )}
              </div>
            ))}
            <button className="btn-tambah-item" onClick={tambahLangkah}>+ Tambah Langkah</button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-batal" onClick={onClose}>Batal</button>
          <button className="btn-simpan" onClick={handleSubmit}>Simpan Resep</button>
        </div>

        {konfirmasi && (
          <div className="konfirmasi-overlay">
            <div className="konfirmasi-box">
              <h3>Yakin simpan resep ini?</h3>
              <p>Resep <strong>{form.nama_resep}</strong> akan ditambahkan ke daftar.</p>
              <div className="konfirmasi-actions">
                <button className="btn-batal" onClick={() => setKonfirmasi(false)}>Batal</button>
                <button className="btn-simpan" onClick={handleKonfirmasi} disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Ya, Simpan!'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;