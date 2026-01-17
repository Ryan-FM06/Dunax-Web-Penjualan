import PaymentPresenter from './payment-presenter.js'

const PaymentPage = {
  async render() {
    return `
      <div class="payment-page">
        <section class="payment-card">

          <h2 class="payment-title">Isi Data Terlebih Dahulu</h2>

          <div class="form-group">
            <input id="nama" placeholder="Nama Lengkap" />
            <input id="alamat" placeholder="Alamat Lokasi" />
            <input id="telepon" placeholder="Nomor Telepon" />
          </div>

          <h3 class="section-title">Pilih Metode Pembayaran</h3>

          <div class="payment-method">
            <label class="pay-option">
              <input type="radio" name="pay" value="QRIS">
              <span>QRIS</span>
            </label>

            <label class="pay-option">
              <input type="radio" name="pay" value="VA">
              <span>Virtual Account</span>
            </label>

            <label class="pay-option">
              <input type="radio" name="pay" value="COD">
              <span>Cash / Tunai</span>
            </label>

            <label class="pay-option">
              <input type="radio" name="pay" value="EW">
              <span>E-Wallet</span>
            </label>
          </div>

          <div class="total-row">
            <span>Total Bayar</span>
            <strong id="paymentTotal">Rp 97.000</strong>
          </div>

          <button id="bayarSekarang" class="btn-dunax">
            Bayar Sekarang
          </button>

        </section>
      </div>
    `
  },

  async afterRender() {
    new PaymentPresenter().init()
  },
}

export default PaymentPage
