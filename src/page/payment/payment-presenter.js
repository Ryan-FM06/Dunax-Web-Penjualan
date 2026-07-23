import { AUTH_URL } from '../../config/api.js'
import { getAuth } from '../../utils/authStorage.js'

const WILAYAH_BASE = 'https://www.emsifa.com/api-wilayah-indonesia/api'

class PaymentPresenter {
  init() {
    const data = JSON.parse(localStorage.getItem('checkoutData'))
    const { isLogin, currentUser } = getAuth()

    if (!data || !data.produk) {
      alert('Data pesanan kosong')
      window.location.hash = '#/'
      return
    }

    if (!isLogin || !currentUser) {
      alert('Silakan login dulu')
      window.location.hash = '#/login'
      return
    }

    const totalEl = document.getElementById('paymentTotal')
    const bayarBtn = document.getElementById('bayarSekarang')
    totalEl.textContent = `Rp ${data.total.toLocaleString('id-ID')}`

    const provinsiEl = document.getElementById('provinsi')
    const kotaEl = document.getElementById('kota')
    const kecamatanEl = document.getElementById('kecamatan')
    const kelurahanEl = document.getElementById('kelurahan')

    this.loadWilayah(provinsiEl, `${WILAYAH_BASE}/provinces.json`, 'Pilih Provinsi')

    provinsiEl.addEventListener('change', () => {
      const provinceId = provinsiEl.value
      this.resetSelect(kotaEl, 'Pilih Kota/Kabupaten', true)
      this.resetSelect(kecamatanEl, 'Pilih Kecamatan', true)
      this.resetSelect(kelurahanEl, 'Pilih Kelurahan/Desa', true)

      if (provinceId) {
        this.loadWilayah(kotaEl, `${WILAYAH_BASE}/regencies/${provinceId}.json`, 'Pilih Kota/Kabupaten')
      }
    })

    kotaEl.addEventListener('change', () => {
      const regencyId = kotaEl.value
      this.resetSelect(kecamatanEl, 'Pilih Kecamatan', true)
      this.resetSelect(kelurahanEl, 'Pilih Kelurahan/Desa', true)

      if (regencyId) {
        this.loadWilayah(kecamatanEl, `${WILAYAH_BASE}/districts/${regencyId}.json`, 'Pilih Kecamatan')
      }
    })

    kecamatanEl.addEventListener('change', () => {
      const districtId = kecamatanEl.value
      this.resetSelect(kelurahanEl, 'Pilih Kelurahan/Desa', true)

      if (districtId) {
        this.loadWilayah(kelurahanEl, `${WILAYAH_BASE}/villages/${districtId}.json`, 'Pilih Kelurahan/Desa')
      }
    })

    bayarBtn.onclick = async () => {
      const nama = document.getElementById('nama').value.trim()
      const telepon = document.getElementById('telepon').value.trim()

      const provinsi = provinsiEl.options[provinsiEl.selectedIndex]?.text || ''
      const kota = kotaEl.options[kotaEl.selectedIndex]?.text || ''
      const kecamatan = kecamatanEl.options[kecamatanEl.selectedIndex]?.text || ''
      const kelurahan = kelurahanEl.options[kelurahanEl.selectedIndex]?.text || ''
      const alamatDetail = document.getElementById('alamatDetail').value.trim()
      const catatan = document.getElementById('catatan').value.trim()
      const metode = document.querySelector('input[name="pay"]:checked')

      if (
        !nama ||
        !telepon ||
        !provinsiEl.value ||
        !kotaEl.value ||
        !kecamatanEl.value ||
        !kelurahanEl.value ||
        !alamatDetail
      ) {
        alert('Lengkapi semua data alamat')
        return
      }

      if (!metode) {
        alert('Pilih metode pembayaran')
        return
      }

      bayarBtn.disabled = true
      bayarBtn.textContent = 'Memproses...'

      try {
        const res = await fetch(`${AUTH_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser.id,
            nama,
            telepon,
            provinsi,
            kota,
            kecamatan,
            kelurahan,
            alamat: alamatDetail,
            catatan,
            metode: metode.value,
            produk: data.produk,
            total: data.total,
          }),
        })

        const result = await res.json()

        if (result.status !== 'success') {
          alert(result.message || 'Gagal menyimpan transaksi')
          bayarBtn.disabled = false
          bayarBtn.textContent = 'Bayar Sekarang'
          return
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || []
        cart = cart.filter(
          (cartItem) => !data.produk.some((paidItem) => paidItem.nama === cartItem.nama)
        )
        localStorage.setItem('cart', JSON.stringify(cart))
        localStorage.removeItem('checkoutData')

        window.dispatchEvent(new Event('storage'))

        alert('Pembayaran berhasil!')
        window.location.hash = '#/riwayat'
      } catch (err) {
        console.error(err)
        alert('Gagal konek ke server, coba lagi.')
        bayarBtn.disabled = false
        bayarBtn.textContent = 'Bayar Sekarang'
      }
    }
  }

  resetSelect(selectEl, placeholderText, disabled) {
    selectEl.innerHTML = `<option value="">${placeholderText}</option>`
    selectEl.disabled = disabled
  }

  async loadWilayah(selectEl, url, placeholderText) {
    selectEl.innerHTML = '<option value="">Memuat...</option>'
    selectEl.disabled = true

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Gagal ambil data wilayah')
      const list = await res.json()

      selectEl.innerHTML = `<option value="">${placeholderText}</option>` +
        list.map(item => `<option value="${item.id}">${item.name}</option>`).join('')

      selectEl.disabled = false
    } catch (err) {
      console.error(err)
      selectEl.innerHTML = `<option value="">Gagal memuat, coba lagi</option>`
      selectEl.disabled = false
    }
  }
}

export default PaymentPresenter