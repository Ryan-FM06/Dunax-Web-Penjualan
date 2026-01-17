const LoginPresenter = {
  init() {
    const form = document.querySelector('#loginForm')
    if (!form) return

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const email = document.querySelector('#email').value.trim()
      const password = document.querySelector('#password').value.trim()

      if (!email || !password) {
        alert('Email dan password wajib diisi')
        return
      }

      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        const result = await response.json()

        if (!response.ok) {
          alert(result.message || 'Login gagal')
          return
        }

        // 🔥 AMBIL DATA DARI result.data (BUKAN result.user)
        const user = {
          email: result.data.email,
        }

        // ✅ SIMPAN LOGIN STATE (INI YANG DIPAKE APPBAR)
        localStorage.setItem('isLogin', 'true')
        localStorage.setItem('currentUser', JSON.stringify(user))

        console.log('✅ LOGIN SUCCESS:', user)

        // 🔥 PINDAH KE HOME
        window.location.hash = '#/home'
        window.location.reload()
      } catch (err) {
        console.error('LOGIN ERROR:', err)
        alert('Login gagal')
      }
    })
  },
}

export default LoginPresenter
