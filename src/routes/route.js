import HomePage from '../page/homepage/homepage.js'
import AyamPage from '../page/jual-ayam/ayampage.js'
import IkanPage from '../page/jual-ikan/ikanpage.js'
import KambingPage from '../page/jual-kambing/kambingpage.js'
import SapiPage from '../page/jual-sapi/sapipage.js'
import SayurPage from '../page/jual-sayur/sayurpage.js'
import PaymentPage from '../page/payment/payment.js'
import RiwayatPage from '../page/riwayat/riwayatpage.js'
import Login from '../auth/Login.js'
import Register from '../auth/Register.js'

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/login': Login,
  '/register': Register,
  '/jual-ayam': AyamPage,
  '/jual-ikan': IkanPage,
  '/jual-kambing': KambingPage,
  '/jual-sapi': SapiPage,
  '/jual-sayur': SayurPage,
  '/payment': PaymentPage,
  '/riwayat': RiwayatPage,
}

export default routes
