import routes from './route.js'
import AppBar from '../components/appbar.js'
import { getAuth } from '../utils/authStorage.js'

const matchRoute = (path) => {
  const pathSegments = path.split('/').filter(Boolean)

  for (const routePath in routes) {
    const routeSegments = routePath.split('/').filter(Boolean)
    if (routeSegments.length !== pathSegments.length) continue

    const params = {}
    let matched = true

    for (let i = 0; i < routeSegments.length; i++) {
      if (routeSegments[i].startsWith(':')) {
        params[routeSegments[i].slice(1)] = pathSegments[i]
      } else if (routeSegments[i] !== pathSegments[i]) {
        matched = false
        break
      }
    }

    if (matched) return { route: routes[routePath], params }
  }

  return null
}

const Router = async () => {
  const content = document.querySelector('#mainContent')
  const header = document.querySelector('#appBar')

  const rawHash = window.location.hash.slice(1) || '/'
  const path = rawHash.split('?')[0].toLowerCase()

  const matched = matchRoute(path)
  const { isLogin } = getAuth()

  if (!matched) {
    header.innerHTML = AppBar.render()
    content.innerHTML = '<h2>404 Page Not Found</h2>'
    return
  }

  const { route, params } = matched

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
  content.innerHTML = await page.render(params)
  page.afterRender?.(params)
  AppBar.afterRender?.()
}

export default Router