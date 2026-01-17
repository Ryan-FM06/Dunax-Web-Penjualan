import routes from './routes/route.js'
import AppBar from './components/appbar.js'

const App = {
  async renderPage() {
    const url = window.location.hash.slice(1).toLowerCase() || '/'

    // 1. Cek status login dari localStorage
    const isLogin = localStorage.getItem('isLogin') === 'true'

    // 2. Tentukan rute autentikasi
    const authRoutes = ['/login', '/register']
    const isTryingToAuth = authRoutes.includes(url)

    // 3. PROTEKSI: Langsung pindah ke login tanpa notif jika belum login
    if (!isLogin && !isTryingToAuth) {
      window.location.hash = '#/login'
      return
    }

    // 4. Redirect jika sudah login tapi coba akses halaman login/register
    if (isLogin && isTryingToAuth) {
      window.location.hash = '#/home'
      return
    }

    // 5. Proses Render Normal
    const page = routes[url] || routes['/']
    const appBar = document.querySelector('#appBar')
    const mainContent = document.querySelector('#mainContent')

    // Update UI AppBar
    appBar.innerHTML = AppBar.render({ simple: isTryingToAuth })
    AppBar.afterRender()

    // Render Konten Halaman
    mainContent.innerHTML = await page.render()
    if (page.afterRender) {
      await page.afterRender()
    }
  },
}

window.addEventListener('hashchange', () => App.renderPage())
window.addEventListener('load', () => App.renderPage())

export default App
