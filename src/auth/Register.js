import RegisterPresenter from './Register-presenter.js'

const Register = {
  render() {
    return `
      <section class="auth-page">
        <div class="auth-card">
          <h2>Register</h2>

          <form id="registerForm">
            <input type="text" id="name" placeholder="Nama" required />
            <input type="email" id="email" placeholder="Email" required />
            <input type="password" id="password" placeholder="Password" required />

            <button type="submit">Register</button>
          </form>

          <p class="auth-footer">
            Sudah punya akun?
            <a href="#/login">Login</a>
          </p>
        </div>
      </section>
    `
  },

  afterRender() {
    RegisterPresenter.init()
  },
}

export default Register
