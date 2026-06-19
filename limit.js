let addUserLimit = (sender, jumlah) => {
  let lim = JSON.parse(fs.readFileSync(db))
  let today = getHari()

  if (!lim[sender] || lim[sender].last!= today) {
    lim[sender] = { count: 0, last: today }
  }
  lim[sender].count = Math.max(0, lim[sender].count - jumlah) // kurangin count = nambah sisa limit
  fs.writeFileSync(db, JSON.stringify(lim))
}
module.exports = { cekLimit, addLimit, isPremium, addUserLimit }
