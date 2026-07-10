class AyamPagePresenter {
  constructor(data) {
    this.data = data
    this.pesanan = {}
  }

  init() {
    this.totalHargaEl = document.getElementById('totalHarga')
    this.checkoutBtn = document.getElementById('beliSekarang')
    this.tableBody = document.getElementById('ringkasanTable')

    this._initCounter()
    this._initCartButton()
    this._render()
    this._checkout()
  }

  /* ================= UTIL ================= */
  _isTelur(nama) {
    return nama.toLowerCase().includes('telur')
  }

  _step() {
    return 1
  }

  _satuan(nama) {
    return this._isTelur(nama) ? 'Butir' : 'Ekor'
  }

  _normalize(value) {
    return Math.floor(value)
  }

  _formatJumlah(value) {
    return value
  }

  /* ================= COUNTER ================= */
  _initCounter() {
    document.querySelectorAll('.plus-btn').forEach((btn) => {
      btn.onclick = () => this._updateJumlah(btn.dataset.nama, 1)
    })

    document.querySelectorAll('.minus-btn').forEach((btn) => {
      btn.onclick = () => this._updateJumlah(btn.dataset.nama, -1)
    })

    document.querySelectorAll('.jumlah-input').forEach((input) => {
      input.onblur = () => {
        const nama = input.dataset.nama
        let value = Math.max(0, Number(input.value))
        value = this._normalize(value)
        input.value = this._formatJumlah(value)
        this._simpan(nama, value)
      }
    })
  }

  _updateJumlah(nama, arah) {
    const input = document.querySelector(`.jumlah-input[data-nama="${nama}"]`)
    let value = Number(input.value) + arah
    value = Math.max(0, this._normalize(value))
    input.value = value
    this._simpan(nama, value)
  }

  /* ================= SIMPAN ================= */
  _simpan(nama, jumlah) {
    if (jumlah === 0) {
      delete this.pesanan[nama]
    } else {
      const produk = this.data.tersedia.find((p) => p.nama === nama)
      this.pesanan[nama] = {
        jumlah,
        harga: produk.harga,
        satuan: this._satuan(nama),
      }
    }

    this._render()
  }

  /* ================= RENDER ================= */
  _render() {
    this.tableBody.innerHTML = ''
    let total = 0

    const entries = Object.entries(this.pesanan)

    if (entries.length === 0) {
      this.tableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="4">Belum ada pesanan</td>
        </tr>
      `
      this.totalHargaEl.textContent = 'Rp 0'
      this.checkoutBtn.disabled = true
      return
    }

    entries.forEach(([nama, p]) => {
      const subtotal = p.jumlah * p.harga
      total += subtotal

      this.tableBody.innerHTML += `
        <tr>
          <td>${nama}</td>
          <td>${p.jumlah}</td>
          <td>${p.satuan}</td>
          <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
        </tr>
      `
    })

    this.totalHargaEl.textContent = `Rp ${total.toLocaleString('id-ID')}`
    this.checkoutBtn.disabled = false
  }

  /* ================= CART ================= */
  _initCartButton() {
    document.querySelectorAll('.cart-row-btn').forEach((btn) => {
      btn.onclick = () => {
        const nama = btn.dataset.nama
        const input = document.querySelector(
          `.jumlah-input[data-nama="${nama}"]`
        )

        const jumlah = Number(input.value)
        if (jumlah <= 0) {
          alert('Jumlah masih 0')
          return
        }

        const produk = this.data.tersedia.find((p) => p.nama === nama)
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existing = cart.find((i) => i.nama === nama)

        if (existing) {
          existing.jumlah += jumlah
        } else {
          cart.push({
            nama,
            jumlah,
            harga: produk.harga,
            satuan: this._satuan(nama),
          })
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('storage'))

        input.value = 0
        delete this.pesanan[nama]
        this._render()

        alert(`${nama} masuk keranjang 🛒`)
      }
    })
  }

  /* ================= CHECKOUT ================= */
  _checkout() {
    this.checkoutBtn.onclick = () => {
      if (Object.keys(this.pesanan).length === 0) {
        alert('Pesanan kosong')
        return
      }

      const total = Number(this.totalHargaEl.textContent.replace(/[^\d]/g, ''))

      const produkArray = Object.entries(this.pesanan).map(([nama, p]) => ({
        nama,
        jumlah: p.jumlah,
        satuan: p.satuan,
        harga: p.harga,
      }))

      localStorage.setItem(
        'checkoutData',
        JSON.stringify({
          produk: produkArray,
          total,
        })
      )

      window.location.hash = '#/payment'
    }
  }
}

export default AyamPagePresenter