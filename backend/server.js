require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const REGISTER_FILE = path.join(__dirname, 'register.json')
const LOGIN_FILE = path.join(__dirname, 'login.json')

const readJSON = (file) => {
  if (!fs.existsSync(file)) return []
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

app.get('/', (req, res) => {
  res.json({ message: '🔥 Backend jalan' })
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Field kosong' })
  }

  const users = readJSON(REGISTER_FILE)

  const newUser = {
    name,
    email,
    password,
    time: new Date(),
  }

  users.push(newUser)
  writeJSON(REGISTER_FILE, users)

  res.json({
    message: 'Register masuk',
    data: newUser,
  })
})

app.get('/register', (req, res) => {
  const users = readJSON(REGISTER_FILE)
  res.json({
    total: users.length,
    data: users,
  })
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Field kosong' })
  }

  const logs = readJSON(LOGIN_FILE)

  const log = {
    email,
    password,
    time: new Date(),
  }

  logs.push(log)
  writeJSON(LOGIN_FILE, logs)

  res.json({
    message: 'Login masuk',
    data: log,
  })
})

app.get('/login', (req, res) => {
  const logs = readJSON(LOGIN_FILE)
  res.json({
    total: logs.length,
    data: logs,
  })
})

app.listen(PORT, () => {
  console.log(`🔥 Server jalan di http://localhost:${PORT}`)
})
