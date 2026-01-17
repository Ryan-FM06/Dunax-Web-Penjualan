import LoginPresenter from './Login-presenter.js'

const Login = {
  async render() {
    return `
      <div class="auth-page">
        <div class="auth-content">
          <section class="auth-container">
            <h2>Login</h2>

            <form id="loginForm">
              <input type="email" id="email" placeholder="Email" required />
              <input type="password" id="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>

            <p class="auth-link">
              Belum punya akun? <a href="#/register">Register</a>
            </p>
          </section>
        </div>
      </div>
    `
  },

  async afterRender() {
    LoginPresenter.init()
  },
}

export default Login
