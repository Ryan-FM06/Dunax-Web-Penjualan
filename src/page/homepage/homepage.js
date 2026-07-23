import FloatingCart from '../../components/FloatingChart.js'
import MapComponent from '../../components/map.js'
import HomePagePresenter from './homepage-presenter.js'

const HomePage = {
  render() {
    return `
      ${FloatingCart.render()}

      <!-- HERO -->
      <section class="hero" id="heroSection">
        <div class="hero-slide active">
          <div class="hero-content"><p>Memuat...</p></div>
        </div>
      </section>

      <!-- MAIN LAYOUT -->
      <section class="home-layout">

        <div class="main-content">

          <section class="welcome-section">
            <div class="welcome-card">
              <h2>Selamat Datang di Website DUNAX FARM (DNX).</h2>
              <p>
                Dunax Farm menghadirkan platform pemesanan berbasis web yang dirancang untuk mempermudah
                pelanggan dalam memperoleh produk peternakan secara cepat, praktis, dan terpercaya.
                Sistem ini difokuskan pada kemudahan akses, kecepatan proses, serta kenyamanan pengguna.
              </p>
              <p>Melalui portal ini, Anda dapat melakukan beberapa layanan utama berikut:</p>
              <ul class="welcome-list">
                <li class="item telur"> Pemesanan Telur Fertil Kuntara 4 berkualitas unggul</li>
                <li class="item doc"> Pemesanan DOC (Day Old Chick) Kuntara 4</li>
                <li class="item pantau"> Pantauan ketersediaan produk real-time</li>
                <li class="item info"> Akses informasi pemesanan & antrian</li>
              </ul>
              <p class="welcome-footer">
                Platform ini akan terus dikembangkan secara bertahap untuk mendukung kebutuhan peternakan modern
                serta meningkatkan kualitas layanan bagi seluruh mitra dan pelanggan.
              </p>
              <div class="welcome-action">
                <a href="#/antrian" class="btn-primary">Lihat Daftar Antrian</a>
              </div>
            </div>
          </section>

          <div class="content-card">
            <section class="search-section">
              <input type="text" id="searchInput" placeholder="Cari produk ternak..." />
            </section>

            <section class="product-grid" id="productGrid">
              <p>Memuat produk...</p>
            </section>
          </div>
        </div>

        <aside class="sidebar">
          <div class="sidebar-card">
            <h3>DUNAX FARM</h3>
            <p class="sidebar-tagline-card">
              Integrasi peternakan secara alami dan non kimia
            </p>
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
            ${MapComponent.render()}
          </div>
        </aside>

      </section>
    `
  },

  renderHero(commodities) {
    const heroSection = document.getElementById('heroSection')

    heroSection.innerHTML =
      commodities
        .map(
          (item, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}">
          <img src="${item.foto}" class="hero-image" />
          <div class="hero-content">
            <h1>${item.nama}</h1>
            <p>Langsung dari peternak</p>
            <a href="#/jual/${item.id}" class="btn-primary">Beli ${item.nama}</a>
          </div>
        </div>
      `
        )
        .join('') +
      `<button class="hero-btn prev">‹</button><button class="hero-btn next">›</button>`

    this.setupHeroSlider()
  },

  renderProducts(commodities) {
    const grid = document.getElementById('productGrid')

    grid.innerHTML = commodities
      .map(
        (item) => `
      <div class="product-card">
        <img src="${item.foto}" />
        <h3>${item.nama}</h3>
        <p>${item.keterangan}</p>
        <a href="#/jual/${item.id}" class="btn-buy">Beli Sekarang</a>
      </div>
    `
      )
      .join('')

    this.setupSearch()
  },

  setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide')
    const nextBtn = document.querySelector('.hero-btn.next')
    const prevBtn = document.querySelector('.hero-btn.prev')
    if (!slides.length || !nextBtn) return

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
  },

  setupSearch() {
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

  afterRender() {
    FloatingCart.afterRender()
    MapComponent.afterRender()

    const presenter = new HomePagePresenter({ view: this })
    presenter.init()
  },
}

export default HomePage