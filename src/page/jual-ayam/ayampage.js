import AyamPagePresenter from './ayampage-presenter.js'
import AyamData from '../../data/Produk-ayam.js'
import FloatingCart from '../../components/FloatingChart.js'

const AyamPage = {
  async render() {
    return `
      ${FloatingCart.render()}

      <div class="page-wrapper">
        <section class="detail-container">

          <div class="product-banner">
            <img src="src/assets/Photos/yam.jpg" class="banner-img" />
            <div class="banner-text">
              <h2>${AyamData.nama}</h2>
              <p>Tersedia ${AyamData.stok}</p>
            </div>
          </div>

          <div class="harga-section">
            <h3>Daftar Harga</h3>

            <div class="produk-grid">
              ${AyamData.tersedia
                .map((item) => {
                  const isTelur = item.nama.toLowerCase().includes('telur')
                  const satuan = isTelur ? 'Butir' : 'Ekor'

                  return `
                    <div class="produk-card">
                      <div class="produk-info">
                        <h4>${item.nama}</h4>
                        <p class="harga">Rp ${item.harga.toLocaleString(
                          'id-ID'
                        )}</p>
                        <span class="satuan">${satuan}</span>
                      </div>

                      <div class="counter-box">
                        <button class="minus-btn" data-nama="${item.nama}">
                          −
                        </button>

                        <input
                          class="jumlah-input"
                          data-nama="${item.nama}"
                          type="number"
                          value="0"
                          min="0"
                        />

                        <button class="plus-btn" data-nama="${item.nama}">
                          +
                        </button>

                        <button
                          class="cart-row-btn"
                          data-nama="${item.nama}"
                          title="Tambahkan ke keranjang"
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

  async afterRender() {
    FloatingCart.afterRender()
    new AyamPagePresenter(AyamData).init()
  },
}

export default AyamPage