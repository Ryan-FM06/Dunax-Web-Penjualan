class PaymentPresenter {
  init() {
    const data = JSON.parse(localStorage.getItem('checkoutData'))

    if (!data || !data.produk) {
      alert('Data pesanan kosong')
      window.location.hash = '#/'
      return
    }

    const totalEl = document.getElementById('paymentTotal')
    const bayarBtn = document.getElementById('bayarSekarang')

    totalEl.textContent = `Rp ${data.total.toLocaleString('id-ID')}`

    bayarBtn.onclick = () => {
      const nama = document.getElementById('nama').value.trim()
      const alamat = document.getElementById('alamat').value.trim()
      const telepon = document.getElementById('telepon').value.trim()
      const metode = document.querySelector('input[name="pay"]:checked')

      if (!nama || !alamat || !telepon) {
        alert('Lengkapi data diri')
        return
      }

      if (!metode) {
        alert('Pilih metode pembayaran')
        return
      }

      /* ================= DETAIL ITEM (FIX AMAN) ================= */
      const detailItem = []

      if (Array.isArray(data.produk)) {
        // ✅ FORMAT BARU (ARRAY)
        data.produk.forEach((p) => {
          detailItem.push(`${p.nama} ${p.jumlah} ${p.satuan}`)
        })
      } else {
        // ✅ FORMAT LAMA (OBJECT) — BIAR GA ERROR
        Object.entries(data.produk).forEach(([nama, p]) => {
          detailItem.push(`${nama} ${p.jumlah} ${p.satuan}`)
        })
      }

      /* ================= SIMPAN RIWAYAT ================= */
      const riwayat = JSON.parse(localStorage.getItem('riwayatPembelian')) || []

      riwayat.push({
        tanggal: new Date().toLocaleString('id-ID'),
        nama,
        alamat,
        telepon,
        metode: metode.value,
        namaItem: 'Produk Ayam',
        jumlah: detailItem.join(', '),
        total: data.total,
      })

      localStorage.setItem('riwayatPembelian', JSON.stringify(riwayat))

      /* ================= CLEAN & REDIRECT ================= */
      localStorage.removeItem('checkoutData')

      alert('Pembayaran berhasil!')
      window.location.hash = '#/riwayat'
    }
  }
}

export default PaymentPresenter
