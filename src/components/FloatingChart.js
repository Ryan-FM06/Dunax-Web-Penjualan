import { getAuth } from '../utils/authStorage.js'

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
      const { isLogin, currentUser } = getAuth();

      if (!isLogin || !currentUser) {
        cartCountEl.style.display = 'none';
        return;
      }

      const cartKey = `cart_${currentUser.id}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const totalQty = cart.reduce((sum, item) => sum + (item.jumlah || 0), 0);

      cartCountEl.innerText = totalQty;
      cartCountEl.style.display = totalQty > 0 ? 'flex' : 'none';
    };

    cartBtn.onclick = () => {
      window.location.hash = '#/keranjang';
    };

    window.addEventListener('storage', renderCount);
    window.addEventListener('cartUpdated', renderCount);

    renderCount();
  },
};

export default FloatingCart;