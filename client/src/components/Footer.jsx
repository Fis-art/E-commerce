import './Footer.css'

const PAGE_SLUGS = {
  'FAQ': 'faq',
  'Cara Pemesanan': 'cara-pemesanan',
  'Cara Pembayaran': 'cara-pembayaran',
  'Pengembalian': 'pengembalian',
  'Garansi': 'garansi',
  'Tentang Kami': 'tentang-kami',
  'Cabang Toko': 'cabang-toko',
  'Karir': 'karir',
  'Blog': 'blog',
  'Syarat & Ketentuan': 'syarat-ketentuan',
  'Kebijakan Privasi': 'kebijakan-privasi',
  'Hubungi Kami': 'hubungi-kami',
}

export default function Footer({ setPage, setInfoPage }) {
  function handleLink(label) {
    const slug = PAGE_SLUGS[label]
    if (slug) {
      setInfoPage(slug)
      setPage('info')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">Elektronik<span>Nesia</span></div>
            <p>Pusat belanja elektronik terpercaya di Indonesia. Laptop, PC, tablet, HP, dan aksesoris dengan harga terbaik.</p>
            <div className="footer-social">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-tiktok"></i></a>
              <a href="#"><i className="fab fa-whatsapp"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div>
            <h3>Informasi</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Tentang Kami') }}>Tentang Kami</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Cabang Toko') }}>Cabang Toko</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Karir') }}>Karir</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Blog') }}>Blog</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Syarat & Ketentuan') }}>Syarat & Ketentuan</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Kebijakan Privasi') }}>Kebijakan Privasi</a></li>
            </ul>
          </div>

          <div>
            <h3>Customer Service</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('FAQ') }}>FAQ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Cara Pemesanan') }}>Cara Pemesanan</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Cara Pembayaran') }}>Cara Pembayaran</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Pengembalian') }}>Pengembalian</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Garansi') }}>Garansi</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLink('Hubungi Kami') }}>Hubungi Kami</a></li>
            </ul>
          </div>

          <div>
            <h3>Hubungi Kami</h3>
            <ul className="footer-contact">
              <li>
                <i className="fa fa-map-marker-alt"></i>
                <span>Jl. Teknologi No. 123, Jakarta Selatan, Indonesia</span>
              </li>
              <li>
                <i className="fa fa-phone"></i>
                <span>(021) 1234-5678</span>
              </li>
              <li>
                <i className="fa fa-envelope"></i>
                <span>sales@elektroniknesia.com</span>
              </li>
              <li>
                <i className="fa fa-clock"></i>
                <span>Senin - Minggu: 08:00 - 21:00</span>
              </li>
            </ul>
            <div className="footer-newsletter">
              <input type="email" placeholder="Email untuk newsletter..." />
              <button className="btn">Berlangganan</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 ElektronikNesia. All rights reserved.</p>
          <div className="footer-payments">
            <span><i className="fa fa-credit-card"></i> Visa</span>
            <span><i className="fa fa-credit-card"></i> Mastercard</span>
            <span><i className="fa fa-bank"></i> BCA</span>
            <span><i className="fa fa-bank"></i> BRI</span>
            <span><i className="fa fa-bank"></i> Mandiri</span>
            <span><i className="fa fa-wallet"></i> GoPay</span>
            <span><i className="fa fa-wallet"></i> OVO</span>
          </div>
        </div>
      </div>
    </div>
  )
}
