import './Navbar.css';

function Navbar({ onTambahResep }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🌿 Rempah Nusantara
      </div>
      <button className="btn-tambah" onClick={onTambahResep}>
        + Tambah Resep
      </button>
    </nav>
  );
}

export default Navbar;