import AppBar from '../../components/appbar.js'
import RiwayatPagePresenter from './riwayatpage-presenter.js'
import FloatingCart from '../../components/FloatingChart.js'

const RiwayatPage = {
  async render() {
    return `
      ${AppBar.render()}

      <div class="page-wrapper">
        <section class="detail-container">

          <div class="riwayat-header">
            <h2>Riwayat Pembelian</h2>
            <button id="downloadPdf" class="btn-download">
              Download PDF
            </button>
          </div>

          <div class="table-wrapper">
            <table class="pesanan-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama</th>
                  <th>Alamat</th>
                  <th>No. Telepon</th>
                  <th>Pesanan</th>
                  <th>Metode</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody id="riwayatTable"></tbody>

              <tfoot>
                <tr class="grand-total-row">
                  <td class="total-label" colspan="6">
                    TOTAL KESELURUHAN
                  </td>
                  <td id="grandTotal">Rp 0</td>
                </tr>
              </tfoot>
            </table>
          </div>

        </section>
      </div>

      ${FloatingCart.render()}
    `
  },

  async afterRender() {
    AppBar.afterRender();
    await new RiwayatPagePresenter().init()
    FloatingCart.afterRender()
  },
}

export default RiwayatPage