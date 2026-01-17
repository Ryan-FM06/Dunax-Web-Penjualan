class SayurPagePresenter {
  constructor(data) {
    this.data = data
    this.state = {}
  }

  init() {
    this._initState()
    this._bindCounter()
    this._bindCheckout()
    this._renderRingkasan() // 🔥 WAJIB
  }

  _initState() {
    this.data.tersedia.forEach((item) => {
      this.state[item.nama] = 0
    })
  }

  _bindCounter() {
    document.querySelectorAll('.plus-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nama = btn.dataset.nama
        this.state[nama] += 1
        this._updateInput(nama)
      })
    })

    document.querySelectorAll('.minus-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nama = btn.dataset.nama
        if (this.state[nama] > 0) {
          this.state[nama] -= 1
          this._updateInput(nama)
        }
      })
    })

    document.querySelectorAll('.jumlah-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const nama = input.dataset.nama
        let value = parseInt(e.target.value) || 0
        if (value < 0) value = 0

        this.state[nama] = value
        this._renderRingkasan()
      })
    })
  }

  _updateInput(nama) {
    const input = document.querySelector(`.jumlah-input[data-nama="${nama}"]`)
    input.value = this.state[nama]
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
          satuan: 'Ikat',
          harga: produk.harga,
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

    // ✅ ROW DEFAULT
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

    // ✅ JIKA ADA PESANAN
    pesanan.forEach((item) => {
      total += item.subtotal
      tbody.innerHTML += `
        <tr>
          <td>${item.nama}</td>
          <td>${item.jumlah}</td>
          <td>${item.satuan}</td>
          <td>Rp ${item.subtotal.toLocaleString('id-ID')}</td>
        </tr>
      `
    })

    totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`
  }

  _bindCheckout() {
    document.getElementById('beliSekarang').addEventListener('click', () => {
      const pesanan = this._getPesanan()

      if (pesanan.length === 0) {
        alert('Pilih produk terlebih dahulu')
        return
      }

      const total = pesanan.reduce((sum, item) => sum + item.subtotal, 0)

      localStorage.setItem(
        'checkoutData',
        JSON.stringify({
          produk: pesanan,
          total,
        }),
      )

      window.location.hash = '#/payment'
    })
  }
}

export default SayurPagePresenter
