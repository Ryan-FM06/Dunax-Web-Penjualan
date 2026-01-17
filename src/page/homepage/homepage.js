const HomePage = {
  render() {
    return `
      <!-- HERO -->
      <section class="hero">
        <div class="hero-slide active">
          <img src="./src/assets/Photos/ayammm.webp" class="hero-image" />
          <div class="hero-content">
            <h1>Ayam</h1>
            <p>Langsung dari peternak</p>
            <a href="#/jual-ayam" class="btn-primary">Beli Ayam</a>
          </div>
        </div>

        <div class="hero-slide">
          <img src="./src/assets/Photos/MBINGS.jpg" class="hero-image" />
          <div class="hero-content">
            <h1>Kambing</h1>
            <p>Langsung dari peternak</p>
            <a href="#/jual-kambing" class="btn-primary">Beli Kambing</a>
          </div>
        </div>

        <div class="hero-slide">
          <img src="./src/assets/Photos/PI.jpg" class="hero-image" />
          <div class="hero-content">
            <h1>Sapi</h1>
            <p>Langsung dari peternak</p>
            <a href="#/jual-sapi" class="btn-primary">Beli Sapi</a>
          </div>
        </div>

        <div class="hero-slide">
          <img src="./src/assets/Photos/KAN.jpg" class="hero-image" />
          <div class="hero-content">
            <h1>Ikan</h1>
            <p>Langsung dari peternak</p>
            <a href="#/jual-ikan" class="btn-primary">Beli Ikan</a>
          </div>
        </div>

        <div class="hero-slide">
          <img src="./src/assets/Photos/YUR.jpg" class="hero-image" />
          <div class="hero-content">
            <h1>Sayur</h1>
            <p>Langsung dari peternak</p>
            <a href="#/jual-sayur" class="btn-primary">Beli Sayur</a>
          </div>
        </div>

        <button class="hero-btn prev">‹</button>
        <button class="hero-btn next">›</button>
            </section>

     <!-- WELCOME SECTION -->
<section class="welcome-section">
  <div class="welcome-card">
    <h2>Selamat Datang di Portal Digital Dunax Farm</h2>

    <p>
      Dunax Farm menghadirkan platform pemesanan berbasis web yang dirancang untuk mempermudah
      pelanggan dalam memperoleh produk peternakan secara cepat, praktis, dan terpercaya.
      Sistem ini difokuskan pada kemudahan akses, kecepatan proses, serta kenyamanan pengguna.
    </p>

    <p>
      Melalui portal ini, Anda dapat melakukan beberapa layanan utama berikut:
    </p>

    <ul class="welcome-list">
      <li>Pemesanan telur fertil berkualitas unggul dari berbagai lini unggas</li>
      <li>Pemesanan DoC (Day Old Chick) dengan standar kesehatan terjamin</li>
      <li>Pantauan ketersediaan produk secara real-time</li>
      <li>Akses informasi pemesanan dan status antrian secara transparan</li>
    </ul>

    <p class="welcome-footer">
      Platform ini akan terus dikembangkan secara bertahap untuk mendukung kebutuhan peternakan modern
      serta meningkatkan kualitas layanan bagi seluruh mitra dan pelanggan.
    </p>

    <div class="welcome-action">
      <a href="#/antrian" class="btn-primary">Lihat Daftar Antrian Saat Ini</a>
    </div>
  </div>
</section>

      <!-- MAIN LAYOUT -->
      <section class="home-layout">
        <div class="main-content">
          <div class="content-card">

            <section class="search-section">
              <input type="text" id="searchInput" placeholder="Cari produk ternak..." />
            </section>

            <section class="product-grid">

              <div class="product-card">
                <img src="./src/assets/Photos/ayammm.webp" />
                <h3>Ayam</h3>
                <p>Menjual aneka Ayam dan Telur dengan harga yang Murah</p>
                <a href="#/jual-ayam" class="btn-buy">Beli Sekarang</a>
              </div>

              <div class="product-card">
                <img src="./src/assets/Photos/kambing.jpg" />
                <h3>Kambing</h3>
                <p>Menjual Kambing dengan harga yang murah</p>
                <a href="#/jual-kambing" class="btn-buy">Beli Sekarang</a>
              </div>

              <div class="product-card">
                <img src="./src/assets/Photos/sapi.webp" />
                <h3>Sapi</h3>
                <p>Menjual Sapi dan Susu dengan harga yang murah</p>
                <a href="#/jual-sapi" class="btn-buy">Beli Sekarang</a>
              </div>

              <div class="product-card">
                <img src="./src/assets/Photos/ikan.webp" />
                <h3>Ikan</h3>
                <p>Menjual aneka Ikan ternak dengan harga yang murah</p>
                <a href="#/jual-ikan" class="btn-buy">Beli Sekarang</a>
              </div>

              <div class="product-card">
                <img src="./src/assets/Photos/sayur.jpg" />
                <h3>Sayuran</h3>
                <p>Menjual Aneka Macam Sayur dengan kualitas terbaik</p>
                <a href="#/jual-sayur" class="btn-buy">Beli Sekarang</a>
              </div>

            </section>
          </div>
        </div>

        <aside class="sidebar">
  <div class="sidebar-card">
    <h3>Dunax Farm</h3>

    <!-- LOGO -->
    <img 
      src="./src/assets/icon/Logooooo.png" 
      alt="Logo Dunax Farm" 
      class="sidebar-logo" 
    />

    <p class="sidebar-desc">
      Menjual aneka macam hasil ternak dan kebun dengan kualitas terbaik dan murah meriah.
    </p>

            <table class="info-table">
              <tr><th>Email</th><td>-</td></tr>
              <tr><th>Kontak</th><td>-</td></tr>
              <tr><th>Lokasi</th><td>Wonogiri, Jawa Tengah</td></tr>
            </table>
          </div>
        </aside>
      </section>
    `
  },

  afterRender() {
    const slides = document.querySelectorAll('.hero-slide')
    const nextBtn = document.querySelector('.hero-btn.next')
    const prevBtn = document.querySelector('.hero-btn.prev')

    let current = 0
    let timer

    const showSlide = (index) => {
      slides.forEach((s) => s.classList.remove('active'))
      slides[index].classList.add('active')
    }

    const nextSlide = () => {
      current = (current + 1) % slides.length
      showSlide(current)
    }

    const prevSlide = () => {
      current = (current - 1 + slides.length) % slides.length
      showSlide(current)
    }

    const startAuto = () => {
      timer = setInterval(nextSlide, 3000)
    }

    nextBtn.onclick = () => {
      nextSlide()
      clearInterval(timer)
      startAuto()
    }

    prevBtn.onclick = () => {
      prevSlide()
      clearInterval(timer)
      startAuto()
    }

    startAuto()

    const searchInput = document.querySelector('#searchInput')
    const cards = document.querySelectorAll('.product-card')

    searchInput.addEventListener('input', () => {
      const keyword = searchInput.value.toLowerCase()
      cards.forEach((card) => {
        const title = card.querySelector('h3').innerText.toLowerCase()
        card.style.display = title.includes(keyword) ? 'block' : 'none'
      })
    })
  },
}

export default HomePage
