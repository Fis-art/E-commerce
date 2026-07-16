import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import CategoryCards from './components/CategoryCards'
import FeaturesBar from './components/FeaturesBar'
import ProductGrid from './components/ProductGrid'
import Account from './components/Account'
import AdminPanel from './components/AdminPanel'
import InfoPage from './components/InfoPage'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const [page, setPage] = useState('home')
  const [infoPage, setInfoPage] = useState('')
  const [category, setCategory] = useState('all')
  const [activeSection, setActiveSection] = useState('best-sellers')
  const [searchQuery, setSearchQuery] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [role, setRole] = useState(localStorage.getItem('role') || '')
  const [allProducts, setAllProducts] = useState([])
  const [settings, setSettings] = useState({ storeName: 'ElektronikNesia', storeTagline: 'Pusat Belanja Elektronik Terpercaya' })

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setAllProducts).catch(() => {})
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data && data.storeName) setSettings(data)
      if (data?.storeName) document.title = `${data.storeName} — ${data.storeTagline || 'Belanja Elektronik'}`
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (token) {
      fetch('/api/me', { headers: { 'Authorization': token } })
        .then(res => { if (!res.ok) { handleLogout(); return null }; return res.json() })
        .then(data => { if (data && data.role !== role) { setRole(data.role); localStorage.setItem('role', data.role) } })
    }
  }, [])

  const grouped = allProducts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  function handleLogin(tokenVal, user, userRole) {
    setToken(tokenVal); setUsername(user); setRole(userRole)
    localStorage.setItem('token', tokenVal); localStorage.setItem('username', user); localStorage.setItem('role', userRole)
    setPage(userRole === 'admin' ? 'admin' : 'home')
  }

  function handleLogout() {
    if (token) fetch('/api/logout', { method: 'POST', headers: { 'Authorization': token } })
    setToken(null); setUsername(''); setRole('')
    localStorage.removeItem('token'); localStorage.removeItem('username'); localStorage.removeItem('role')
    setPage('home')
  }

  function scrollToSection(sectionId) {
    setActiveSection(sectionId)
    setCategory('all')
    setSearchQuery('')
    setPage('home')
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  function handleSearch(q) {
    setSearchQuery(q)
    setCategory('all')
    setActiveSection('search-results')
    setPage('home')
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  function renderPage() {
    if (page === 'account') {
      return <Account onLogin={handleLogin} token={token} username={username} role={role} onLogout={handleLogout} setPage={setPage} storeName={settings.storeName} />
    }
    if (page === 'admin') {
      if (!token) return <Account onLogin={handleLogin} token={token} username={username} role={role} onLogout={handleLogout} setPage={setPage} storeName={settings.storeName} />
      if (role !== 'admin') return <Account onLogin={handleLogin} token={token} username={username} role={role} onLogout={handleLogout} setPage={setPage} storeName={settings.storeName} />
      return <AdminPanel token={token} onLogout={handleLogout} username={username} />
    }
    if (page === 'info') {
      return <InfoPage slug={infoPage} setPage={setPage} />
    }
    return (
      <>
        <HeroSection setCategory={setCategory} setPage={setPage} />
        {category === 'all' && !searchQuery && Object.keys(grouped).length > 0 && (
          <CategoryCards grouped={grouped} setCategory={setCategory} setPage={setPage} />
        )}
        <FeaturesBar />
        <ProductGrid
          allProducts={allProducts}
          category={category}
          setCategory={setCategory}
          setPage={setPage}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          searchQuery={searchQuery}
        />
      </>
    )
  }

  return (
    <div>
      <Header
        page={page}
        setPage={setPage}
        setCategory={setCategory}
        token={token}
        username={username}
        role={role}
        onLogout={handleLogout}
        scrollToSection={scrollToSection}
        onSearch={handleSearch}
        storeName={settings.storeName}
      />
      {renderPage()}
      {page !== 'admin' && <Footer setPage={setPage} setInfoPage={setInfoPage} storeName={settings.storeName} />}
    </div>
  )
}
