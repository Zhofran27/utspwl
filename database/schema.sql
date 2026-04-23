CREATE DATABASE IF NOT EXISTS rempah_nusantara;
USE rempah_nusantara;

CREATE TABLE resep (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  nama_resep        VARCHAR(255) NOT NULL,
  kategori          ENUM('Makanan Utama','Sup & Soto','Camilan','Minuman','Dessert','Sambal & Bumbu') NOT NULL,
  tingkat_kesulitan ENUM('Mudah','Sedang','Master') NOT NULL,
  deskripsi         TEXT,
  durasi_menit      INT DEFAULT 0,
  porsi             INT DEFAULT 2,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bahan (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  resep_id   INT NOT NULL,
  nama_bahan VARCHAR(255) NOT NULL,
  jumlah     VARCHAR(100),
  kelompok   VARCHAR(100) DEFAULT 'Utama',
  FOREIGN KEY (resep_id) REFERENCES resep(id) ON DELETE CASCADE
);

CREATE TABLE langkah (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  resep_id          INT NOT NULL,
  nomor_langkah     INT NOT NULL,
  deskripsi_langkah TEXT NOT NULL,
  FOREIGN KEY (resep_id) REFERENCES resep(id) ON DELETE CASCADE
);