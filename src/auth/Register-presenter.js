const RegisterPresenter = {
  init() {
    const form = document.querySelector('#registerForm')
    if (!form) return

    if (form.dataset.bound === 'true') return
    form.dataset.bound = 'true'

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const name = document.querySelector('#name').value.trim()
      const email = document.querySelector('#email').value.trim()
      const password = document.querySelector('#password').value.trim()

      if (!name || !email || !password) {
        alert('Semua field wajib diisi')
        return
      }

      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        })

        const result = await response.json()

        if (!response.ok) {
          alert(result.message)
          return
        }

        alert('Register berhasil, silakan login')
        window.location.hash = '#/login'
      } catch (error) {
        console.error(error)
        alert('Register gagal')
      }
    })
  },
}

export default RegisterPresenter
