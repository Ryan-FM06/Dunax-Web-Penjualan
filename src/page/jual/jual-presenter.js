import { BASE_URL } from '../../config/api.js'
import { getAuth } from '../../utils/authStorage.js'

// satuan default per kategori — sesuaikan kalau perlu
const SATUAN_PER_KATEGORI = {
  ayam: 'Ekor',
  bebek: 'Ekor',
  kambing: 'Ekor',
  sapi: 'Ekor',
  ikan: 'Kg',
  sayur: 'Ikat',
}

export const getSatuan = (categoryId, namaItem) => {
  if (namaItem.toLowerCase().includes('telur')) return 'Butir'
  return SATUAN_PER_KATEGORI[categoryId] || 'Pcs'
}

class JualPresenter {
  constructor({ view, categoryId }) {
    this.view = view
    this.categoryId = categoryId
    this.pesanan = {}
    this.category = null
  }

  async init() {
    try {
      const res = await fetch(`${BASE_URL}/commodities`)
      const result = await res.json()
      const commodities = result.data || result

      this.category = commodities.find((c) => c.id === this.categoryId)

      if (!this.category) {
        this.view.renderNotFound()
        return
      }

      this.view.renderCategory(this.category)
      this._bindEvents()
    } catch (err) {
      console.error('Gagal ambil data komoditas:', err)
      this.view.renderError()
    }
  }

  _bindEvents() {
    this.totalHargaEl = document.getElementById('totalHarga')
    this.checkoutBtn = document.getElementById('beliSekarang')
    this.tableBody = document.getElementById('ringkasanTable')

    this._initCounter()
    this._initCartButton()
    this._render()
    this._checkout()
  }

  _satuan(item) {
    return getSatuan(this.categoryId, item.nama)
  }

  _findProduk(id) {
    return this.category.details.find((p) => String(p.id) === String(id))
  }

  /* ================= COUNTER ================= */
  _initCounter() {
    document.querySelectorAll('.plus-btn').forEach((btn) => {
      btn.onclick = () => this._updateJumlah(btn.dataset.id, 1)
    })

    document.querySelectorAll('.minus-btn').forEach((btn) => {
      btn.onclick = () => this._updateJumlah(btn.dataset.id, -1)
    })

    document.querySelectorAll('.jumlah-input').forEach((input) => {
      input.onblur = () => {
        const id = input.dataset.id
        let value = Math.max(0, Math.floor(Number(input.value)))
        input.value = value
        this._simpan(id, value)
      }
    })
  }

  _updateJumlah(id, arah) {
    const input = document.querySelector(`.jumlah-input[data-id="${id}"]`)
    let value = Number(input.value) + arah
    value = Math.max(0, Math.floor(value))
    input.value = value
    this._simpan(id, value)
  }

  /* ================= SIMPAN ================= */
  _simpan(id, jumlah) {
    const produk = this._findProduk(id)
    if (!produk) return

    if (jumlah === 0) {
      delete this.pesanan[id]
    } else {
      if (jumlah > produk.stok) {
        alert(`Stok ${produk.nama} cuma tersisa ${produk.stok}`)
        jumlah = produk.stok
        const input = document.querySelector(`.jumlah-input[data-id="${id}"]`)
        if (input) input.value = jumlah
      }

      this.pesanan[id] = {
        nama: produk.nama,
        jumlah,
        harga: produk.harga,
        satuan: this._satuan(produk),
      }
    }

    this._render()
  }

  /* ================= RENDER RINGKASAN ================= */
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

    entries.forEach(([id, p]) => {
      const subtotal = p.jumlah * p.harga
      total += subtotal

      this.tableBody.innerHTML += `
        <tr>
          <td>${p.nama}</td>
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
        const { isLogin, currentUser } = getAuth()

        if (!isLogin || !currentUser) {
          alert('Silakan login dulu untuk menambahkan ke keranjang')
          window.location.hash = '#/login'
          return
        }

        const id = btn.dataset.id
        const input = document.querySelector(`.jumlah-input[data-id="${id}"]`)
        const jumlah = Number(input.value)

        if (jumlah <= 0) {
          alert('Jumlah masih 0')
          return
        }

        const produk = this._findProduk(id)
        const cartKey = `cart_${currentUser.id}`
        const cart = JSON.parse(localStorage.getItem(cartKey) || '[]')
        const existing = cart.find((i) => i.nama === produk.nama)

        if (existing) {
          existing.jumlah += jumlah
        } else {
          cart.push({
            nama: produk.nama,
            jumlah,
            harga: produk.harga,
            satuan: this._satuan(produk),
          })
        }

        localStorage.setItem(cartKey, JSON.stringify(cart))
        window.dispatchEvent(new Event('storage'))

        input.value = 0
        delete this.pesanan[id]
        this._render()

        alert(`${produk.nama} masuk keranjang 🛒`)
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

      const produkArray = Object.values(this.pesanan).map((p) => ({
        nama: p.nama,
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

export default JualPresenter