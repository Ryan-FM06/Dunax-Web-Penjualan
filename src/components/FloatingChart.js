const FloatingCart = {
  render() {
    return `
      <div id="floating-cart">
        <button id="cart-button" title="Lihat Keranjang">
          <img 
            src="./src/assets/Photos/cart-empty.png" 
            alt="Keranjang" 
            id="cart-icon-img"
          />
          <span id="cart-count">0</span>
        </button>
      </div>
    `;
  },

  afterRender() {
    const cartBtn = document.getElementById('cart-button');
    const cartCountEl = document.getElementById('cart-count');

    const renderCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalQty = cart.reduce((sum, item) => sum + (item.jumlah || 0), 0);
      
      // Update angka dan sembunyikan jika 0 (opsional)
      cartCountEl.innerText = totalQty;
      cartCountEl.style.display = totalQty > 0 ? 'flex' : 'none';
    };

    cartBtn.onclick = () => {
      window.location.hash = '#/keranjang';
    };

    // 1. Dengerin perubahan dari tab lain
    window.addEventListener('storage', renderCount);

    // 2. Dengerin perubahan dari halaman yang sama (saat klik beli)
    window.addEventListener('cartUpdated', renderCount);

    // Render pertama kali saat load
    renderCount();
  },
};

export default FloatingCart;