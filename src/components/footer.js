class Footer extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <style>
        footer {
          background-color: #2f4f3a;
          color: white;
          display: flex;       /* Biar bisa pakai align-items */
          align-items: center; /* Teks rata tengah vertikal */
          height: 70px;        /* Samakan dengan tinggi Navbar */
          padding: 0 20px;     /* Padding samping samakan dengan Navbar */
          font-family: sans-serif;
          font-weight: bold;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
          margin-top: 20px;
        }
      </style>
      <footer>
      </footer>
    `
  }
}

customElements.define('footer-bar', Footer)
