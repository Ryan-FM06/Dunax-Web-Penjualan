import { BASE_URL } from '../config/api.js'
import { getAuth, clearAuth } from '../utils/authStorage.js'

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

    const { isLogin, currentUser } = getAuth()

    const getInitials = (name = '') =>
      name
        .trim()
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()

    const avatarLetter =
      isLogin && currentUser?.full_name
        ? getInitials(currentUser.full_name)
        : 'U'

    return `
      <nav class="navbar">
        <div class="navbar-inner">

          <div class="logo">DUNAX FARM</div>

          <ul class="nav-menu">

            <li><a href="#/home">Dashboard</a></li>

            <li class="nav-dropdown">

              <span class="dropdown-title" id="productDropdownBtn">
                Beli Produk <span class="arrow">▾</span>
              </span>

              <div class="dropdown-panel" id="productDropdownPanel">
                <div class="dropdown-group" id="productDropdownGroup">
                  <div class="dropdown-label">Buat Pesanan Baru</div>
                  <span class="dropdown-loading">Memuat...</span>
                </div>
              </div>

            </li>

            <li><a href="#/riwayat">Riwayat</a></li>

            <li class="nav-account">

              ${
                isLogin
                  ? `
                <div class="avatar-wrapper">

                  <div
                    class="avatar"
                    id="avatarBtn"
                    data-email="${currentUser?.email ?? ''}"
                  >
                    ${avatarLetter}
                  </div>

                  <div class="avatar-dropdown" id="avatarDropdown">

    <div class="user-header">

        <div class="user-avatar">
            ${avatarLetter}
        </div>

        <div class="user-detail">
            <div class="user-name">
                ${currentUser?.full_name}
            </div>

            <div class="user-email">
                ${currentUser?.email}
            </div>
        </div>

    </div>

    <div class="dropdown-menu">
        <button id="logoutBtn">
            Keluar
        </button>
    </div>

</div>
              `
                  : `<a href="#/login">Login</a>`
              }

            </li>

          </ul>

          <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </nav>

      <div class="sidebar-overlay" id="sidebarOverlay">

        <aside class="mobile-sidebar" id="mobileSidebar">

          ${
            isLogin
              ? `
            <div class="mobile-profile">
                <div class="mobile-avatar">
                    ${avatarLetter}
                </div>
                
                <div class="mobile-user">
                    <div class="mobile-name">
                        ${currentUser?.full_name}
                    </div>
                    
                    <div class="mobile-email">
                        ${currentUser?.email}
                    </div>
                </div>
              </div>

            <nav class="mobile-menu">

              <a href="#/home">Dashboard</a>

              <div class="mobile-nav-dropdown">

                <div
                  class="mobile-dropdown-title"
                  id="mobileProductBtn"
                >
                  Beli Produk
                  <span class="arrow">▾</span>
                </div>

                <div
                  class="mobile-dropdown-panel"
                  id="mobileProductPanel"
                >
                  <div class="dropdown-group" id="mobileProductDropdownGroup">
                    <div class="dropdown-label">Buat Pesanan Baru</div>
                    <span class="dropdown-loading">Memuat...</span>
                  </div>
                </div>

              </div>

              <a href="#/riwayat">Riwayat</a>

            </nav>

            <button
              class="mobile-logout"
              id="mobileLogout"
            >
              Keluar
            </button>
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

  async afterRender() {
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

    hamburger?.addEventListener('click', e => {
      e.stopPropagation()

      const open = sidebar.classList.contains('show')

      sidebar.classList.toggle('show', !open)
      overlay.classList.toggle('show', !open)

      document.body.classList.toggle('lock-scroll', !open)
    })

    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('show')
      overlay.classList.remove('show')
      document.body.classList.remove('lock-scroll')
    })

    avatarBtn?.addEventListener('click', e => {
      e.stopPropagation()
      avatarDropdown.classList.toggle('show')
    })

    productBtn?.addEventListener('click', e => {
      e.stopPropagation()
      productPanel.classList.toggle('show')
    })

    mobileProductBtn?.addEventListener('click', e => {
      e.stopPropagation()
      mobileProductPanel.classList.toggle('show')
    })

    const logout = () => {
      clearAuth()
      window.location.hash = '#/login'
      window.location.reload()
    }

    logoutBtn?.addEventListener('click', logout)
    mobileLogout?.addEventListener('click', logout)

    // klik di luar dropdown
    document.addEventListener('click', () => {
      avatarDropdown?.classList.remove('show')
      productPanel?.classList.remove('show')
    })

    this._loadCommodities()
  },

  async _loadCommodities() {
    const desktopGroup = document.getElementById('productDropdownGroup')
    const mobileGroup = document.getElementById('mobileProductDropdownGroup')

    try {
      const res = await fetch(`${BASE_URL}/commodities`)
      const result = await res.json()
      const commodities = (result.data || result).filter(c => c.aktif)

      const linksHtml = commodities
        .map(item => `<a href="#/jual/${item.id}">Tambah Pesanan ${item.nama}</a>`)
        .join('')

      const html = `<div class="dropdown-label">Buat Pesanan Baru</div>${linksHtml}`

      if (desktopGroup) desktopGroup.innerHTML = html
      if (mobileGroup) mobileGroup.innerHTML = html
    } catch (err) {
      console.error('Gagal ambil daftar komoditas:', err)
      const errorHtml = `<div class="dropdown-label">Buat Pesanan Baru</div><span class="dropdown-error">Gagal memuat</span>`

      if (desktopGroup) desktopGroup.innerHTML = errorHtml
      if (mobileGroup) mobileGroup.innerHTML = errorHtml
    }
  },
}

export default AppBar