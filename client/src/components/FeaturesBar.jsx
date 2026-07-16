import './FeaturesBar.css'

const FEATURES = [
  { icon: '🚚', title: 'Easy Shipping', desc: 'Jasa pengiriman terpercaya' },
  { icon: '💰', title: 'Best Deal', desc: 'Kami berikan harga terbaik' },
  { icon: '🛡️', title: 'Garansi Toko', desc: 'Kepuasan belanja terjamin' },
  { icon: '💬', title: 'Online Support', desc: '24/7 Dedicated Support' },
]

export default function FeaturesBar() {
  return (
    <div className="features-bar">
      <div className="container">
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-item" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-text">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
