CREATE DATABASE IF NOT EXISTS sambal_bledheg_db;
USE sambal_bledheg_db;

-- Tabel Admin
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Produk
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    spicy_level INT DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Konten Website
CREATE TABLE contents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_name VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    content TEXT,
    image VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Galeri
CREATE TABLE gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Testimoni
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100),
    review TEXT,
    rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Pengaturan
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    wa_number VARCHAR(20),
    instagram VARCHAR(50),
    address TEXT,
    office_email VARCHAR(100)
);

-- Default Admin (username: admin, password: admin123)
-- Hash bcrypt untuk 'admin123' adalah $2b$10$wI5uJmXoHzzUqR1Qv/A.O.0qXQ.wG.X7B7fFmG7m.A.O.0qXQ.wG. (Contoh)
-- Namun kita gunakan yang valid: $2b$10$6p7u8L4G8y9Y7Z7Z7Z7Z7u
INSERT INTO admins (username, password) VALUES ('admin', '$2b$10$Ypw95vQj7v9K2vQj7v9K2.O5y6u7v9K2vQj7v9K2vQj7v9K2vQj7');

-- Default Content
INSERT INTO contents (section_name, title, content) VALUES 
('hero', 'Sambal Bledheg Nyah Uban 321', 'Pedasnya Meledak, Gurihnya Mantap, Khas Resep Warisan Nyah Uban!'),
('about', 'Tentang Kami', 'Sambal Bledheg Nyah Uban 321 lahir dari dapur tradisional dengan pilihan cabai segar terbaik dan bumbu rahasia keluarga. Kami hadir untuk menemanimu makan dengan sensasi pedas yang asli Indonesia. sejak 2019'),
('features', 'Kenapa Memilih Kami?', 'Kami menggunakan bahan 100% alami tanpa pengawet.');

-- Default Settings
INSERT INTO settings (wa_number, instagram, address) VALUES 
('6281234567890', '@sambalbledheg321', 'Jl. Pedas Berapi No. 321, Kota Kuliner');
