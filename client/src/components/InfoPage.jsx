import { useState, useEffect } from 'react'
import './InfoPage.css'

const DEFAULT_PAGES = {
  'tentang-kami': {
    title: 'Tentang Kami',
    content: `<h3>ElektronikNesia — Pusat Belanja Elektronik Terpercaya</h3>
<p>ElektronikNesia didirikan pada tahun 2024 dengan visi menjadi pusat belanja elektronik terlengkap dan terpercaya di Indonesia. Kami menyediakan produk elektronik berkualitas tinggi mulai dari laptop, komputer, tablet, handphone, hingga aksesoris pendukung.</p>
<h3>Visi Kami</h3>
<p>Menjadi destinasi belanja elektronik nomor satu di Indonesia dengan memberikan pengalaman belanja yang mudah, aman, dan terjangkau untuk semua kalangan.</p>
<h3>Misi Kami</h3>
<ul>
<li>Menyediakan produk elektronik original dengan harga terbaik</li>
<li>Memberikan pelayanan pelanggan yang responsif dan profesional</li>
<li>Menjamin keaslian dan garansi setiap produk yang dijual</li>
<li>Mendukung kemudahan pembayaran dengan berbagai metode</li>
</ul>`
  },
  'cabang-toko': {
    title: 'Cabang Toko',
    content: `<h3>Lokasi Toko Kami</h3>
<div class="store-location">
<h4>Jakarta Selatan (Pusat)</h4>
<p>Jl. Teknologi No. 123, Kebayoran Baru, Jakarta Selatan 12190</p>
<p>Telp: (021) 1234-5678 | WhatsApp: 0812-3456-7890</p>
<p>Jam Operasional: Senin - Minggu, 08:00 - 21:00 WIB</p>
</div>
<div class="store-location">
<h4>Bandung</h4>
<p>Jl. Dago No. 456, Coblong, Bandung 40132</p>
<p>Telp: (022) 2045-6789 | WhatsApp: 0813-4567-8901</p>
<p>Jam Operasional: Senin - Minggu, 09:00 - 20:00 WIB</p>
</div>
<div class="store-location">
<h4>Surabaya</h4>
<p>Jl. Basuki Rahmat No. 789, Genteng, Surabaya 60275</p>
<p>Telp: (031) 3456-7890 | WhatsApp: 0815-6789-0123</p>
<p>Jam Operasional: Senin - Minggu, 09:00 - 20:00 WIB</p>
</div>`
  },
  'karir': {
    title: 'Karir',
    content: `<h3>Bergabung dengan ElektronikNesia</h3>
<p>Kami selalu mencari talenta terbaik untuk bergabung bersama kami. Jika kamu passionate di bidang teknologi dan pelayanan pelanggan, kami ingin mendengar ceritamu!</h3>
<h3>Posisi Yang Tersedia</h3>
<div class="job-listing">
<h4>Store Manager</h4>
<p>Bertanggung jawab atas operasional toko dan manajemen tim.</p>
</div>
<div class="job-listing">
<h4>Customer Service</h4>
<p>Melayani pertanyaan dan keluhan pelanggan secara profesional.</p>
</div>
<div class="job-listing">
<h4>IT Support</h4>
<p>Mengelola infrastruktur teknologi dan sistem informasi.</p>
</div>
<h3>Cara Melamar</h3>
<p>Kirim CV dan surat lamaran ke <strong>hr@elektroniknesia.com</strong> dengan subjek: "Lamaran - [Posisi]".</p>`
  },
  'blog': {
    title: 'Blog',
    content: `<h3>Artikel & Berita Terbaru</h3>
<div class="blog-post">
<h4>Tips Memilih Laptop untuk Mahasiswa 2026</h4>
<p class="blog-date">15 Juli 2026</p>
<p>Memilih laptop untuk kebutuhan kuliah tidak harus mahali. Berikut panduan lengkap memilih laptop dengan budget terjangkau namun tetap powerful untuk kegiatan akademik.</p>
</div>
<div class="blog-post">
<h4>Perbandingan iPhone 16 vs Samsung Galaxy S24</h4>
<p class="blog-date">10 Juli 2026</p>
<p>Dua flagship terbaru dari Apple dan Samsung hadir dengan fitur unggulan masing-masing. Simak perbandingan lengkap dari sisi kamera, performa, dan baterai.</p>
</div>
<div class="blog-post">
<h4>5 Aksesoris Wajib untuk Setup WFH yang Produktif</h4>
<p class="blog-date">5 Juli 2026</p>
<p>Work from home menjadi tren yang terus berlanjut. Ketahui aksesoris apa saja yang perlu kamu miliki untuk meningkatkan produktivitas kerja dari rumah.</p>
</div>`
  },
  'syarat-ketentuan': {
    title: 'Syarat & Ketentuan',
    content: `<h3>Syarat dan Ketentuan Penggunaan</h3>
<p>Selamat datang di ElektronikNesia. Dengan mengakses dan menggunakan situs kami, Anda setuju untuk mematuhi syarat dan ketentuan berikut:</p>
<h3>1. Akun Pengguna</h3>
<p>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Semua aktivitas yang dilakukan melalui akun Anda menjadi tanggung jawab Anda.</p>
<h3>2. Pemesanan</h3>
<p>Setiap pemesanan yang Anda buat merupakan penawaran pembelian produk. Kami berhak untuk menerima atau menolak pemesanan tersebut.</p>
<h3>3. Harga dan Pembayaran</h3>
<p>Harga yang tercantum dapat berubah sewaktu-waktu tanpa pemberitahuan. Pembayaran harus dilakukan sesuai metode yang tersedia.</p>
<h3>4. Pengiriman</h3>
<p>Estimasi waktu pengiriman adalah 1-5 hari kerja tergantung lokasi. Kami tidak bertanggung jawab atas keterlambatan yang disebabkan oleh pihak ekspedisi.</p>
<h3>5. Pengembalian</h3>
<p>Pengembalian produk dapat dilakukan dalam waktu 7 hari setelah penerimaan dengan syarat produk masih dalam kondisi asli dan belum digunakan.</p>`
  },
  'kebijakan-privasi': {
    title: 'Kebijakan Privasi',
    content: `<h3>Kebijakan Privasi ElektronikNesia</h3>
<p>Kami menghargai privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.</p>
<h3>Informasi yang Kami Kumpulkan</h3>
<ul>
<li>Nama lengkap dan alamat email</li>
<li>Alamat pengiriman dan nomor telepon</li>
<li>Informasi pembayaran (dienkripsi)</li>
<li>Riwayat pembelian dan aktivitas browsing</li>
</ul>
<h3>Penggunaan Informasi</h3>
<ul>
<li>Memproses pesanan dan pengiriman</li>
<li>Mengirimkan informasi promo dan penawaran</li>
<li>Meningkatkan layanan dan pengalaman belanja</li>
<li>Keamanan dan pencegahan penipuan</li>
</ul>
<h3>Perlindungan Data</h3>
<p>Kami menggunakan teknologi enkripsi SSL untuk melindungi data pribadi Anda. Informasi pembayaran tidak disimpan di server kami.</p>`
  },
  'faq': {
    title: 'FAQ',
    content: `<h3>Pertanyaan yang Sering Diajukan</h3>
<div class="faq-item">
<h4>Bagaimana cara melakukan pemesanan?</h4>
<p>Pilih produk yang diinginkan, masukkan ke keranjang, lalu ikuti proses checkout. Anda akan menerima email konfirmasi setelah pemesanan berhasil.</p>
</div>
<div class="faq-item">
<h4>Metode pembayaran apa saja yang diterima?</h4>
<p>Kami menerima transfer bank (BCA, BRI, Mandiri), kartu kredit/debit, GoPay, OVO, dan COD (bayar di tempat) untuk area tertentu.</p>
</div>
<div class="faq-item">
<h4>Berapa lama pengiriman?</h4>
<p>Pengiriman regular 1-5 hari kerja. Pengiriman express 1-2 hari kerja. Waktu dapat bervariasi tergantung lokasi.</p>
</div>
<div class="faq-item">
<h4>Apakah produk bergaransi?</h4>
<p>Ya, semua produk memiliki garansi resmi dari distributor/manufacturer. Durasi garansi bervariasi per produk.</p>
</div>
<div class="faq-item">
<h4>Bagaimana cara mengembalikan produk?</h4>
<p>Hubungi customer service dalam 7 hari setelah penerimaan. Produk harus dalam kondisi asli dan belum digunakan.</p>
</div>
<div class="faq-item">
<h4>Apakah bisa cicilan?</h4>
<p>Ya, kami menyediakan cicilan 0% untuk tenor 3-12 bulan menggunakan kartu kredit tertentu.</p>
</div>`
  },
  'cara-pemesanan': {
    title: 'Cara Pemesanan',
    content: `<h3>Panduan Cara Pemesanan</h3>
<h3>Langkah 1: Pilih Produk</h3>
<p>Jelajahi kategori produk kami atau gunakan fitur pencarian untuk menemukan produk yang diinginkan.</p>
<h3>Langkah 2: Tambah ke Keranjang</h3>
<p>Klik tombol "Tambah ke Keranjang" pada produk yang dipilih. Anda bisa melanjutkan belanja atau langsung ke keranjang.</p>
<h3>Langkah 3: Checkout</h3>
<p>Di halaman keranjang, periksa kembali pesanan Anda. Klik "Checkout" untuk melanjutkan ke pemilihan alamat dan metode pembayaran.</p>
<h3>Langkah 4: Pembayaran</h3>
<p>Pilih metode pembayaran yang diinginkan. Ikuti instruksi pembayaran yang muncul.</p>
<h3>Langkah 5: Konfirmasi</h3>
<p>Setelah pembayaran berhasil, Anda akan menerima email konfirmasi beserta nomor resi pengiriman.</p>`
  },
  'cara-pembayaran': {
    title: 'Cara Pembayaran',
    content: `<h3>Metode Pembayaran</h3>
<h3>1. Transfer Bank</h3>
<p><strong>BCA:</strong> 1234567890 a.n. ElektronikNesia</p>
<p><strong>BRI:</strong> 0987654321 a.n. ElektronikNesia</p>
<p><strong>Mandiri:</strong> 1122334455 a.n. ElektronikNesia</p>
<p>Kirim bukti transfer ke WhatsApp kami untuk konfirmasi cepat.</p>
<h3>2. Kartu Kredit/Debit</h3>
<p>Kami menerima Visa, Mastercard, dan JCB. Pembayaran dienkripsi dengan SSL.</p>
<h3>3. E-Wallet</h3>
<p><strong>GoPay:</strong> 0812-3456-7890</p>
<p><strong>OVO:</strong> 0812-3456-7890</p>
<p><strong>DANA:</strong> 0812-3456-7890</p>
<h3>4. COD (Bayar di Tempat)</h3>
<p>Tersedia untuk area Jakarta, Bandung, dan Surabaya. Biaya tambahan Rp 15.000.</p>
<h3>5. Cicilan</h3>
<p>Cicilan 0% untuk tenor 3, 6, 9, 12 bulan. Berlaku untuk kartu kredit BCA, Mandiri, BRI, dan BNI.</p>`
  },
  'pengembalian': {
    title: 'Pengembalian',
    content: `<h3>Kebijakan Pengembalian</h3>
<h3>Syarat Pengembalian</h3>
<ul>
<li>Pengembalian harus dilakukan dalam waktu 7 hari setelah produk diterima</li>
<li>Produk harus dalam kondisi asli, belum digunakan, dan masih dalam kemasan</li>
<li>Perlengkapan lengkap (dus, buku panduan, aksesoris)</li>
<li>Bukti pembelian (invoice) harus dilampirkan</li>
</ul>
<h3>Proses Pengembalian</h3>
<ol>
<li>Hubungi customer service melalui WhatsApp atau email</li>
<li>Jelaskan alasan pengembalian</li>
<li>Anda akan menerima instruksi pengembalian</li>
<li>Kirim produk ke alamat yang telah ditentukan</li>
<li>Pengembalian dana dilakukan dalam 3-5 hari kerja setelah produk diterima</li>
</ol>
<h3>Yang Tidak Dapat Dikembalikan</h3>
<ul>
<li>Produk yang sudah rusak karena kesalahan pengguna</li>
<li>Produk yang kemasannya sudah dibuka dan sudah digunakan</li>
<li>Aksesoris tertentu (kabel, charger aftermarket)</li>
</ul>`
  },
  'garansi': {
    title: 'Garansi',
    content: `<h3>Kebijakan Garansi</h3>
<h3>Garansi Resmi</h3>
<p>Semua produk di ElektronikNesia memiliki garansi resmi dari distributor atau manufacturer. Durasi garansi bervariasi tergantung jenis produk.</p>
<h3>Duration Garansi</h3>
<ul>
<li><strong>Laptop:</strong> 2-3 tahun (tergantung brand)</li>
<li><strong>Handphone:</strong> 1-2 tahun</li>
<li><strong>Tablet:</strong> 1-2 tahun</li>
<li><strong>Aksesoris:</strong> 6-12 bulan</li>
<li><strong>Komponen PC:</strong> 1-3 tahun</li>
</ul>
<h3>Klaim Garansi</h3>
<ol>
<li>Hubungi customer service dengan nomor invoice</li>
<li>Jelaskan masalah yang dialami</li>
<li>Kirim produk ke service center kami</li>
<li>Proses klaim garansi 3-7 hari kerja</li>
</ol>
<h3>Yang Tidak Dicakup Garansi</h3>
<ul>
<li>Kerusakan akibat kesalahan pengguna</li>
<li>Modifikasi atau perubahan produk</li>
<li>Kerusakan akibat bencana alam</li>
<li>Kerusakan fisik (jatuh, terkena air, dll)</li>
</ul>`
  },
  'hubungi-kami': {
    title: 'Hubungi Kami',
    content: `<h3>Hubungi Kami</h3>
<h3>Customer Service</h3>
<p><strong>Telepon:</strong> (021) 1234-5678</p>
<p><strong>WhatsApp:</strong> 0812-3456-7890</p>
<p><strong>Email:</strong> cs@elektroniknesia.com</p>
<p><strong>Jam Operasional:</strong> Senin - Minggu, 08:00 - 21:00 WIB</p>
<h3>Email Lainnya</h3>
<p><strong>Sales:</strong> sales@elektroniknesia.com</p>
<p><strong>Support:</strong> support@elektroniknesia.com</p>
<p><strong>HR:</strong> hr@elektroniknesia.com</p>
<h3>Alamat Kantor Pusat</h3>
<p>ElektronikNesia<br>Jl. Teknologi No. 123<br>Kebayoran Baru, Jakarta Selatan 12190<br>Indonesia</p>
<h3>Social Media</h3>
<p>Instagram: @elektroniknesia<br>TikTok: @elektroniknesia<br>YouTube: ElektronikNesia Official</p>`
  }
}

export default function InfoPage({ slug, setPage }) {
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/pages/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.content) {
          setPageData(data)
        } else if (DEFAULT_PAGES[slug]) {
          setPageData({ title: DEFAULT_PAGES[slug].title, content: DEFAULT_PAGES[slug].content })
        } else {
          setPageData({ title: 'Halaman Tidak Ditemukan', content: '<p>Halaman yang Anda cari tidak ditemukan.</p>' })
        }
        setLoading(false)
      })
      .catch(() => {
        if (DEFAULT_PAGES[slug]) {
          setPageData({ title: DEFAULT_PAGES[slug].title, content: DEFAULT_PAGES[slug].content })
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) return <div className="info-page"><div className="container"><p>Memuat...</p></div></div>

  return (
    <div className="info-page">
      <div className="container">
        <button className="back-btn" onClick={() => setPage('home')}>
          <i className="fa fa-arrow-left"></i> Kembali ke Home
        </button>
        <div className="info-content" dangerouslySetInnerHTML={{ __html: pageData?.content || '' }} />
      </div>
    </div>
  )
}
