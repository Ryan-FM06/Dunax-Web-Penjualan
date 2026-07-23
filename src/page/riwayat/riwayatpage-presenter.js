import { AUTH_URL } from '../../config/api.js'
import { getAuth } from '../../utils/authStorage.js'

class RiwayatPagePresenter {
  async init() {
    const table = document.getElementById('riwayatTable')
    const totalEl = document.getElementById('grandTotal')

    const { isLogin, currentUser } = getAuth()

    if (!isLogin || !currentUser) {
      table.innerHTML = `<tr><td colspan="7">Silakan login untuk melihat riwayat.</td></tr>`
      totalEl.textContent = 'Rp 0'
      return
    }

    table.innerHTML = `<tr><td colspan="7">Memuat data...</td></tr>`

    let pesanan = []

    try {
      const res = await fetch(`${AUTH_URL}/orders?user_id=${currentUser.id}`)
      const result = await res.json()

      if (result.status === 'success') {
        pesanan = result.data
      }
    } catch (err) {
      console.error('❌ Gagal ambil riwayat:', err)
      table.innerHTML = `<tr><td colspan="7">Gagal memuat data, coba refresh.</td></tr>`
      totalEl.textContent = 'Rp 0'
      return
    }

    if (!pesanan.length) {
      table.innerHTML = `<tr><td colspan="7">Belum ada riwayat</td></tr>`
      totalEl.textContent = 'Rp 0'
      return
    }

    let grand = 0
    table.innerHTML = ''

    pesanan.forEach((o) => {
      grand += o.total
      const tanggal = new Date(o.created_at).toLocaleString('id-ID')

      table.innerHTML += `
        <tr>
          <td>${tanggal}</td>
          <td>${o.nama}</td>
          <td>${o.alamat}</td>
          <td>${o.telepon}</td>
          <td>
            ${o.produk.map((p) => `${p.nama} ${p.jumlah} ${p.satuan}`).join('<br>')}
          </td>
          <td>${o.metode}</td>
          <td>Rp ${o.total.toLocaleString('id-ID')}</td>
        </tr>
      `
    })

    totalEl.textContent = `Rp ${grand.toLocaleString('id-ID')}`
  }
}

export default RiwayatPagePresenter