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
          display: flex;
          align-items: center;
          justify-content: center;
          height: 70px;
          padding: 0 20px;
          font-family: sans-serif;
          font-weight: bold;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
          margin-top: 40px;

          /* PENTING */
          position: relative;
        }
      </style>

      <footer>
        © DUNAX FARM
      </footer>
    `
  }
}

customElements.define('footer-bar', Footer)