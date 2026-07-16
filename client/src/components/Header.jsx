import { useState } from 'react'
import './Header.css'

export default function Header({ page, setPage, setCategory, token, username, role, onLogout, scrollToSection, onSearch, storeName }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const displayName = storeName || 'ElektronikNesia'
  const logoParts = displayName.length > 10 ? [displayName.slice(0, Math.ceil(displayName.length / 2)), displayName.slice(Math.ceil(displayName.length / 2))] : [displayName, '']

  function handleSearch(e) {
    e.preventDefault()
    const q = inputVal.trim()
    if (q) {
      onSearch(q)
      setMenuOpen(false)
    }
  }

  return (
    <>
      <div className="header-top">
        <div className="container">
          <div className="header-top-left">
            <span><i className="fa fa-envelope"></i> sales@elektroniknesia.com</span>
            <span style={{ marginLeft: '16px' }}><i className="fa fa-phone"></i> (021) 1234-5678</span>
          </div>
          <div className="header-top-right">
            <a href="#"><i className="fa fa-question-circle"></i> Bantuan</a>
            <a href="#"><i className="fa fa-store"></i> Cabang Toko</a>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="logo">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); setCategory('all'); setInputVal('') }}>
              <span className="logo-icon"><i className="fa fa-bolt"></i></span>
              <span className="logo-text">{logoParts[0]}{logoParts[1] && <span>{logoParts[1]}</span>}</span>
            </a>
          </div>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari laptop, HP, tablet, aksesoris..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit"><i className="fa fa-search"></i></button>
          </form>

          <div className="header-icons">
            {token ? (
              <div className="user-info">
                {role === 'admin' && <span className="user-badge">Admin</span>}
                <span className="user-name desktop-only">{username}</span>
                {role === 'admin' && (
                  <a href="#" className="desktop-only" onClick={(e) => { e.preventDefault(); setPage('admin') }}>
                    <i className="fa fa-cog"></i>
                  </a>
                )}
                <button className="logout-btn" onClick={onLogout}>
                  <i className="fa fa-sign-out"></i>
                </button>
              </div>
            ) : (
              <a href="#" onClick={(e) => { e.preventDefault(); setPage('account') }}>
                <i className="fa fa-user"></i>
                <span className="desktop-only">Masuk</span>
              </a>
            )}
            <a href="#" className="icon-link icon-badge desktop-only">
              <i className="fa fa-shopping-cart"></i>
              <span className="badge-count">0</span>
              <span>Keranjang</span>
            </a>
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <i className={menuOpen ? 'fa fa-times' : 'fa fa-bars'}></i>
            </button>
          </div>
        </div>
      </div>

      <div className="navbar">
        <div className="container">
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li>
              <a href="#" className={page === 'home' ? 'active' : ''} onClick={(e) => {
                e.preventDefault(); setPage('home'); setCategory('all'); setInputVal(''); setMenuOpen(false)
              }}>
                <i className="fa fa-home"></i> Home
              </a>
            </li>
            <li className="cat-dropdown">
              <a href="#"><i className="fa fa-th-large"></i> Kategori <i className="fa fa-chevron-down" style={{ fontSize: '10px', marginLeft: '4px' }}></i></a>
              <div className="cat-dropdown-content">
                {['Laptop', 'Komputer', 'Tablet', 'HP', 'Aksesoris'].map(cat => (
                  <a key={cat} href="#" onClick={(e) => {
                    e.preventDefault(); setPage('home'); setCategory(cat); setInputVal(''); setMenuOpen(false)
                    setTimeout(() => {
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 150)
                  }}>{cat}</a>
                ))}
              </div>
            </li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('promo-section'); setInputVal(''); setMenuOpen(false) }}>
              <i className="fa fa-tags"></i> Promo
            </a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('best-sellers'); setInputVal(''); setMenuOpen(false) }}>
              <i className="fa fa-star"></i> Best Seller
            </a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('new-arrivals'); setInputVal(''); setMenuOpen(false) }}>
              <i className="fa fa-clock-o"></i> New Arrivals
            </a></li>
            {role === 'admin' && (
              <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('admin'); setMenuOpen(false) }}>
                <i className="fa fa-cog"></i> Admin
              </a></li>
            )}
          </ul>
        </div>
      </div>
    </>
  )
}
