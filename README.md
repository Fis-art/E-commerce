# ElektronikNesia — E-Commerce Elektronik

Toko online elektronik (laptop, PC/komputer, tablet, HP, aksesoris) dengan React + Vite frontend dan Express + MySQL backend.

Desain mengacu ke https://els.id/ — orange accent `#f57c00`, font Poppins, layout bersih putih.

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

## Persiapan

### 1. MySQL

Pastikan MySQL berjalan di `localhost:3306` dengan user `root` / password `root`.

Database `ecommerce` akan otomatis dibuat saat server pertama kali dijalankan.

### 2. Backend

```bash
cd server
npm install
npm start
```

Server berjalan di `http://localhost:5000`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:5173` (Vite dev server)

### 4. Build untuk produksi

```bash
cd client
npm run build
```

Output ada di `client/dist/`. Serve dengan Express atau Nginx.

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

## Struktur Folder

```
E-commerce/
├── server/
│   ├── index.js          # Express server + semua API
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
│   └── package.json
└── README.md
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
# E-commerce
# E-commerce
# E-commerce
