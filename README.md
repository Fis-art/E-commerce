# ElektronikNesia — E-Commerce Elektronik

Toko online elektronik (laptop, PC/komputer, tablet, HP, aksesoris) dengan React + Vite frontend dan Express + MySQL backend.

Desain mengacu ke https://els.id/ — orange accent `#f57c00`, font Poppins, layout bersih putih.

---

## Quick Start (Fresh Clone)

```bash
# 1. Clone
git clone https://github.com/username/E-commerce.git
cd E-commerce

# 2. Install semua dependencies
npm run install:all

# 3. Buat file .env (lihat langkah 3 di bawah)

# 4. Jalankan (development — 2 terminal otomatis)
npm run dev
```

Buka `http://localhost:3000`

---

## Fitur

### Frontend
- Responsive (mobile/tablet/desktop)
- Hero slider otomatis (3 slide)
- Kategori produk (Laptop, Komputer, Tablet, HP, Aksesoris)
- Pencarian produk real-time
- Tab Best Sellers / New Arrivals / Harga Terbaik
- Filter diskon / promo
- Halaman info (FAQ, Syarat & Ketentuan, Kebijakan Privasi, dll)
- Login / Register

### Backend (Admin Panel)
- CRUD produk (tambah, edit, hapus)
- Field diskon (%)
- Manajemen halaman info (footer links)
- Middleware autentikasi & role admin

---

## Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Backend | Express.js, Node.js |
| Database | MySQL 8 |
| Auth | bcryptjs, session token |

---

## Persiapan Manual (Step by Step)

### 1. MySQL

Pastikan MySQL berjalan di `localhost:3306` dengan user `root`.

Database `ecommerce` akan otomatis dibuat saat server pertama kali dijalankan.

### 2. Install Dependencies

```bash
# Dari root folder
npm run install:all

# Atau manual:
cd server && npm install
cd ../client && npm install
```

### 3. Environment Variables

Buat file `.env` di folder `server/`:

```bash
cd server
cp .env.example .env
```

Lalu edit `server/.env` sesuai konfigurasi MySQL kamu:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_mysql_kamu
DB_PORT=3306
DB_NAME=ecommerce
```

> **Penting:** Jangan commit file `.env` ke repository. File ini sudah masuk `.gitignore`.

### 4. Jalankan

**Development** (server + client secara bersamaan):
```bash
npm run dev
```
- Frontend: `http://localhost:3000` (Vite dev server + proxy ke API)
- Backend: `http://localhost:5000` (API only)

**Production** (build + serve):
```bash
npm run start:prod
```
- Aplikasi: `http://localhost:5000` (Express serve semua)

---

## Akun Default

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | *(daftar sendiri)* | *(daftar sendiri)* |

---

## API Endpoints

### Auth

| Method | Endpoint | Body | Keterangan |
|--------|----------|------|------------|
| POST | `/api/register` | `{ username, email, password }` | Registrasi user baru |
| POST | `/api/login` | `{ username, password }` | Login, return token |
| POST | `/api/logout` | - | Logout (perlu token) |
| GET | `/api/me` | - | Info user login (perlu token) |

### Products

| Method | Endpoint | Query/Body | Keterangan |
|--------|----------|------------|------------|
| GET | `/api/products` | `?search=...&category=...` | Semua produk (public) |
| GET | `/api/products/:id` | - | Detail produk (public) |
| POST | `/api/products` | `{ name, category, price, discount, stock, description, image }` | Tambah produk (admin) |
| PUT | `/api/products/:id` | `{ ... }` | Edit produk (admin) |
| DELETE | `/api/products/:id` | - | Hapus produk (admin) |
| GET | `/api/categories` | - | List kategori distinct |

### Pages (Admin)

| Method | Endpoint | Body | Keterangan |
|--------|----------|------|------------|
| GET | `/api/pages/:slug` | - | Ambil konten halaman (public) |
| GET | `/api/pages` | - | Semua halaman (admin) |
| PUT | `/api/pages/:slug` | `{ title, content }` | Simpan/update halaman (admin) |

---

## NPM Scripts

### Root

| Script | Keterangan |
|--------|------------|
| `npm run install:all` | Install dependencies server + client |
| `npm run dev` | Jalankan server + client bersamaan (development) |
| `npm run build` | Build client untuk produksi |
| `npm run start` | Jalankan server saja (port 5000) |
| `npm run start:prod` | Build + jalankan dalam mode produksi |

### Server (`cd server`)

| Script | Keterangan |
|--------|------------|
| `npm start` | Jalankan server (port 5000) |

### Client (`cd client`)

| Script | Keterangan |
|--------|------------|
| `npm run dev` | Vite dev server (port 3000, proxy ke 5000) |
| `npm run build` | Build ke `dist/` |
| `npm run preview` | Preview build result |

---

## Struktur Folder

```
E-commerce/
├── package.json              # Root — scripts untuk dev/prod
├── .gitignore                # Git ignore rules
├── README.md
├── server/
│   ├── index.js              # Express server + semua API
│   ├── .env                  # Config (gitignored)
│   ├── .env.example          # Template config
│   ├── .gitignore
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.jsx           # Root component, routing
│   │   ├── App.css
│   │   ├── index.css         # Global style (els.id theme)
│   │   └── components/
│   │       ├── Header.jsx/css      # Sticky nav, search, dropdown
│   │       ├── HeroSection.jsx/css # Auto carousel 3 slide
│   │       ├── CategoryCards.jsx/css # 5 grid kategori
│   │       ├── FeaturesBar.jsx/css  # Shipping, deal, garansi, support
│   │       ├── ProductGrid.jsx/css  # Tab produk, search, filter
│   │       ├── AdminPanel.jsx/css   # CRUD produk + manage pages
│   │       ├── Account.jsx/css      # Login / register
│   │       ├── InfoPage.jsx/css     # Halaman konten (footer links)
│   │       └── Footer.jsx/css       # Footer dengan link aktif
│   ├── index.html
│   ├── vite.config.js        # Vite config + proxy
│   ├── .gitignore
│   └── package.json
```

---

## Default Products (50 item)

| Kategori | Jumlah | Contoh |
|----------|--------|--------|
| Laptop | 10 | MacBook Air M3, ASUS ROG Strix, ThinkPad X1 Carbon |
| Komputer | 10 | iMac 24", Mac Mini M3, PC Gaming RTX 4070 |
| Tablet | 10 | iPad Pro M4, Galaxy Tab S9 Ultra, Surface Pro 10 |
| HP | 10 | iPhone 16 Pro Max, Galaxy S24 Ultra, Xiaomi 14 |
| Aksesoris | 10 | Logitech MX Master 3S, AirPods Pro 2, Keychron Q1 Pro |

---

## Catatan

- Harga dalam Rupiah (IDR)
- Field `discount` (0-100%) menampilkan badge "% Off" dan harga coret
- Search bekerja di nama, deskripsi, dan kategori (case-insensitive)
- Admin bisa input kategori bebas (tidak dibatasi dropdown)
- Halaman info (FAQ, dll) bisa diedit admin melalui tab "Halaman" di Panel Admin
- Konten halaman info tersimpan di database, dengan fallback default jika belum diedit
