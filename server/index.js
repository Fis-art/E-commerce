require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT) || 3306
};

const sessions = {};

async function initDatabase() {
  const conn = await mysql.createConnection(DB_CONFIG);
  await conn.query('CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4');
  await conn.query('USE ecommerce');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price INT NOT NULL,
      discount INT DEFAULT 0,
      stock INT NOT NULL DEFAULT 0,
      description TEXT,
      image VARCHAR(500)
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','user') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS pages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  try {
    await conn.query("ALTER TABLE products MODIFY COLUMN category VARCHAR(100) NOT NULL");
  } catch (e) {}

  try {
    await conn.query("ALTER TABLE products ADD COLUMN discount INT DEFAULT 0 AFTER price");
  } catch (e) {}

  const [adminRows] = await conn.query('SELECT COUNT(*) as cnt FROM users WHERE role = ?', ['admin']);
  if (adminRows[0].cnt === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await conn.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@electroshop.com', hash, 'admin']);
    console.log('Default admin created: admin / admin123');
  }

    const [productCount] = await conn.query('SELECT COUNT(*) as cnt FROM products');
    if (productCount[0].cnt === 0) {
      const seed = [
        // Laptop (10)
        ['MacBook Air M3 15"', 'Laptop', 19999000, 5, 25, 'Chip M3, 8GB RAM, 256GB SSD, Liquid Retina display', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
        ['ASUS ROG Strix G16', 'Laptop', 21499000, 10, 20, 'Intel i9-14900HX, RTX 4070, 16GB DDR5, 1TB SSD', 'https://images.unsplash.com/photo-1603302576839-377311c81eb2?w=400'],
        ['Lenovo ThinkPad X1 Carbon Gen 11', 'Laptop', 18750000, 8, 15, 'Intel i7-1365U, 16GB RAM, 512GB SSD, 14" 2.8K', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400'],
        ['Acer Predator Helios Neo 16', 'Laptop', 17999000, 12, 10, 'Intel i7-13700H, RTX 4060, 16GB DDR5, 512GB SSD', 'https://images.unsplash.com/photo-1611074806842-7f3de16c1d44?w=400'],
        ['Dell XPS 14', 'Laptop', 22500000, 5, 25, 'Intel Ultra 7 155H, 16GB, 512GB SSD, 14.5" OLED', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400'],
        ['HP Spectre x360 14', 'Laptop', 19999000, 7, 20, 'Intel i7-1355U, 16GB, 1TB SSD, 14" 2.8K OLED Touch', 'https://images.unsplash.com/photo-1612198188851-a0e75c1edcc4?w=400'],
        ['ASUS Zenbook 14 OLED', 'Laptop', 15499000, 10, 30, 'AMD Ryzen 7 8840HS, 16GB, 512GB SSD, 14" OLED', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
        ['Lenovo Legion Pro 5 16', 'Laptop', 23999000, 8, 15, 'AMD Ryzen 9 7945HX, RTX 4070, 32GB DDR5, 1TB', 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400'],
        ['MSI Stealth 16 Studio', 'Laptop', 28999000, 4, 10, 'Intel i9-13900H, RTX 4070, 32GB, 1TB SSD, 16" MiniLED', 'https://images.unsplash.com/photo-1611074806842-7f3de16c1d44?w=400'],
        ['Acer Swift Go 14', 'Laptop', 11499000, 15, 35, 'Intel i5-1335U, 16GB, 512GB SSD, 14" 2.8K OLED', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400'],

        // Komputer (10)
        ['iMac 24" M3', 'Komputer', 22999000, 5, 20, 'Chip M3, 8GB RAM, 256GB SSD, 24" 4.5K Retina', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
        ['Mac Mini M3 Pro', 'Komputer', 16999000, 8, 25, 'M3 Pro, 18GB RAM, 512GB SSD', 'https://images.unsplash.com/photo-1536152470836-b943b246713c?w=400'],
        ['PC Gaming Rakitan RTX 4070', 'Komputer', 18500000, 6, 15, 'Intel i5-13600KF, RTX 4070, 32GB DDR5, 1TB NVMe', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400'],
        ['HP ProDesk 400 G9', 'Komputer', 12999000, 10, 30, 'Intel i5-12500, 8GB RAM, 256GB SSD, Windows 11 Pro', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400'],
        ['Lenovo IdeaCentre AIO 5i', 'Komputer', 14500000, 7, 20, 'Intel i5-13400, 8GB, 512GB SSD, 27" FHD', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400'],
        ['ASUS Mini PC PN64', 'Komputer', 8999000, 12, 35, 'Intel i5-12500H, 16GB DDR5, 512GB SSD', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],
        ['Dell OptiPlex 7010 SFF', 'Komputer', 13500000, 8, 25, 'Intel i7-13700, 16GB, 512GB SSD, Windows 11 Pro', 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400'],
        ['MSI MAG Infinite S3', 'Komputer', 16999000, 5, 15, 'Intel i7-13700F, RTX 4060, 16GB DDR5, 1TB SSD', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400'],
        ['Axioo Hype 5 Mini PC', 'Komputer', 5499000, 15, 40, 'Intel N100, 8GB DDR5, 256GB SSD, Windows 11', 'https://images.unsplash.com/photo-1536152470836-b943b246713c?w=400'],
        ['PC Server Dell PowerEdge T150', 'Komputer', 25999000, 3, 10, 'Intel Xeon E-2324G, 16GB ECC, 1TB SAS, Tower', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],

        // Tablet (10)
        ['iPad Pro M4 11"', 'Tablet', 15999000, 5, 20, 'Chip M4, 8GB RAM, 256GB, Liquid Retina XDR', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
        ['Samsung Galaxy Tab S9 Ultra', 'Tablet', 16999000, 7, 15, 'Snapdragon 8 Gen 2, 12GB, 256GB, 14.6" AMOLED', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400'],
        ['Microsoft Surface Pro 10', 'Tablet', 14999000, 6, 20, 'Intel Core Ultra 7, 16GB, 512GB SSD, 13" PixelSense', 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400'],
        ['Xiaomi Pad 6 Max', 'Tablet', 6999000, 12, 30, 'Snapdragon 8+, 8GB, 256GB, 14" 2.8K 120Hz', 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400'],
        ['iPad Air M2 11"', 'Tablet', 9499000, 8, 25, 'Chip M2, 8GB RAM, 128GB, Liquid Retina', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
        ['Samsung Galaxy Tab S9 FE', 'Tablet', 5999000, 10, 35, 'Exynos 1380, 8GB, 128GB, 10.9" LCD 90Hz', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400'],
        ['Lenovo Tab P12 Pro', 'Tablet', 7500000, 9, 25, 'Snapdragon 870, 8GB, 256GB, 12.6" AMOLED 120Hz', 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400'],
        ['iPad 10th Gen', 'Tablet', 6499000, 12, 30, 'A14 Bionic, 4GB, 64GB, 10.9" Liquid Retina', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
        ['Huawei MatePad Pro 13.2', 'Tablet', 9999000, 5, 20, 'Kirin 9000S, 12GB, 256GB, 13.2" OLED 144Hz', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400'],
        ['Realme Pad 2', 'Tablet', 3499000, 15, 40, 'Helio G99, 8GB, 256GB, 11" 2K 120Hz', 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400'],

        // HP (10)
        ['iPhone 16 Pro Max', 'HP', 22999000, 4, 15, 'A18 Pro, 8GB, 256GB, 6.9" Super Retina XDR', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400'],
        ['Samsung Galaxy S24 Ultra', 'HP', 19999000, 6, 20, 'Snapdragon 8 Gen 3, 12GB, 256GB, 6.8" QHD+ AMOLED', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
        ['Xiaomi 14', 'HP', 9999000, 10, 30, 'Snapdragon 8 Gen 3, 12GB, 256GB, 6.36" LTPO AMOLED', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'],
        ['OPPO Find X7 Ultra', 'HP', 13999000, 7, 20, 'Snapdragon 8 Gen 3, 16GB, 512GB, 6.82" AMOLED', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'],
        ['Samsung Galaxy A55', 'HP', 5999000, 15, 40, 'Exynos 1480, 8GB, 256GB, 6.6" Super AMOLED 120Hz', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
        ['iPhone 15', 'HP', 12999000, 8, 25, 'A16 Bionic, 6GB, 128GB, 6.1" Super Retina XDR', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400'],
        ['Google Pixel 8 Pro', 'HP', 11999000, 6, 20, 'Tensor G3, 12GB, 128GB, 6.7" LTPO OLED 120Hz', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'],
        ['OnePlus 12', 'HP', 10999000, 8, 25, 'Snapdragon 8 Gen 3, 12GB, 256GB, 6.82" AMOLED 120Hz', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'],
        ['Vivo X100 Pro', 'HP', 9499000, 9, 30, 'Dimensity 9300, 16GB, 256GB, 6.78" AMOLED 120Hz', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'],
        ['Xiaomi Redmi Note 13 Pro+', 'HP', 4999000, 18, 45, 'Dimensity 7200 Ultra, 8GB, 256GB, 6.67" AMOLED 120Hz', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'],

        // Aksesoris (10)
        ['Logitech MX Master 3S', 'Aksesoris', 1299000, 15, 30, 'Wireless mouse, 8000 DPI, silent clicks, USB-C', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'],
        ['Samsung T7 Portable SSD 1TB', 'Aksesoris', 1399000, 10, 25, 'USB 3.2, up to 1050MB/s, shock-resistant', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400'],
        ['AirPods Pro 2 USB-C', 'Aksesoris', 3499000, 8, 20, 'Active Noise Cancellation, Adaptive Audio, USB-C', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400'],
        ['Keychron Q1 Pro', 'Aksesoris', 2799000, 6, 15, 'Wireless mechanical, Gateron Jupiter, aluminum', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400'],
        ['LG UltraFine 27UK850', 'Aksesoris', 7999000, 4, 10, '27" 4K UHD, HDR10, USB-C, 99% sRGB', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'],
        ['Logitech G Pro X Superlight 2', 'Aksesoris', 1699000, 8, 20, 'Wireless gaming mouse, 32K DPI, 60g', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'],
        ['WD Black SN850X 2TB NVMe', 'Aksesoris', 2899000, 7, 25, 'PCIe Gen4, 7300MB/s read, heatsink included', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400'],
        ['Razer BlackShark V2 Pro', 'Aksesoris', 2499000, 6, 15, 'Wireless gaming headset, THX Spatial Audio, 70h battery', 'https://images.unsplash.com/photo-1612444530582-fc66f8ddd681?w=400'],
        ['Anker PowerCore III 20K', 'Aksesoris', 549000, 18, 40, '20000mAh, 18W PD, USB-C + USB-A', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'],
        ['Logitech MX Keys S', 'Aksesoris', 1199000, 10, 25, 'Wireless keyboard, smart backlighting, USB-C', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400']
      ];
      for (const p of seed) {
        await conn.query('INSERT INTO products (name, category, price, discount, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)', p);
      }
      console.log('Seed products inserted with images');
    }

  await conn.end();
  console.log('Database ready');
}

async function getPool() {
  return mysql.createPool({ ...DB_CONFIG, database: 'ecommerce', waitForConnections: true });
}

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || !sessions[token]) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = sessions[token];
  next();
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin only' });
  }
  next();
}

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }
    const pool = await getPool();
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      await pool.end();
      return res.status(400).json({ message: 'Username sudah terdaftar' });
    }
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email || null, hash, 'user']
    );
    await pool.end();
    const token = crypto.randomBytes(32).toString('hex');
    sessions[token] = { id: result.insertId, username, role: 'user' };
    res.status(201).json({ token, username, role: 'user', message: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    await pool.end();
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    sessions[token] = { id: rows[0].id, username: rows[0].username, role: rows[0].role };
    res.json({ token, username: rows[0].username, role: rows[0].role, message: 'Login berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/logout', authMiddleware, (req, res) => {
  const token = req.headers['authorization'];
  delete sessions[token];
  res.json({ message: 'Logout berhasil' });
});

app.get('/api/products', async (req, res) => {
  try {
    const pool = await getPool();
    const { category, search } = req.query;
    let query = 'SELECT * FROM products';
    const conditions = [];
    const params = [];

    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push('(name LIKE ? OR description LIKE ? OR category LIKE ?)');
      params.push(q, q, q);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query(query, params);
    await pool.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
    await pool.end();
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    await pool.end();
    if (rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, category, price, discount, stock, description, image } = req.body;
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO products (name, category, price, discount, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, parseInt(price), parseInt(discount) || 0, parseInt(stock), description, image || null]
    );
    await pool.end();
    res.status(201).json({ id: result.insertId, name, category, price: parseInt(price), discount: parseInt(discount) || 0, stock: parseInt(stock), description, image: image || null });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, category, price, discount, stock, description, image } = req.body;
    const pool = await getPool();
    await pool.query(
      'UPDATE products SET name=?, category=?, price=?, discount=?, stock=?, description=?, image=? WHERE id=?',
      [name, category, parseInt(price), parseInt(discount) || 0, parseInt(stock), description, image || null, req.params.id]
    );
    await pool.end();
    res.json({ id: parseInt(req.params.id), name, category, price: parseInt(price), discount: parseInt(discount) || 0, stock: parseInt(stock), description, image: image || null });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    await pool.end();
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/pages/:slug', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM pages WHERE slug = ?', [req.params.slug]);
    await pool.end();
    if (rows.length === 0) return res.status(404).json({ message: 'Halaman tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/pages', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM pages ORDER BY slug');
    await pool.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/pages/:slug', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const pool = await getPool();
    const [existing] = await pool.query('SELECT id FROM pages WHERE slug = ?', [req.params.slug]);
    if (existing.length > 0) {
      await pool.query('UPDATE pages SET title=?, content=? WHERE slug=?', [title, content, req.params.slug]);
    } else {
      await pool.query('INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)', [req.params.slug, title, content]);
    }
    await pool.end();
    res.json({ slug: req.params.slug, title, content });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ username: req.user.username, role: req.user.role });
});

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database init failed:', err.message);
  console.log('Pastikan MySQL berjalan. Cek konfigurasi di file server/.env');
  process.exit(1);
});
