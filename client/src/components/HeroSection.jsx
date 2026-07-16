import { useState, useEffect } from 'react'
import './HeroSection.css'

const SLIDES = [
  {
    badge: 'Promo Spesial',
    title: 'Laptop Gaming RTX 40 Series',
    desc: 'Dapatkan laptop gaming terbaru dengan GPU NVIDIA RTX 40 Series. Harga spesial untuk pembelian minggu ini.',
    btn: 'Lihat Promo',
    img: 'https://images.unsplash.com/photo-1603302576839-377311c81eb2?w=600',
  },
  {
    badge: 'New Arrival',
    title: 'iPhone 16 Pro Max',
    desc: 'Chip A18 Pro, kamera 48MP, desain titanium. Tersedia sekarang!',
    btn: 'Pesan Sekarang',
    img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600',
  },
  {
    badge: 'Best Seller',
    title: 'iPad Pro M4 11"',
    desc: 'Chip M4, Liquid Retina XDR, Apple Pencil Pro support.',
    btn: 'Beli Sekarang',
    img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
  }
]

export default function HeroSection({ setCategory, setPage }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero-section">
      <div className="hero-slider">
        {SLIDES.map((slide, i) => (
          <div className={`hero-slide ${i === current ? 'active' : ''}`} key={i}>
            <div className="container">
              <div className="hero-content">
                <span className="hero-badge">{slide.badge}</span>
                <h1>{slide.title}</h1>
                <p>{slide.desc}</p>
                <div className="hero-btns">
                  <button className="btn" onClick={() => { setPage('home'); setCategory('all') }}>
                    {slide.btn} <i className="fa fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                  </button>
                  <button className="btn btn-outline" onClick={() => {
                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}>
                    Lihat Semua
                  </button>
                </div>
              </div>
              <div className="hero-image">
                <img src={slide.img} alt={slide.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  )
}
