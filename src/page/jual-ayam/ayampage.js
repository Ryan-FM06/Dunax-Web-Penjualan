import AyamPagePresenter from './ayampage-presenter.js'
import AyamData from '../../Data/Produk-ayam.js'

const AyamPage = {
  async render() {
    return `
      <div class="page-wrapper">
        <section class="detail-container">

          <!-- BANNER -->
          <div class="product-banner">
            <img src="src/assets/Photos/yam.jpg" class="banner-img" />
            <div class="banner-text">
              <h2>${AyamData.nama}</h2>
              <p>Tersedia ${AyamData.stok}</p>
            </div>
          </div>

          <!-- TABEL HARGA -->
          <div class="harga-section">
            <h3>Daftar Harga</h3>

            <div class="table-wrapper">
              <table class="harga-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  ${AyamData.tersedia
                    .map((item) => {
                      const isTelur = item.nama.toLowerCase().includes('telur')
                      const satuan = isTelur ? 'Butir' : 'Ekor'

                      return `
                      <tr>
                        <td>${item.nama}</td>
                        <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                        <td>${satuan}</td>
                      </tr>
                    `
                    })
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- TERSEDIA -->
          <div class="form-group">
            <label>Tersedia</label>

            <div class="tersedia-list">
              ${AyamData.tersedia
                .map((item) => {
                  const isTelur = item.nama.toLowerCase().includes('telur')
                  const satuan = isTelur ? 'Butir' : 'Ekor'
                  const step = isTelur ? 1 : 0.5

                  return `
                  <div class="counter-row kecil">
                    <span class="produk-nama">${item.nama}</span>

                    <div class="counter-box">
                      <button class="minus-btn" data-nama="${item.nama}">-</button>

                      <input
                        class="jumlah-input"
                        data-nama="${item.nama}"
                        type="number"
                        value="0"
                        min="0"
                        step="${step}"
                      />

                      <button class="plus-btn" data-nama="${item.nama}">+</button>
                      <span class="satuan">${satuan}</span>
                    </div>
                  </div>
                `
                })
                .join('')}
            </div>
          </div>

          <!-- RINGKASAN -->
          <div class="ringkasan-row">
            <strong>Pesanan</strong>

            <div class="table-wrapper">
              <table class="pesanan-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Jumlah</th>
                    <th>Satuan</th>
                    <th>Harga</th>
                  </tr>
                </thead>

                <tbody id="ringkasanTable">
                  <tr class="empty-row">
                    <td colspan="4">Belum ada pesanan</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr class="total-row-table">
                    <td colspan="3">Total</td>
                    <td id="totalHarga">Rp 0</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div class="button-center">
            <button id="beliSekarang" class="btn-dunax" disabled>
              Lanjut Pembayaran
            </button>
          </div>

        </section>
      </div>
    `
  },

  async afterRender() {
    new AyamPagePresenter(AyamData).init()
  },
}

export default AyamPage
