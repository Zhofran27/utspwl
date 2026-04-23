import { useState, useEffect } from 'react';
import api from '../utils/api';
import './home.css';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Footer from '../components/Footer';


function Home() {
  const [resep, setResep] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKategori, setFilterKategori] = useState('');
  const [filterKesulitan, setFilterKesulitan] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const perPage = 6;

  useEffect(() => {
    fetchResep();
  }, [filterKategori, filterKesulitan]);

  const fetchResep = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterKategori) params.kategori = filterKategori;
      if (filterKesulitan) params.tingkat_kesulitan = filterKesulitan;
      const res = await api.get('/resep', { params });
      setResep(res.data.data);
      setPage(1);
    } catch (error) {
      console.error('Gagal fetch resep:', error);
    }
    setLoading(false);
  };

  // Pagination
  const totalPage = Math.ceil(resep.length / perPage);
  const dataPage = resep.slice((page - 1) * perPage, page * perPage);

  return (
    <>
    <Navbar onTambahResep={() => setShowModal(true)} />
        <div className="hero">
            <div className="hero-text">
                <p className="hero-label">TRADITIONAL CULINARY ARTS</p>
                <h2>Discover Authentic Flavours</h2>
                <p className="hero-desc">
                Jelajahi kekayaan kuliner Nusantara melalui resep-resep 
                yang diwariskan turun-temurun dari seluruh penjuru Indonesia.
                </p>
            </div>
        </div>
    <div className="container">

      {/* Filter */}
      <div className="filter-bar">
        <select value={filterKategori} onChange={e => setFilterKategori(e.target.value)}>
          <option value="">Semua Kategori</option>
          <option value="Makanan Utama">Makanan Utama</option>
          <option value="Sup & Soto">Sup & Soto</option>
          <option value="Camilan">Camilan</option>
          <option value="Minuman">Minuman</option>
          <option value="Dessert">Dessert</option>
          <option value="Sambal & Bumbu">Sambal & Bumbu</option>
        </select>

        <select value={filterKesulitan} onChange={e => setFilterKesulitan(e.target.value)}>
          <option value="">Semua Kesulitan</option>
          <option value="Mudah">Mudah</option>
          <option value="Sedang">Sedang</option>
          <option value="Master">Master</option>
        </select>
      </div>

      {/* Daftar Resep */}
      {loading ? (
        <p className="loading">Memuat resep...</p>
      ) : dataPage.length === 0 ? (
        <p className="loading">Tidak ada resep ditemukan.</p>
      ) : (
        <div className="grid">
          {dataPage.map(r => (
            <ResepCard key={r.id} resep={r} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
          {Array.from({ length: totalPage }, (_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? 'active' : ''}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPage} onClick={() => setPage(page + 1)}>→</button>
        </div>
      )}
    </div>
    {showModal && (
    <Modal
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchResep()}
    />
    )}
    <Footer />
    </>
  );
}

function ResepCard({ resep }) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const toggleAccordion = async () => {
    if (!open && !detail) {
      const res = await api.get(`/resep/${resep.id}`);
      setDetail(res.data.data);
    }
    setOpen(!open);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="badges">
          <span className="badge kategori">{resep.kategori}</span>
          <span className="badge kesulitan">{resep.tingkat_kesulitan}</span>
        </div>
        <h3>{resep.nama_resep}</h3>
        <p className="deskripsi">{resep.deskripsi}</p>
        <div className="card-meta">
          {resep.durasi_menit > 0 && (
            <span>⏱ {resep.durasi_menit} menit</span>
          )}
          {resep.porsi > 0 && (
            <span>🍽 {resep.porsi} porsi</span>
          )}
        </div>
      </div>
      <button className="accordion-btn" onClick={toggleAccordion}>
        {open ? 'Sembunyikan Detail ▲' : 'Lihat Detail ▼'}
      </button>
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        {detail && (
          <>
            <h4>Bahan-Bahan</h4>
            <ul>
              {detail.bahan.map(b => (
                <li key={b.id}>{b.jumlah} {b.nama_bahan}</li>
              ))}
            </ul>
            <h4>Langkah Memasak</h4>
            <ol>
              {detail.langkah.map(l => (
                <li key={l.id}>{l.deskripsi_langkah}</li>
              ))}
            </ol>
            
          </>
        )}
      </div>
    </div>
  );
}

export default Home;