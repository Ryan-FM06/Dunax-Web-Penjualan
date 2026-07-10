class KambingPagePresenter {
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
    this._bindCartButton()
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

    document.querySelector(
      `.jumlah-input[data-nama="${nama}"]`
    ).value = this.state[nama]

    this._render()
  }

  /* ================= CART ================= */
  _bindCartButton() {
    document.querySelectorAll('.cart-row-btn').forEach((btn) => {
      btn.onclick = () => {
        const nama = btn.dataset.nama
        const jumlah = this.state[nama]

        if (jumlah <= 0) {
          alert('Jumlah masih 0')
          return
        }

        const produk = this.data.tersedia.find((p) => p.nama === nama)
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')

        const existing = cart.find((item) => item.nama === nama)

        if (existing) {
          existing.jumlah += jumlah
        } else {
          cart.push({
            nama,
            jumlah,
            satuan: 'Ekor',
            harga: produk.harga,
          })
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('storage'))

        // reset
        this.state[nama] = 0
        document.querySelector(
          `.jumlah-input[data-nama="${nama}"]`
        ).value = 0

        this._render()

        alert(`${nama} masuk keranjang 🛒`)
      }
    })
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

      const total = pesanan.reduce((a, b) => a + b.subtotal, 0)

      localStorage.setItem(
        'checkoutData',
        JSON.stringify({ produk: pesanan, total })
      )

      window.location.hash = '#/payment'
    }
  }
}

export default KambingPagePresenter