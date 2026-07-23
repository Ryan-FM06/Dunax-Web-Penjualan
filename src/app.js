import Router from './routes/router.js'

const App = {
  async renderPage() {
    await Router()
  },
}

export default App