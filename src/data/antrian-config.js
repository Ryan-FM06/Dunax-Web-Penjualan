import AyamData from './Produk-ayam.js'

const ayamItems = AyamData.tersedia.map(item => ({
  label: item.nama,
  key: item.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  unit: item.nama.toLowerCase().includes('telur')
    ? 'butir'
    : 'ekor',
}))

const AntrianConfig = [
  ...ayamItems,

  { label: 'Sapi', key: 'sapi', unit: 'ekor' },
  { label: 'Kambing', key: 'kambing', unit: 'ekor' },

  // 🔥 SATU CARD IKAN
  { label: 'Ikan', key: 'ikan', unit: 'ekor' },

  { label: 'Sayur', key: 'sayur', unit: 'kg' },
]

export default AntrianConfig