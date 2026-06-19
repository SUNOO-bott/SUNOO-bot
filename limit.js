const fs = require('fs')
let db = './database/limit.json'
let sewa = './database/sewa.json'
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let getHari = () => {
  let now = new Date()
  now.setHours(now.getHours() + 7) // WIB
  if (now.getHours() < 5 || now.getHours() == 5 && now.getMinutes() < 30) {
    now.setDate(now.getDate() - 1) // sebelum 05.30 = hari kemarin
  }
  return now.toISOString().slice(0,10)
}

let cekLimit = (sender) => {
  let lim = JSON.parse(fs.readFileSync(db))
  let sw = JSON.parse(fs.readFileSync(sewa))
  let today = getHari()

  if (sw[sender] && sw[sender].exp > Date.now()) return false

  if (!lim[sender] || lim[sender].last!= today) {
    lim[sender] = { count: 0, last: today }
    fs.writeFileSync(db, JSON.stringify(lim))
  }
  return lim[sender].count >= 30
}

let addLimit = (sender) => {
  let lim = JSON.parse(fs.readFileSync(db))
  let sw = JSON.parse(fs.readFileSync(sewa))

  if (sw[sender] && sw[sender].exp > Date.now()) return

  let today = getHari()
  if (!lim[sender] || lim[sender].last!= today) lim[sender] = { count: 0, last: today }
  lim[sender].count++
  fs.writeFileSync(db, JSON.stringify(lim))
}

module.exports = { cekLimit, addLimit }
