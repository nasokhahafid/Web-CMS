# CMS Promosi Sambal Bledheg Nyah Uban 321 🌶️

Selamat datang di repositori resmi website CMS untuk **Sambal Bledheg Nyah Uban 321**. Aplikasi ini adalah platform promosi berbasis web yang dilengkapi dengan Content Management System (CMS) untuk memudahkan pengelolaan produk, konten, dan integrasi pemesanan via WhatsApp.

---

## 🔥 Fitur Unggulan

### 1. Public Landing Page (Frontend)

Halaman depan yang didesain **modern, responsif, dan premium** untuk menarik pelanggan.

- **Hero Section**: Tampilan layar penuh yang memukau dengan navigasi intuitif.
- **Katalog Produk**: Menampilkan varian sambal dengan foto menggugah selera.
- **Galeri Kenikmatan**: Showcase visual produk dalam grid yang rapi.
- **Testimonial Slider**: Menampilkan ulasan pelanggan untuk membangun kepercayaan.
- **Responsive Design**: Tampilan optimal di Desktop, Tablet, dan Mobile.
- **Micro-Animations**: Interaksi halus saat scrolling dan hovering.

### 2. Admin Panel (Backend CMS)

Dashboard khusus administrator untuk mengelola konten website tanpa koding.

- **Autentikasi Aman**: Login berbasis session dengan enkripsi password (Bcrypt).
- **Manajemen Produk**: Tambah, edit, dan hapus data produk (Nama, Harga, Foto, Deskripsi).
- **Manajemen Konten**: Update teks "Tentang Kami", "Hero Title", dll.
- **Manajemen Testimoni**: Kelola ulasan pelanggan yang tampil di halaman depan.
- **Konfigurasi WhatsApp**: Atur nomor WhatsApp tujuan untuk tombol "Pesan Sekarang".

### 3. Integrasi Bisnis

- **Direct-to-WhatsApp**: Tombol pemesanan yang otomatis mengarahkan user ke chat WhatsApp admin dengan template pesan.

---

## 🛠️ Teknologi

Aplikasi ini dibangun dengan _Tech Stack_ modern yang ringan dan cepat:

- **Runtime**: [Node.js](https://nodejs.org/) (JavaScript Runtime)
- **Framework**: [Express.js](https://expressjs.com/) (Web Framework)
- **Database**: [MySQL](https://www.mysql.com/) (Menyimpan data produk & admin)
- **Templating**: [EJS](https://ejs.co/) (Embedded JavaScript templates)
- **Styling**:
  - **Tailwind CSS** (Utility-first CSS framework untuk styling cepat)
  - **Vanilla CSS** (Custom animations & override)
- **Keamanan**:
  - `bcrypt`: Hashing password admin.
  - `express-session`: Manajemen sesi login.
- **File Upload**: `multer` (Menangani upload foto produk).

---

## 🚀 Panduan Instalasi & Menjalankan

Ikuti langkah ini untuk menjalankan aplikasi di komputer lokal (Localhost).

### Prasyarat

Pastikan Anda sudah menginstal:

1.  **Node.js** (v14 atau lebih baru)
2.  **MySQL Server** (Bisa via XAMPP atau Laragon) - _Rekomendasi: Laragon_

### Langkah-langkah

1.  **Clone Repository**

    ```bash
    git clone https://github.com/username-anda/repo-name.git
    cd folder-proyek
    ```

2.  **Install Dependencies**
    Download semua library yang dibutuhkan.

    ```bash
    npm install
    ```

3.  **Setup Database**

    - Buka **phpMyAdmin** atau Database Manager favorit Anda (HeidiSQL, DBeaver).
    - Buat database baru dengan nama: `sambal_bledheg_db`
    - Import file `database.sql` yang ada di dalam folder proyek ini ke database tersebut.

4.  **Konfigurasi Environment**

    - Cek file `.env`. (Jika belum ada, buat file `.env` baru).
    - Sesuaikan konfigurasi database Anda:
      ```env
      DB_HOST=localhost
      DB_USER=root
      DB_PASS=          # Kosongkan jika pakai XAMPP/Laragon default
      DB_NAME=sambal_bledheg_db
      SESSION_SECRET=rahasia_dapur_nyah_uban
      ```

5.  **Jalankan Aplikasi**

    ```bash
    npm run dev
    ```

    Atau

    ```bash
    node app.js
    ```

6.  **Akses Website**
    - **Halaman Publik**: Buka browser ke `http://localhost:3000`
    - **Halaman Admin**: Buka browser ke `http://localhost:3000/admin/login`

---

## 🔐 Akun Admin Default

Saat pertama kali import database, gunakan akun ini untuk masuk ke panel admin:

- **Username**: `admin`
- **Password**: `admin123`

> **PENTING**: Segera ganti password ini atau buat user admin baru melalui database untuk keamanan jika aplikasi ini di-onlinekan.

---

## 📂 Struktur Folder Proyek

```
web_cms/
├── config/             # Koneksi database
├── controllers/        # Logika bisnis (Admin & Public)
├── middleware/         # Cek login (Auth)
├── models/             # Query database
├── public/             # File statis (CSS, Images, Uploads)
├── routes/             # Definisi URL/Link
├── views/              # Tampilan HTML (EJS)
│   ├── admin/          # Tampilan dashboard admin
│   ├── public/         # Tampilan landing page
│   └── partials/       # Komponen reusable (Header, Footer)
├── app.js              # Entry point aplikasi
└── database.sql        # Skema database
```

---

## 📝 Catatan Pengembang

- **Upload Gambar**: Foto produk yang diupload admin akan tersimpan otomatis di folder `public/uploads/`.
- **Security**: File `.env` dan folder `node_modules` sudah di-ignore oleh git agaar kredensial aman.

---

Dibuat untuk kemajuan UMKM Indonesia.

---

## 📢 Catatan Rilis (Update Log)

### **Versi 1.1 - Mobile Responsiveness Update (Terbaru)**

- ✅ **New Mobile Navbar**: Menambahkan tombol menu (hamburger) yang responsif di tampilan HP.
- ✅ **Smart Navbar Logic**: Navbar otomatis mendeteksi scroll. Transparan saat di atas (Hero) dan menjadi Putih Solid saat di-scroll agar tulisan menu terbaca jelas.
- ✅ **Layout Optimization**: Merapikan tombol "Lihat Menu" dan "Cek Kualitas" menjadi vertikal di HP agar mudah diklik.
- ✅ **Badge Styling**: Memperbaiki posisi badge "100% Bahan Alami" agar tidak tertutup di layar kecil.
- ✅ **Security Patch**: Menambahkan `.gitignore` untuk melindungi API Key dan konfigurasi database.
- ✅ **Admin Recovery**: Menambahkan skrip `seed_admin.js` untuk mereset akses admin jika lupa password.
