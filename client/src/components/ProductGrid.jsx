import { useState } from 'react'
import './ProductGrid.css'

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(price)
}

function calcDiscount(price, discount) {
  return price - Math.round(price * discount / 100)
}

const CATEGORY_ICONS = { 'Laptop': '💻', 'Komputer': '🖥️', 'Tablet': '📱', 'HP': '📱', 'Aksesoris': '🎧' }

function Stars() {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => <i key={i} className={`fa fa-star${i > 4 ? '-half-o' : ''}`}></i>)}
    </span>
  )
}

function ProductCard({ p, imgErrors, handleImgError }) {
  const hasDiscount = p.discount > 0
  const discountedPrice = hasDiscount ? calcDiscount(p.price, p.discount) : p.price
  const info = CATEGORY_ICONS[p.category] || '📦'

  return (
    <div className="col-4">
      <div className="product-card">
        <div className="product-badge">
          {hasDiscount && <span className="badge-discount">{p.discount}% Off</span>}
        </div>
        <div className="product-img-wrap">
          {!imgErrors[p.id] ? (
            <img
              src={p.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(p.name)}`}
              alt={p.name}
              loading="lazy"
              onError={() => handleImgError(p.id)}
            />
          ) : (
            <div className="product-img-placeholder">{info}</div>
          )}
          <div className="product-actions">
            <button title="Quick View"><i className="fa fa-eye"></i></button>
            <button title="Tambah ke Keranjang"><i className="fa fa-shopping-cart"></i></button>
          </div>
        </div>
        <div className="product-info">
          <span className="product-category-tag">{p.category}</span>
          <h4 className="product-name">{p.name}</h4>
          <div className="product-rating">
            <Stars />
            <span className="count">({Math.floor(Math.random() * 50) + 5})</span>
          </div>
          <div className="product-price">
            <span className="price-current">{formatPrice(discountedPrice)}</span>
            {hasDiscount && <span className="price-old">{formatPrice(p.price)}</span>}
          </div>
          {p.stock > 0 && <span className="stock-label">Stok: {p.stock}</span>}
        </div>
      </div>
    </div>
  )
}

function Section({ title, items, id, onViewAll, viewAllLabel }) {
  if (!items || items.length === 0) return null
  return (
    <div id={id} style={{ marginBottom: '50px' }}>
      <div className="product-section-header">
        <h2>{title}</h2>
        {onViewAll && (
          <button className="view-all" onClick={onViewAll}>
            {viewAllLabel || 'View All'} <i className="fa fa-arrow-right" style={{ fontSize: '11px' }}></i>
          </button>
        )}
      </div>
      <div className="row">
        {items.map(p => <ProductCard key={p.id} p={p} imgErrors={{}} handleImgError={() => {}} />)}
      </div>
    </div>
  )
}

export default function ProductGrid({ allProducts, category, setCategory, setPage, activeSection, setActiveSection, searchQuery }) {
  const [imgErrors, setImgErrors] = useState({})
  const [activeTab, setActiveTab] = useState('best')

  function handleImgError(id) {
    setImgErrors(prev => ({ ...prev, [id]: true }))
  }

  // 1. SEARCH
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase()
    const results = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    )

    return (
      <div className="small-container" id="search-results">
        <div className="products-section">
          <div className="product-section-header">
            <h2>Hasil pencarian: "{searchQuery}" <span style={{ fontSize: '14px', fontWeight: 400, color: '#999' }}>({results.length} produk)</span></h2>
          </div>
          {results.length === 0 ? (
            <div className="empty-section">
              <i className="fa fa-search" style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }}></i>
              <h2 style={{ marginBottom: '8px' }}>Tidak ada hasil untuk "{searchQuery}"</h2>
              <p>Coba kata kunci lain atau lihat kategori produk kami.</p>
              <button className="btn" style={{ marginTop: '16px' }} onClick={() => { setCategory('all') }}>Lihat Semua Produk</button>
            </div>
          ) : (
            <div className="row">
              {results.map(p => <ProductCard key={p.id} p={p} imgErrors={imgErrors} handleImgError={handleImgError} />)}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 2. CATEGORY FILTER
  if (category !== 'all') {
    const items = allProducts.filter(p => p.category === category)
    const sorted = [...items].sort((a, b) => {
      if (activeTab === 'best') return (b.stock || 0) - (a.stock || 0)
      if (activeTab === 'new') return b.id - a.id
      return a.price - b.price
    })

    return (
      <div className="small-container" id="products-section">
        <div className="products-section">
          <button className="back-btn" onClick={() => setCategory('all')}>
            <i className="fa fa-arrow-left"></i> Semua Kategori
          </button>
          <div className="product-section-header">
            <h2>{category}</h2>
          </div>
          <div className="title-tabs">
            <button className={`tab-btn ${activeTab === 'best' ? 'active' : ''}`} onClick={() => setActiveTab('best')}>Best Sellers</button>
            <button className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>New Arrivals</button>
            <button className={`tab-btn ${activeTab === 'cheap' ? 'active' : ''}`} onClick={() => setActiveTab('cheap')}>Harga Terbaik</button>
          </div>
          <div className="row">
            {sorted.map(p => <ProductCard key={p.id} p={p} imgErrors={imgErrors} handleImgError={handleImgError} />)}
          </div>
        </div>
      </div>
    )
  }

  // 3. HOMEPAGE — section-based
  const bestSellers = [...allProducts].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 8)
  const promo = allProducts.filter(p => p.discount > 0).sort((a, b) => b.discount - a.discount).slice(0, 8)
  const newArrivals = [...allProducts].sort((a, b) => b.id - a.id).slice(0, 8)
  const cheapest = [...allProducts].sort((a, b) => a.price - b.price).slice(0, 8)

  const isHome = !activeSection || activeSection === 'best-sellers'

  return (
    <div className="small-container" id="products-section">
      <div className="products-section">
        {isHome && (
          <>
            <Section title="Best Sellers" items={bestSellers} id="best-sellers"
              onViewAll={() => setActiveSection('best-sellers')} viewAllLabel="View All" />
            {promo.length > 0 && (
              <Section title="Produk Diskon" items={promo} id="promo-section"
                onViewAll={() => setActiveSection('promo-section')} viewAllLabel="View All" />
            )}
            <Section title="New Arrivals" items={newArrivals} id="new-arrivals"
              onViewAll={() => setActiveSection('new-arrivals')} viewAllLabel="View All" />
            <Section title="Harga Terbaik" items={cheapest} id="cheapest"
              onViewAll={() => setActiveSection('cheapest')} viewAllLabel="View All" />
          </>
        )}

        {activeSection === 'best-sellers' && !isHome && (
          <>
            <button className="back-btn" onClick={() => setActiveSection('best-sellers')}>
              <i className="fa fa-arrow-left"></i> Kembali
            </button>
            <Section title="Best Sellers" items={bestSellers} id="best-sellers" />
          </>
        )}

        {activeSection === 'promo-section' && (
          <>
            <button className="back-btn" onClick={() => setActiveSection('best-sellers')}>
              <i className="fa fa-arrow-left"></i> Kembali
            </button>
            <Section title="Semua Produk Diskon" items={promo} id="promo-section" />
          </>
        )}

        {activeSection === 'new-arrivals' && (
          <>
            <button className="back-btn" onClick={() => setActiveSection('best-sellers')}>
              <i className="fa fa-arrow-left"></i> Kembali
            </button>
            <Section title="Semua New Arrivals" items={newArrivals} id="new-arrivals" />
          </>
        )}

        {activeSection === 'cheapest' && (
          <>
            <button className="back-btn" onClick={() => setActiveSection('best-sellers')}>
              <i className="fa fa-arrow-left"></i> Kembali
            </button>
            <Section title="Semua Harga Terbaik" items={cheapest} id="cheapest" />
          </>
        )}
      </div>
    </div>
  )
}
