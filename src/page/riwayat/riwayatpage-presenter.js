class RiwayatPagePresenter {
  init() {
    this._renderRiwayat()
    this._initPdfButton()
  }

  _renderRiwayat() {
    const table = document.getElementById('riwayatTable')
    const totalEl = document.getElementById('grandTotal')

    const riwayat = JSON.parse(localStorage.getItem('riwayatPembelian')) || []

    if (riwayat.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;">
            Belum ada riwayat pembelian
          </td>
        </tr>
      `
      totalEl.textContent = 'Rp 0'
      return
    }

    let grandTotal = 0
    table.innerHTML = ''

    riwayat.forEach((item) => {
      grandTotal += item.total

      table.innerHTML += `
        <tr>
          <td>${item.tanggal}</td>
          <td>${item.nama}</td>
          <td>${item.alamat}</td>
          <td>${item.telepon}</td>
          <td>${item.jumlah}</td>
          <td>${item.metode}</td>
          <td>Rp ${item.total.toLocaleString('id-ID')}</td>
        </tr>
      `
    })

    totalEl.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`
  }

  _initPdfButton() {
    const btn = document.getElementById('downloadPdf')
    btn.addEventListener('click', () => this._downloadPdf())
  }

  _downloadPdf() {
    const riwayat = JSON.parse(localStorage.getItem('riwayatPembelian')) || []

    if (riwayat.length === 0) {
      alert('Tidak ada data untuk diunduh')
      return
    }

    // 🔥 AMBIL DARI GLOBAL
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()

    doc.text('Riwayat Pembelian', 14, 16)

    const rows = riwayat.map((item) => [
      item.tanggal,
      item.nama,
      item.alamat,
      item.telepon,
      item.jumlah,
      item.metode,
      `Rp ${item.total.toLocaleString('id-ID')}`,
    ])

    doc.autoTable({
      head: [['Tanggal', 'Nama', 'Alamat', 'Telepon', 'Pesanan', 'Metode', 'Total']],
      body: rows,
      startY: 22,
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [40, 40, 40],
      },
    })

    doc.save('riwayat-pembelian.pdf')
  }
}

export default RiwayatPagePresenter
