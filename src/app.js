import routes from './routes/route.js'
import AppBar from './components/appbar.js'

const App = {
  async renderPage() {

    const rawUrl = window.location.hash.slice(1) || '/'
    const url = rawUrl.split('?')[0].toLowerCase()

    const isLogin = localStorage.getItem('isLogin') === 'true'

    const authRoutes = [
      '/login',
      '/register',
      '/verify-email'
    ]

    const isTryingToAuth = authRoutes.includes(url)

    const route = routes[url] || routes['/']
    const page = route.page

    if (!isLogin && route.public !== true) {
      window.location.hash = '#/login'
      return
    }

    if (isLogin && isTryingToAuth) {
      window.location.hash = '#/home'
      return
    }

    const appBar = document.querySelector('#appBar')
    const mainContent = document.querySelector('#mainContent')

    appBar.innerHTML = AppBar.render({
      simple: isTryingToAuth
    })

    AppBar.afterRender?.()

    mainContent.innerHTML = await page.render()
    page.afterRender?.()
  },
}

window.addEventListener('hashchange', () => App.renderPage())
window.addEventListener('load', () => App.renderPage())

export default App