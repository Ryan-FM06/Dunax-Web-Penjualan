import App from './app.js'

window.addEventListener('hashchange', () => {
  App.renderPage()
})

window.addEventListener('load', () => {
  App.renderPage()
})