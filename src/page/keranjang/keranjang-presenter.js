const KeranjangPresenter = {
  init() {
    this.cartListEl = document.getElementById('cart-list')
    this.totalEl = document.getElementById('cart-total')
    this.checkoutBtn = document.getElementById('checkout-btn')

    this.checkoutBtn.onclick = () => this.checkout()

    this.load()
  },

  load() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || []

    this.cart = this.cart.map(item => ({
      ...item,
      checked: item.checked ?? true,
    }))

    this.render()
  },

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart))
    window.dispatchEvent(new Event('storage'))
  },

  render() {
    this.cartListEl.innerHTML = ''

    if (this.cart.length === 0) {
      this.cartListEl.innerHTML = `
        <div class="cart-empty-card">
          <p class="empty-cart">Keranjang masih kosong</p>
        </div>
      `
      this.totalEl.innerText = 'Rp0'
      this.saveCart()
      return
    }

    let total = 0

    this.cart.forEach((item, index) => {
      const subtotal = item.harga * item.jumlah
      if (item.checked) total += subtotal

      this.cartListEl.innerHTML += `
        <div class="cart-card">

          <input
            type="checkbox"
            class="cart-check"
            data-index="${index}"
            ${item.checked ? 'checked' : ''}
          />

          <div class="cart-info">
            <h4>${item.nama}</h4>

            <div class="price-row">
              <span class="price">Rp${item.harga.toLocaleString()}</span>
              <button class="remove-btn" data-action="remove" data-index="${index}">
                Hapus
              </button>
            </div>

            <div class="cart-qty">
              <button data-action="minus" data-index="${index}">−</button>
              <span>${item.jumlah}</span>
              <button data-action="plus" data-index="${index}">+</button>
            </div>
          </div>

          <div class="cart-right">
            <p class="subtotal">Rp${subtotal.toLocaleString()}</p>
          </div>
        </div>
      `
    })

    this.totalEl.innerText = `Rp${total.toLocaleString()}`
    this.saveCart()
    this.bindEvents()
  },

  bindEvents() {
    this.cartListEl.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        const index = btn.dataset.index
        const action = btn.dataset.action

        if (action === 'plus') this.cart[index].jumlah++
        if (action === 'minus' && this.cart[index].jumlah > 1)
          this.cart[index].jumlah--
        if (action === 'remove') this.cart.splice(index, 1)

        this.render()
      }
    })

    this.cartListEl.querySelectorAll('.cart-check').forEach(cb => {
      cb.onchange = () => {
        const index = cb.dataset.index
        this.cart[index].checked = cb.checked
        this.render()
      }
    })
  },

  // 🔥 CHECKOUT KE PAYMENT
  checkout() {
    const produkDipilih = this.cart.filter(item => item.checked)

    if (produkDipilih.length === 0) {
      alert('Pilih minimal satu produk')
      return
    }

    const total = produkDipilih.reduce(
      (sum, item) => sum + item.harga * item.jumlah,
      0
    )

    localStorage.setItem(
      'checkoutData',
      JSON.stringify({
        produk: produkDipilih,
        total,
      })
    )

    window.location.hash = '#/payment'
  },
}

export default KeranjangPresenter