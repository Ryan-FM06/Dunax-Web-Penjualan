class IkanPagePresenter {
  constructor(data) {
    this.data = data
    this.state = {}
  }

  init() {
    this.tableBody = document.getElementById('ringkasanTable')
    this.totalEl = document.getElementById('totalHarga')
    this.checkoutBtn = document.getElementById('beliSekarang')

    this._initState()
    this._bindCounter()
    this._render()
    this._bindPaymentButton()
  }

  /* ================= INIT ================= */
  _initState() {
    this.data.tersedia.forEach((item) => {
      this.state[item.nama] = 0
    })
  }

  /* ================= COUNTER ================= */
  _bindCounter() {
    document.querySelectorAll('.plus-btn').forEach((btn) => {
      btn.onclick = () => this._updateJumlah(btn.dataset.nama, 1)
    })

    document.querySelectorAll('.minus-btn').forEach((btn) => {
      btn.onclick = () => this._updateJumlah(btn.dataset.nama, -1)
    })

    document.querySelectorAll('.jumlah-input').forEach((input) => {
      input.onblur = () => {
        const nama = input.dataset.nama
        let value = Math.max(0, Math.floor(input.value || 0))
        this.state[nama] = value
        input.value = value
        this._render()
      }
    })
  }

  _updateJumlah(nama, delta) {
    this.state[nama] = Math.max(0, this.state[nama] + delta)

    document.querySelector(`.jumlah-input[data-nama="${nama}"]`).value = this.state[nama]

    this._render()
  }

  /* ================= DATA ================= */
  _getPesanan() {
    return Object.entries(this.state)
      .filter(([_, jumlah]) => jumlah > 0)
      .map(([nama, jumlah]) => {
        const produk = this.data.tersedia.find((p) => p.nama === nama)
        return {
          nama,
          jumlah,
          satuan: 'Ekor',
          harga: produk.harga,
          subtotal: produk.harga * jumlah,
        }
      })
  }

  /* ================= RENDER ================= */
  _render() {
    this.tableBody.innerHTML = ''
    let total = 0

    const pesanan = this._getPesanan()

    if (pesanan.length === 0) {
      this.tableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="4">Belum ada pesanan</td>
        </tr>
      `
      this.totalEl.textContent = 'Rp 0'
      this.checkoutBtn.disabled = true
      return
    }

    pesanan.forEach((item) => {
      total += item.subtotal

      this.tableBody.innerHTML += `
        <tr>
          <td>${item.nama}</td>
          <td>${item.jumlah}</td>
          <td>${item.satuan}</td>
          <td>Rp ${item.subtotal.toLocaleString('id-ID')}</td>
        </tr>
      `
    })

    this.totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`
    this.checkoutBtn.disabled = false
  }

  /* ================= CHECKOUT ================= */
  _bindPaymentButton() {
    this.checkoutBtn.onclick = () => {
      const pesanan = this._getPesanan()
      if (pesanan.length === 0) return

      const produk = pesanan.map((p) => ({
        nama: p.nama,
        jumlah: p.jumlah,
        satuan: p.satuan,
        harga: p.harga,
      }))

      const total = pesanan.reduce((a, b) => a + b.subtotal, 0)

      localStorage.setItem('checkoutData', JSON.stringify({ produk, total }))

      window.location.hash = '#/payment'
    }
  }
}

export default IkanPagePresenter
