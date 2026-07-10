import DaftarAntrianPresenter from './daftar-antrian-presenter.js'
import AntrianConfig from '../../data/antrian-config.js'

const AntrianPage = {
  async render() {
    return `
      <section class="antrian-page">

        <div class="antrian-title-card">
          <h1 class="page-title">Daftar Antrian Pesanan</h1>
          <div class="title-line"></div>
        </div>

        <div class="antrian-wrapper">
          <div class="antrian-cards">
            ${AntrianConfig.map((item) =>
              this._card(item.label, item.unit, item.key)
            ).join('')}
          </div>
        </div>

        <div class="antrian-info-card">
          <p>Informasi antrian digunakan sebagai pertimbangan sebelum pemesanan.</p>
          <p>
            Detail hanya bisa dilihat pemesan yang
            <span class="badge-success">sudah DP</span>.
          </p>
          <a href="#/riwayat" class="info-link">Lihat riwayat pesanan</a>
        </div>

        <div id="antrian-table-container"></div>
      </section>
    `
  },

  async afterRender() {
    await DaftarAntrianPresenter.init({
      container: document.querySelector('#antrian-table-container'),
      config: AntrianConfig,
    })
  },

  _card(title, unit, id) {
    return `
      <div class="antrian-card">
        <div class="antrian-card-header">
          Antrian ${title}<br><span>[ ${unit} ]</span>
        </div>
        <div class="antrian-card-value" id="${id}">0</div>
      </div>
    `
  },
}

export default AntrianPage