import JualPresenter, { getSatuan } from './jual-presenter.js'
import FloatingCart from '../../components/FloatingChart.js'

const JualPage = {
  async render() {
    return `
      ${FloatingCart.render()}
      <div id="jualRoot">
        <p>Memuat produk...</p>
      </div>
    `
  },

  renderCategory(category) {
    const root = document.getElementById('jualRoot')

    root.innerHTML = `
      <div class="page-wrapper">
        <section class="detail-container">

          <div class="product-banner">
            <img src="${category.foto}" class="banner-img" />
            <div class="banner-text">
              <h2>${category.nama}</h2>
              <p>${category.keterangan}</p>
            </div>
          </div>

          <div class="harga-section">
            <h3>Daftar Harga</h3>

            <div class="produk-grid">
              ${category.details
                .filter((item) => item.aktif)
                .map((item) => {
                  const satuan = getSatuan(category.id, item.nama)
                  const habis = item.stok === 0

                  return `
                    <div class="produk-card">
                      <div class="produk-info">
                        <h4>${item.nama}</h4>
                        <p class="harga">Rp ${item.harga.toLocaleString('id-ID')}</p>
                        <span class="satuan">${satuan}</span>
                        ${habis ? '<span class="stok-habis">Stok Habis</span>' : `<span class="stok">Stok: ${item.stok}</span>`}
                      </div>

                      <div class="counter-box">
                        <button class="minus-btn" data-id="${item.id}" ${habis ? 'disabled' : ''}>
                          −
                        </button>

                        <input
                          class="jumlah-input"
                          data-id="${item.id}"
                          type="number"
                          value="0"
                          min="0"
                          max="${item.stok}"
                          ${habis ? 'disabled' : ''}
                        />

                        <button class="plus-btn" data-id="${item.id}" ${habis ? 'disabled' : ''}>
                          +
                        </button>

                        <button
                          class="cart-row-btn"
                          data-id="${item.id}"
                          title="Tambahkan ke keranjang"
                          ${habis ? 'disabled' : ''}
                        >
                          <img 
                            src="./src/assets/Photos/cart-empty.png" 
                            style="width: 20px; height: 20px; object-fit: contain; vertical-align: middle;" 
                          />
                        </button>
                      </div>
                    </div>
                  `
                })
                .join('')}
            </div>
          </div>

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

  renderNotFound() {
    document.getElementById('jualRoot').innerHTML = '<h2>Kategori tidak ditemukan</h2>'
  },

  renderError() {
    document.getElementById('jualRoot').innerHTML = '<h2>Gagal memuat data, coba lagi</h2>'
  },

  async afterRender(params) {
    FloatingCart.afterRender()
    const presenter = new JualPresenter({ view: this, categoryId: params?.category })
    presenter.init()
  },
}

export default JualPage