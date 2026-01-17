const AppBar = {
  render({ simple = false } = {}) {
    if (simple) {
      return `
        <nav class="navbar simple">
          <div class="navbar-inner center">
            <div class="logo">Dunax Farm</div>
          </div>
        </nav>
      `
    }

    const isLogin = localStorage.getItem('isLogin') === 'true'

    let currentUser = null
    const userStorage = localStorage.getItem('currentUser')
    if (userStorage) {
      try {
        currentUser = JSON.parse(userStorage)
      } catch {
        localStorage.removeItem('currentUser')
      }
    }

    const avatarLetter =
      isLogin && currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'

    return `
      <nav class="navbar">
        <div class="navbar-inner">
          <div class="logo">Dunax Farm</div>

          <!-- DESKTOP MENU -->
          <ul class="nav-menu">
            <li><a href="#/home">Dashboard</a></li>

            <li class="nav-dropdown">
              <span class="dropdown-title" id="productDropdownBtn">
                Beli Produk <span class="arrow">▾</span>
              </span>

              <div class="dropdown-panel" id="productDropdownPanel">
                <div class="dropdown-group">
                  <div class="dropdown-label">Buat Pesanan Baru</div>
                  <a href="#/jual-ayam">Tambah pesanan Ayam</a>
                  <a href="#/jual-sapi">Tambah pesanan Sapi</a>
                  <a href="#/jual-kambing">Tambah pesanan Kambing</a>
                  <a href="#/jual-sayur">Tambah pesanan Sayur</a>
                  <a href="#/jual-ikan">Tambah pesanan Ikan</a>
                </div>
              </div>
            </li>

            <li><a href="#/riwayat">Riwayat</a></li>

            <li class="nav-account">
              ${
                isLogin
                  ? `
                  <div class="avatar-wrapper">
                    <div class="avatar" id="avatarBtn">${avatarLetter}</div>
                    <div class="avatar-dropdown" id="avatarDropdown">
                      <div class="user-info">${currentUser?.email ?? '-'}</div>
                      <button id="logoutBtn">Keluar</button>
                    </div>
                  </div>
                `
                  : `<a href="#/login">Login</a>`
              }
            </li>
          </ul>

          <!-- HAMBURGER -->
          <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <!-- MOBILE OVERLAY + SIDEBAR -->
      <div class="sidebar-overlay" id="sidebarOverlay">
        <aside class="mobile-sidebar" id="mobileSidebar">
          ${
            isLogin
              ? `
              <div class="mobile-profile">
                <div class="mobile-avatar">${avatarLetter}</div>
                <div class="mobile-email">${currentUser?.email ?? '-'}</div>
              </div>

              <nav class="mobile-menu">
                <a href="#/home">Dashboard</a>

                <div class="mobile-nav-dropdown">
                  <div class="mobile-dropdown-title" id="mobileProductBtn">
                    Beli Produk <span class="arrow">▾</span>
                  </div>

                  <div class="mobile-dropdown-panel" id="mobileProductPanel">
                    <div class="dropdown-group">
                      <div class="dropdown-label">Buat Pesanan Baru</div>
                      <a href="#/jual-ayam">Tambah pesanan Ayam</a>
                      <a href="#/jual-sapi">Tambah pesanan Sapi</a>
                      <a href="#/jual-kambing">Tambah pesanan Kambing</a>
                      <a href="#/jual-sayur">Tambah pesanan Sayur</a>
                      <a href="#/jual-ikan">Tambah pesanan Ikan</a>
                    </div>
                  </div>
                </div>

                <a href="#/riwayat">Riwayat</a>
              </nav>

              <button class="mobile-logout" id="mobileLogout">Keluar</button>
            `
              : `
              <nav class="mobile-menu">
                <a href="#/login">Login</a>
              </nav>
            `
          }
        </aside>
      </div>
    `
  },

  afterRender() {
    const hamburger = document.querySelector('#hamburger')
    const sidebar = document.querySelector('#mobileSidebar')
    const overlay = document.querySelector('#sidebarOverlay')

    const avatarBtn = document.querySelector('#avatarBtn')
    const avatarDropdown = document.querySelector('#avatarDropdown')

    const productBtn = document.querySelector('#productDropdownBtn')
    const productPanel = document.querySelector('#productDropdownPanel')

    const mobileProductBtn = document.querySelector('#mobileProductBtn')
    const mobileProductPanel = document.querySelector('#mobileProductPanel')

    const logoutBtn = document.querySelector('#logoutBtn')
    const mobileLogout = document.querySelector('#mobileLogout')

    /* HAMBURGER */
    hamburger?.addEventListener('click', (e) => {
      e.stopPropagation()
      const isOpen = sidebar.classList.contains('show')
      sidebar.classList.toggle('show', !isOpen)
      overlay.classList.toggle('show', !isOpen)
      document.body.classList.toggle('lock-scroll', !isOpen)
    })

    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('show')
      overlay.classList.remove('show')
      document.body.classList.remove('lock-scroll')
    })

    /* AVATAR */
    avatarBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      avatarDropdown.classList.toggle('show')
    })

    /* DESKTOP DROPDOWN */
    productBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      productPanel.classList.toggle('show')
    })

    /* MOBILE DROPDOWN */
    mobileProductBtn?.addEventListener('click', (e) => {
      e.stopPropagation()
      mobileProductPanel.classList.toggle('show')
    })

    /* LOGOUT */
    const logout = () => {
      localStorage.clear()
      window.location.hash = '#/login'
      window.location.reload()
    }

    logoutBtn?.addEventListener('click', logout)
    mobileLogout?.addEventListener('click', logout)
  },
}

export default AppBar
