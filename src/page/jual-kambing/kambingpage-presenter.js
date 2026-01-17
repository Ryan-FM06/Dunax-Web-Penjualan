class KambingPagePresenter {
  constructor(data) {
    this.data = data
    this.state = {}
  }

  init() {
    this._initState()
    this._bindCounter()
    this._bindPaymentButton()
    this._renderRingkasan() // ⬅️ render awal
  }

  _initState() {
    this.data.tersedia.forEach((item) => {
      this.state[item.nama] = 0
    })
  }

  _bindCounter() {
    document.querySelectorAll('.plus-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._updateJumlah(btn.dataset.nama, 1)
      })
    })

    document.querySelectorAll('.minus-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._updateJumlah(btn.dataset.nama, -1)
      })
    })
  }

  _bindPaymentButton() {
    const btn = document.getElementById('beliSekarang')

    btn.addEventListener('click', () => {
      const pesanan = this._getPesanan()

      if (pesanan.length === 0) {
        alert('Silakan pilih produk terlebih dahulu')
        return
      }

      let total = 0
      const produk = {}

      pesanan.forEach((item) => {
        total += item.subtotal
        produk[item.nama] = {
          jumlah: item.jumlah,
          satuan: item.satuan,
          harga: item.hargaSatuan,
        }
      })

      localStorage.setItem('checkoutData', JSON.stringify({ produk, total }))

      window.location.hash = '#/payment'
    })
  }

  _updateJumlah(nama, delta) {
    this.state[nama] = Math.max(0, this.state[nama] + delta)

    document.querySelector(`.jumlah-input[data-nama="${nama}"]`).value = this.state[nama]

    this._renderRingkasan()
  }

  _getPesanan() {
    return Object.entries(this.state)
      .filter(([_, jumlah]) => jumlah > 0)
      .map(([nama, jumlah]) => {
        const produk = this.data.tersedia.find((p) => p.nama === nama)
        return {
          nama,
          jumlah,
          satuan: 'Ekor',
          hargaSatuan: produk.harga,
          subtotal: produk.harga * jumlah,
        }
      })
  }

  _renderRingkasan() {
    const tbody = document.getElementById('ringkasanTable')
    const totalEl = document.getElementById('totalHarga')
    const pesanan = this._getPesanan()

    tbody.innerHTML = ''
    let total = 0

    if (pesanan.length === 0) {
      tbody.innerHTML = `
        <tr class="empty-row">
          <td colspan="4" style="text-align:center; opacity:0.6;">
            Belum ada pesanan
          </td>
        </tr>
      `
      totalEl.textContent = 'Rp 0'
      return
    }

    pesanan.forEach((item) => {
      total += item.subtotal
      tbody.innerHTML += `
        <tr>
          <td>${item.nama}</td>
          <td>${item.jumlah}</td>
          <td>${item.satuan}</td>
          <td>Rp ${item.subtotal.toLocaleString()}</td>
        </tr>
      `
    })

    totalEl.textContent = `Rp ${total.toLocaleString()}`
  }
}

export default KambingPagePresenter
