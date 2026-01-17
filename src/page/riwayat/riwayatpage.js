import AppBar from '../../components/appbar.js'
import RiwayatPagePresenter from './riwayatpage-presenter.js'

const RiwayatPage = {
  async render() {
    return `
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
    `
  },

  async afterRender() {
    new RiwayatPagePresenter().init()
  },
}

export default RiwayatPage
