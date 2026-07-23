import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './db.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

app.get('/', (req, res) => res.json({ message: '🔥 Dunax Farm Store API Aktif!' }));

// REGISTER — simpan user belum terverifikasi, kirim OTP
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
  return res.status(400).json({
    status: 'fail',
    message: 'Semua field wajib diisi.'
  });
}

if (password.length < 8) {
  return res.status(400).json({
    status: 'fail',
    message: 'Password minimal 8 karakter.'
  });
}

  try {
    // cek email sudah ada atau belum
    const [exist] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (exist.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email sudah terdaftar'
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users
      (full_name,email,password,otp_code,otp_expiry,is_verified)
      VALUES (?,?,?,?,?,false)`,
      [name, email, hashedPassword, otp, expiry]
    );

    await transporter.sendMail({
      from: `"Dunax Farm Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifikasi Akun Dunax Farm',
      html: `
      <h3>Halo ${name}</h3>
      <p>Kode OTP kamu:</p>
      <h2>${otp}</h2>
      <p>Berlaku 10 menit.</p>
      `
    });

    res.json({
      status: 'success',
      message: 'OTP berhasil dikirim ke email'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// VERIFIKASI EMAIL — dipanggil setelah register, langsung login begitu OTP benar
app.post('/verify-email', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, otp_code, otp_expiry FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Email tidak ditemukan' });
    }

    const user = rows[0];

    if (user.otp_code !== otp) {
      return res.status(401).json({ status: 'error', message: 'Kode OTP salah' });
    }

    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(401).json({ status: 'error', message: 'Kode OTP sudah kadaluarsa' });
    }

    await pool.query(
      'UPDATE users SET is_verified = true, otp_code = NULL, otp_expiry = NULL WHERE email = ?',
      [email]
    );

    const [userRows] = await pool.query('SELECT id, full_name, email FROM users WHERE email = ?', [email]);

    res.json({
      status: 'success',
      message: 'Email berhasil diverifikasi!',
      data: userRows[0]
    });
  } catch (err) {
    console.error("❌ VERIFY ERROR:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// LOGIN — cek email sudah terverifikasi atau belum
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, password, is_verified FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ status: 'fail', message: 'Email atau Password salah!' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            status: 'fail',
            message: 'Email atau Password salah!'
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({ status: 'fail', message: 'Email belum diverifikasi. Cek email kamu.' });
    }

    res.json({
      status: 'success',
      message: 'Login Berhasil!',
      data: { id: user.id, full_name: user.full_name, email: user.email }
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// FORGOT PASSWORD
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    const [result] = await pool.query(
      'UPDATE users SET otp_code = ?, otp_expiry = ? WHERE email = ?',
      [otp, expiry, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Email pembeli tidak ditemukan!' });
    }

    const [userRows] = await pool.query('SELECT full_name FROM users WHERE email = ?', [email]);

    await transporter.sendMail({
      from: `"Dunax Farm Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'OTP Reset Password - Dunax Farm Store',
      html: `<h3>Halo, ${userRows[0].full_name}!</h3><p>Gunakan kode OTP ini untuk ganti password lo: <b>${otp}</b></p>`
    });

    res.json({ status: 'success', message: 'OTP terkirim ke email!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//kirim ulang otp
app.post('/resend-otp', async (req, res) => {

  const { email } = req.body;

  try {

    const otp = crypto.randomInt(100000,999999).toString();

    const expiry =
      new Date(Date.now() + 10 * 60 * 1000);

    const [rows] = await pool.query(
      'SELECT full_name FROM users WHERE email=?',
      [email]
    );

    if(rows.length === 0){
      return res.status(404).json({
        message:'Email tidak ditemukan'
      });
    }

    await pool.query(
      `UPDATE users
       SET otp_code=?,
           otp_expiry=?
       WHERE email=?`,
      [otp, expiry, email]
    );

    await transporter.sendMail({
      from:`"Dunax Farm Admin" <${process.env.EMAIL_USER}>`,
      to:email,
      subject:'OTP Verifikasi Baru',
      html:`<h2>${otp}</h2>`
    });

    res.json({
      status:'success',
      message:'OTP baru berhasil dikirim'
    });

  } catch(err){
      res.status(500).json({
        message:err.message
      });
  }

});

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        full_name,
        email,
        is_verified,
        created_at
      FROM users
    `);

    res.json({
      status: 'success',
      data: rows
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// SIMPAN TRANSAKSI
app.post('/orders', async (req, res) => {
  const {
    user_id, nama, alamat, telepon, metode, produk, total,
    provinsi, kota, kecamatan, kelurahan, catatan
  } = req.body;

  if (!nama || !alamat || !telepon || !metode || !produk || produk.length === 0) {
    return res.status(400).json({ status: 'fail', message: 'Data pesanan tidak lengkap' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO orders
        (user_id, nama, alamat, telepon, metode, total, provinsi, kota, kecamatan, kelurahan, catatan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id || null, nama, alamat, telepon, metode, total,
        provinsi || null, kota || null, kecamatan || null, kelurahan || null, catatan || null
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of produk) {
      const subtotal = item.jumlah * item.harga;
      await conn.query(
        `INSERT INTO order_items (order_id, nama_produk, jumlah, satuan, harga, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.nama, item.jumlah, item.satuan, item.harga, subtotal]
      );
    }

    await conn.commit();

    res.json({
      status: 'success',
      message: 'Transaksi berhasil disimpan',
      data: { orderId }
    });
  } catch (err) {
    await conn.rollback();
    console.error('❌ ORDER ERROR:', err);
    res.status(500).json({ status: 'error', message: err.message });
  } finally {
    conn.release();
  }
});

// RIWAYAT 
app.get('/orders', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ status: 'fail', message: 'user_id wajib diisi' });
  }

  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );

    for (const order of orders) {
      const [items] = await pool.query(
        'SELECT nama_produk AS nama, jumlah, satuan, harga, subtotal FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.produk = items;
    }

    res.json({ status: 'success', data: orders });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ANTRIAN
app.get('/orders/antrian', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');

    for (const order of orders) {
      const [items] = await pool.query(
        'SELECT nama_produk AS nama, jumlah, satuan, harga, subtotal FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.produk = items;
    }

    res.json({ status: 'success', data: orders });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// RESET PASSWORD 
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ status: 'fail', message: 'Semua field wajib diisi.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ status: 'fail', message: 'Password minimal 8 karakter.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, otp_code, otp_expiry FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Email tidak ditemukan' });
    }

    const user = rows[0];

    if (!user.otp_code || user.otp_code !== otp) {
      return res.status(401).json({ status: 'fail', message: 'Kode OTP salah' });
    }

    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(401).json({ status: 'fail', message: 'Kode OTP sudah kadaluarsa' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = ?, otp_code = NULL, otp_expiry = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    res.json({ status: 'success', message: 'Password berhasil diubah!' });
  } catch (err) {
    console.error('❌ RESET PASSWORD ERROR:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Store Server on: http://localhost:${PORT}`);
});