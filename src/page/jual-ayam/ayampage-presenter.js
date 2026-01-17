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
    this._render()
    this._checkout()
  }

  /* ================= UTIL ================= */
  _isTelur(nama) {
    return nama.toLowerCase().includes('telur')
  }

  _step(nama) {
    return this._isTelur(nama) ? 1 : 0.5
  }

  _satuan(nama) {
    return this._isTelur(nama) ? 'Butir' : 'Ekor'
  }

  _normalize(nama, value) {
    const step = this._step(nama)
    if (this._isTelur(nama)) return Math.floor(value)
    return Math.round(value / step) * step
  }

  _formatJumlah(nama, value) {
    return this._isTelur(nama) ? value : value.toFixed(1)
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
        value = this._normalize(nama, value)
        input.value = this._formatJumlah(nama, value)
        this._simpan(nama, value)
      }
    })
  }

  _updateJumlah(nama, arah) {
    const input = document.querySelector(`.jumlah-input[data-nama="${nama}"]`)

    const step = this._step(nama)
    let value = Number(input.value) + arah * step

    value = Math.max(0, this._normalize(nama, value))
    input.value = this._formatJumlah(nama, value)

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
          <td data-label="Item">${nama}</td>
          <td data-label="Jumlah">${this._formatJumlah(nama, p.jumlah)}</td>
          <td data-label="Satuan">${p.satuan}</td>
          <td data-label="Harga">
            Rp ${subtotal.toLocaleString('id-ID')}
          </td>
        </tr>
      `
    })

    this.totalHargaEl.textContent = `Rp ${total.toLocaleString('id-ID')}`
    this.checkoutBtn.disabled = false
  }

  /* ================= CHECKOUT ================= */
  _checkout() {
    this.checkoutBtn.onclick = () => {
      if (Object.keys(this.pesanan).length === 0) {
        alert('Pesanan kosong')
        return
      }

      const total = Number(this.totalHargaEl.textContent.replace(/[^\d]/g, ''))

      // 🔥 FIX DI SINI: OBJECT → ARRAY
      const produkArray = Object.entries(this.pesanan).map(([nama, p]) => ({
        nama,
        jumlah: p.jumlah,
        satuan: p.satuan,
        harga: p.harga,
      }))

      localStorage.setItem(
        'checkoutData',
        JSON.stringify({
          produk: produkArray, // ✅ SEKARANG ARRAY
          total,
        }),
      )

      window.location.hash = '#/payment'
    }
  }
}

export default AyamPagePresenter
