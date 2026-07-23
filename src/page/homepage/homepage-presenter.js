import { BASE_URL } from '../../config/api.js'

class HomePagePresenter {
  constructor({ view }) {
    this.view = view
  }

  async init() {
    try {
      const res = await fetch(`${BASE_URL}/commodities`)
      const result = await res.json()
      const commodities = (result.data || result).filter((c) => c.aktif)

      this.view.renderHero(commodities)
      this.view.renderProducts(commodities)
    } catch (err) {
      console.error('Gagal ambil data komoditas:', err)
    }
  }
}

export default HomePagePresenter