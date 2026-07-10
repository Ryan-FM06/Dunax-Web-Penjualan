import HomePage from '../page/homepage/homepage.js'
import AyamPage from '../page/jual-ayam/ayampage.js'
import BebekPage from '../page/jual-bebek/bebekpage.js'
import IkanPage from '../page/jual-ikan/ikanpage.js'
import KambingPage from '../page/jual-kambing/kambingpage.js'
import SapiPage from '../page/jual-sapi/sapipage.js'
import SayurPage from '../page/jual-sayur/sayurpage.js'
import PaymentPage from '../page/payment/payment.js'
import RiwayatPage from '../page/riwayat/riwayatpage.js'
import AntrianPage from '../page/antrian/daftar-antrian.js'
import Login from '../auth/Login.js'
import Register from '../auth/Register.js'
import KeranjangPage from '../page/keranjang/keranjang.js'
import VerifyEmail from '../auth/VerifyEmail.js'
import ForgotPassword from '../auth/ForgotPassword.js'
import ResetPassword from '../auth/ResetPassword.js'

const routes = {
  '/': { page: HomePage, public: true },
  '/home': { page: HomePage, public: true },
  '/login': { page: Login, public: true },
  '/register': { page: Register, public: true },
  '/verify-email': { page: VerifyEmail, public: true },
  '/forgot-password': { page: ForgotPassword, public: true },
  '/reset-password': { page: ResetPassword, public: true },
  '/jual-ayam': { page: AyamPage },
  '/jual-bebek' : {page : BebekPage},
  '/jual-ikan': { page: IkanPage },
  '/jual-kambing': { page: KambingPage },
  '/jual-sapi': { page: SapiPage },
  '/jual-sayur': { page: SayurPage },
  '/payment': { page: PaymentPage },
  '/riwayat': { page: RiwayatPage },
  '/antrian': { page: AntrianPage },
  '/keranjang' : { page: KeranjangPage},
}

export default routes