import { AUTH_URL } from '../../config/api.js'

const DaftarAntrianPresenter = {
  async init({ container, config }) {
    let pesanan = []

    try {
      const res = await fetch(`${AUTH_URL}/orders/antrian`)
      const result = await res.json()
      if (result.status === 'success') {
        pesanan = result.data
      }
    } catch (err) {
      console.error('❌ Gagal ambil antrian:', err)
    }

    const antrian = {}
    config.forEach((item) => {
      antrian[item.key] = 0
    })

    pesanan.forEach((order) => {
      order.produk.forEach((item) => {
        const key = item.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        if (antrian[key] !== undefined) {
          antrian[key] += item.jumlah
        }
      })
    })

    this._renderCard(antrian)

    if (pesanan.length > 0 && container) {
      this._renderTable(pesanan, container)
    }
  },

  _renderCard(data) {
    Object.entries(data).forEach(([key, value]) => {
      const el = document.getElementById(key)
      if (el) el.innerText = value.toLocaleString('id-ID')
    })
  },

  _renderTable(pesanan, container) {
    container.innerHTML = `
      <div class="antrian-table-card">
        <h3 class="antrian-table-title">
          Daftar Antrian Pembelian
        </h3>

        <div class="table-wrapper">
          <table class="antrian-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Telepon</th>
                <th>Barang</th>
                <th>Total</th>
                <th>ID Antrian</th>
                <th>Metode</th>
              </tr>
            </thead>
            <tbody>
              ${pesanan
                .map((order) => {
                  const namaSensor = order.nama ? order.nama.slice(0, 2) + '***' : 'User'
                  const teleponSensor = order.telepon
                    ? order.telepon.slice(0, 4) + '***'
                    : '-'
                  const tanggal = new Date(order.created_at).toLocaleString('id-ID')

                  return `
                    <tr>
                      <td>${tanggal}</td>
                      <td>${namaSensor}</td>
                      <td>${teleponSensor}</td>
                      <td>
                        ${order.produk.map((p) => `${p.nama} (${p.jumlah})`).join('<br>')}
                      </td>
                      <td class="price">Rp ***</td>
                      <td class="queue-id">${order.id}</td>
                      <td>
                        <span class="badge-method">${order.metode}</span>
                      </td>
                    </tr>
                  `
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  },
}

export default DaftarAntrianPresenter