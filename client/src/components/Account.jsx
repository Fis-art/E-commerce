import { useState } from 'react'
import './Account.css'

export default function Account({ onLogin, token, username, role, onLogout, setPage }) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const url = isLogin ? '/api/login' : '/api/register'
    const body = isLogin
      ? { username: form.username, password: form.password }
      : { username: form.username, email: form.email, password: form.password }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          onLogin(data.token, data.username, data.role)
        } else {
          setError(data.message || 'Terjadi kesalahan')
        }
      })
      .catch(() => setError('Koneksi ke server gagal'))
      .finally(() => setLoading(false))
  }

  if (token) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="profile-card">
            <div className="profile-avatar">
              <i className="fa fa-user"></i>
            </div>
            <h2>Halo, {username}!</h2>
            <span className={`role-badge ${role}`}>{role === 'admin' ? 'Administrator' : 'Member'}</span>
            <p style={{ marginTop: '12px', color: '#666' }}>
              {role === 'admin'
                ? 'Anda memiliki akses ke panel admin untuk mengelola produk.'
                : 'Selamat datang di ElektronikNesia. Selamat berbelanja!'}
            </p>
            {role === 'admin' && (
              <button className="btn" onClick={() => setPage('admin')}>
                <i className="fa fa-cog" style={{ marginRight: '6px' }}></i> Panel Admin
              </button>
            )}
            <button className="btn btn-outline" onClick={onLogout} style={{ marginLeft: '10px' }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="form-container">
          <div className="form-tabs">
            <button className={`form-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setError('') }}>
              Masuk
            </button>
            <button className={`form-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setError('') }}>
              Daftar
            </button>
          </div>

          <div className="form-body">
            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={3}
                />
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
              </button>
            </form>

            {isLogin ? (
              <div className="form-link">
                Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); setError('') }}>Daftar sekarang</a>
              </div>
            ) : (
              <div className="form-link">
                Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); setError('') }}>Masuk</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
