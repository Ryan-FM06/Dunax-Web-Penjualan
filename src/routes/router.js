import routes from './route.js'
import AppBar from '../components/appbar.js'
import { getAuth } from '../utils/authStorage.js'

const Router = async () => {
  const content = document.querySelector('#mainContent')
  const header = document.querySelector('#appBar')

  const rawHash = window.location.hash.slice(1) || '/'
  const path = rawHash.split('?')[0].toLowerCase()
  const route = routes[path]

  const { isLogin } = getAuth()

  if (!route) {
    header.innerHTML = AppBar.render()
    content.innerHTML = '<h2>404 Page Not Found</h2>'
    return
  }

  if (!isLogin && route.public !== true) {
    window.location.hash = '#/login'
    return
  }

  const simpleHeaderPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password']

  if (simpleHeaderPaths.includes(path)) {
    header.innerHTML = AppBar.render({ simple: true })
  } else {
    header.innerHTML = AppBar.render()
  }

  const page = route.page
  content.innerHTML = await page.render()
  page.afterRender?.()
  AppBar.afterRender?.()
}

export default Router