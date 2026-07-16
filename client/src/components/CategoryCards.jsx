import './CategoryCards.css'

const CATEGORY_MAP = {
  'Laptop': { icon: '💻', label: 'Laptop' },
  'Komputer': { icon: '🖥️', label: 'Komputer & Desktop' },
  'Tablet': { icon: '📱', label: 'Tablet' },
  'HP': { icon: '📱', label: 'Handphone' },
  'Aksesoris': { icon: '🎧', label: 'Aksesoris' },
}

export default function CategoryCards({ grouped, setCategory, setPage }) {
  function handleCategoryClick(cat) {
    setPage('home')
    setCategory(cat)
    setTimeout(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  return (
    <div className="category-cards-section">
      <div className="container">
        <div className="section-title">
          <h2>Kategori Produk</h2>
          <p>Pilihan produk elektronik terlengkap</p>
        </div>
        <div className="category-cards-grid">
          {Object.entries(grouped).map(([cat, items]) => {
            const info = CATEGORY_MAP[cat] || { icon: '📦', label: cat }
            return (
              <div
                className="category-card-item"
                key={cat}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="cat-icon-wrap">
                  <span>{info.icon}</span>
                </div>
                <h3>{info.label}</h3>
                <span className="cat-count">{items.length} Produk</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
