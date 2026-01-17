class SapiPagePresenter {
  constructor(data) {
    this.data = data
    this.state = {}
  }

  init() {
    this._initState()
    this._setSatuanUI()
    this._bindCounter()
    this._bindCheckout()
    this._renderRingkasan() // 🔥 PENTING
  }

  _initState() {
    this.data.tersedia.forEach((item) => {
      this.state[item.nama] = 0
    })
  }

  _isSusu(nama) {
    return nama.toLowerCase().includes('susu')
  }

  _getSatuan(nama) {
    return this._isSusu(nama) ? 'Liter' : 'Ekor'
  }

  _getStep(nama) {
    return this._isSusu(nama) ? 0.5 : 1
  }

  _setSatuanUI() {
    document.querySelectorAll('.satuan').forEach((el) => {
      const nama = el.dataset.nama
      el.textContent = this._getSatuan(nama)
    })
  }

  _bindCounter() {
    document.querySelectorAll('.plus-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nama = btn.dataset.nama
        this.state[nama] += this._getStep(nama)
        this._normalize(nama)
      })
    })

    document.querySelectorAll('.minus-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nama = btn.dataset.nama
        const step = this._getStep(nama)
        if (this.state[nama] >= step) {
          this.state[nama] -= step
          this._normalize(nama)
        }
      })
    })

    document.querySelectorAll('.jumlah-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const nama = input.dataset.nama
        let value = parseFloat(e.target.value) || 0

        if (!this._isSusu(nama)) {
          value = Math.floor(value)
        } else {
          value = Math.round(value * 2) / 2
        }

        this.state[nama] = value
        this._renderRingkasan()
      })
    })
  }

  _normalize(nama) {
    if (this._isSusu(nama)) {
      this.state[nama] = Math.round(this.state[nama] * 2) / 2
    } else {
      this.state[nama] = Math.floor(this.state[nama])
    }

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
          satuan: this._getSatuan(nama),
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

export default SapiPagePresenter
