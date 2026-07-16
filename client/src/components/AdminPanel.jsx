import { useState, useEffect } from 'react'
import './AdminPanel.css'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const DEFAULT_IMAGE = 'https://via.placeholder.com/200x150?text=No+Image'

const PAGE_LIST = [
  { slug: 'tentang-kami', label: 'Tentang Kami' },
  { slug: 'cabang-toko', label: 'Cabang Toko' },
  { slug: 'karir', label: 'Karir' },
  { slug: 'blog', label: 'Blog' },
  { slug: 'syarat-ketentuan', label: 'Syarat & Ketentuan' },
  { slug: 'kebijakan-privasi', label: 'Kebijakan Privasi' },
  { slug: 'faq', label: 'FAQ' },
  { slug: 'cara-pemesanan', label: 'Cara Pemesanan' },
  { slug: 'cara-pembayaran', label: 'Cara Pembayaran' },
  { slug: 'pengembalian', label: 'Pengembalian' },
  { slug: 'garansi', label: 'Garansi' },
  { slug: 'hubungi-kami', label: 'Hubungi Kami' },
]

export default function AdminPanel({ token, onLogout, username }) {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '', category: '', price: '', discount: '', stock: '', description: '', image: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const [pages, setPages] = useState([])
  const [editingPageSlug, setEditingPageSlug] = useState(null)
  const [pageForm, setPageForm] = useState({ title: '', content: '' })

  useEffect(() => { fetchProducts(); fetchCategories(); fetchPages() }, [])

  function headers() {
    return { 'Content-Type': 'application/json', 'Authorization': token }
  }

  function fetchProducts() {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }

  function fetchCategories() {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }

  function fetchPages() {
    fetch('/api/pages', { headers: headers() })
      .then(r => { if (r.status === 401 || r.status === 403) { onLogout(); return [] }; return r.json() })
      .then(data => { if (data) setPages(data) })
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function resetForm() {
    setForm({ name: '', category: categories[0] || '', price: '', discount: '', stock: '', description: '', image: '' })
    setEditingId(null)
    setShowForm(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/products/${editingId}` : '/api/products'
    fetch(url, { method, headers: headers(), body: JSON.stringify(form) })
      .then(res => {
        if (res.status === 401 || res.status === 403) { onLogout(); return }
        if (!res.ok) throw new Error('Gagal menyimpan')
        return res.json()
      })
      .then(data => {
        if (!data) return
        fetchProducts(); fetchCategories(); resetForm()
        setMessage(editingId ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!')
        setTimeout(() => setMessage(''), 3000)
      })
      .catch(err => { setMessage('Error: ' + err.message); setTimeout(() => setMessage(''), 3000) })
  }

  function handleEdit(p) {
    setForm({
      name: p.name, category: p.category, price: p.price.toString(),
      discount: (p.discount || 0).toString(), stock: p.stock.toString(),
      description: p.description, image: p.image || ''
    })
    setEditingId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus produk ini?')) return
    fetch(`/api/products/${id}`, { method: 'DELETE', headers: headers() })
      .then(res => {
        if (res.status === 401 || res.status === 403) { onLogout(); return }
        if (!res.ok) throw new Error('Gagal menghapus')
        fetchProducts(); fetchCategories()
        setMessage('Produk berhasil dihapus!')
        setTimeout(() => setMessage(''), 3000)
      })
  }

  function handlePageEdit(slug) {
    const existing = pages.find(p => p.slug === slug)
    setEditingPageSlug(slug)
    setPageForm({
      title: existing?.title || PAGE_LIST.find(p => p.slug === slug)?.label || '',
      content: existing?.content || ''
    })
  }

  function handlePageSave() {
    fetch(`/api/pages/${editingPageSlug}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(pageForm)
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) { onLogout(); return }
        if (!res.ok) throw new Error('Gagal menyimpan')
        return res.json()
      })
      .then(() => {
        fetchPages()
        setEditingPageSlug(null)
        setPageForm({ title: '', content: '' })
        setMessage('Halaman berhasil disimpan!')
        setTimeout(() => setMessage(''), 3000)
      })
      .catch(err => { setMessage('Error: ' + err.message); setTimeout(() => setMessage(''), 3000) })
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h2><i className="fa fa-cog" style={{ marginRight: '8px' }}></i> Panel Admin</h2>
          <div className="admin-actions">
            <span className="admin-welcome">Halo, {username}</span>
            <button className="btn btn-outline" onClick={onLogout}>Logout</button>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            <i className="fa fa-box"></i> Produk
          </button>
          <button className={`admin-tab ${tab === 'pages' ? 'active' : ''}`} onClick={() => setTab('pages')}>
            <i className="fa fa-file-alt"></i> Halaman (Footer Links)
          </button>
        </div>

        {message && <div className="admin-alert">{message}</div>}

        {tab === 'products' && (
          <>
            {showForm && (
              <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Nama Produk</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Nama produk" />
                  </div>
                  <div className="form-group">
                    <label>Kategori</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      list="category-list"
                      required
                      placeholder="Ketik atau pilih kategori"
                    />
                    <datalist id="category-list">
                      {categories.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div className="form-group">
                    <label>Harga (Rp)</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} required placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label>Diskon (%)</label>
                    <input type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="0" min="0" max="100" />
                  </div>
                  <div className="form-group">
                    <label>Stok</label>
                    <input type="number" name="stock" value={form.stock} onChange={handleChange} required placeholder="0" />
                  </div>
                  <div className="form-group full-width">
                    <label>URL Gambar</label>
                    <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                  </div>
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows="3" required placeholder="Deskripsi produk..." />
                </div>
                {form.image && (
                  <div className="form-preview">
                    <img src={form.image} alt="preview" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
                <div className="form-btns">
                  <button type="submit" className="btn">{editingId ? 'Simpan' : 'Tambah'}</button>
                  <button type="button" className="btn btn-outline" onClick={resetForm}>Batal</button>
                </div>
              </form>
            )}

            <div style={{ marginBottom: '16px' }}>
              {!showForm && (
                <button className="btn" onClick={() => { resetForm(); setShowForm(true) }}>
                  <i className="fa fa-plus" style={{ marginRight: '6px' }}></i> Tambah Produk
                </button>
              )}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Gambar</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Diskon</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>
                        <img
                          src={p.image || DEFAULT_IMAGE}
                          alt=""
                          className="table-thumb"
                          onError={e => { e.target.src = DEFAULT_IMAGE }}
                        />
                      </td>
                      <td>{p.name}</td>
                      <td><span className="tag">{p.category}</span></td>
                      <td>{formatPrice(p.price)}</td>
                      <td>{p.discount > 0 ? <span className="tag" style={{ background: '#fff3f3', color: '#dc3545' }}>{p.discount}%</span> : '-'}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button className="btn-small edit" onClick={() => handleEdit(p)}>
                          <i className="fa fa-edit"></i> Edit
                        </button>
                        <button className="btn-small delete" onClick={() => handleDelete(p.id)}>
                          <i className="fa fa-trash"></i> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'pages' && (
          <div className="pages-section">
            {editingPageSlug ? (
              <div className="admin-form">
                <h3>Edit: {PAGE_LIST.find(p => p.slug === editingPageSlug)?.label || editingPageSlug}</h3>
                <div className="form-group">
                  <label>Judul Halaman</label>
                  <input value={pageForm.title} onChange={e => setPageForm({ ...pageForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Konten (HTML)</label>
                  <textarea
                    value={pageForm.content}
                    onChange={e => setPageForm({ ...pageForm, content: e.target.value })}
                    rows="20"
                    required
                    placeholder="<h3>Judul Section</h3><p>Isi konten...</p>"
                    style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
                  />
                </div>
                <div className="form-btns">
                  <button className="btn" onClick={handlePageSave}>Simpan</button>
                  <button className="btn btn-outline" onClick={() => { setEditingPageSlug(null); setPageForm({ title: '', content: '' }) }}>Batal</button>
                </div>
              </div>
            ) : (
              <div className="pages-list">
                {PAGE_LIST.map(item => {
                  const saved = pages.find(p => p.slug === item.slug)
                  return (
                    <div key={item.slug} className="page-item">
                      <div className="page-info">
                        <strong>{item.label}</strong>
                        <span className="page-slug">/{item.slug}</span>
                        {saved && <span className="tag">Teredit</span>}
                      </div>
                      <button className="btn-small edit" onClick={() => handlePageEdit(item.slug)}>
                        <i className="fa fa-edit"></i> Edit
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
