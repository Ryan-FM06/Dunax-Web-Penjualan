import SayurPagePresenter from './sayurpage-presenter.js'
import SayurData from '../../data/Produk-sayur.js'

const SayurPage = {
  async render() {
    return `
      <div class="page-wrapper">
        <section class="detail-container">

          <!-- BANNER -->
          <div class="product-banner">
            <img src="src/assets/Photos/YUR.jpg" class="banner-img" />
            <div class="banner-text">
              <h2>${SayurData.nama}</h2>
              <p>Tersedia ${SayurData.stok}</p>
            </div>
          </div>

          <!-- DAFTAR HARGA -->
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
                  ${SayurData.tersedia
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.nama}</td>
                      <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                      <td>Ikat</td>
                    </tr>
                  `,
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- TERSEDIA -->
          <div class="form-group">
            <label>Tersedia</label>

            <div class="tersedia-list">
              ${SayurData.tersedia
                .map(
                  (item) => `
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
                    />

                    <button class="plus-btn" data-nama="${item.nama}">+</button>

                    <span class="satuan">Ikat</span>
                  </div>
                </div>
              `,
                )
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
                    <td colspan="4" style="text-align:center; opacity:0.6;">
                      Belum ada pesanan
                    </td>
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

          <!-- BUTTON -->
          <div class="button-center">
            <button id="beliSekarang" class="btn-dunax">
              Lanjut Pembayaran
            </button>
          </div>

        </section>
      </div>
    `
  },

  async afterRender() {
    const presenter = new SayurPagePresenter(SayurData)
    presenter.init()
  },
}

export default SayurPage
