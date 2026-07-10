import KeranjangPresenter from './keranjang-presenter.js'

const KeranjangPage = {
  async render() {
    return `
      <section class="cart-page">

        <div class="cart-header-card">
          <h2>Keranjang Saya</h2>
        </div>

        <div class="cart-wrapper">
          <div id="cart-list" class="cart-list"></div>
        </div>

        <div class="cart-summary">
          <h3>Total: <span id="cart-total">Rp0</span></h3>
          <button id="checkout-btn">Lanjut Pembayaran</button>
        </div>

      </section>
    `
  },

  async afterRender() {
    KeranjangPresenter.init()
  },
}

export default KeranjangPage