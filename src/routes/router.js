import routes from './route.js'

const Router = {
  async renderPage(content) {
    const hash = window.location.hash.slice(1).toLowerCase() || '/'
    const page = routes[hash]

    if (!page) {
      content.innerHTML = '<h2>404</h2>'
      return
    }

    content.innerHTML = await page.render()
    await page.afterRender?.()
  },

  init({ content }) {
    window.addEventListener('hashchange', () => {
      this.renderPage(content)
    })

    window.addEventListener('load', () => {
      this.renderPage(content)
    })
  },
}

export default Router
