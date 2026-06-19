let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Format: .upaudio LINK_MP3|JUDUL')
  
  let [url, judul] = text.split('|')
  let idChannel = '120363xxxxxxxxxx@newsletter' // Ganti ID channel lu
  
  await conn.sendMessage(idChannel, {
    audio: { url: url },
    mimetype: 'audio/mpeg',
    ptt: false,
    caption: `🎵 ${judul || 'Lagu Baru'}`
  })
  
  m.reply('Udah dikirim ke channel ✅')
}
handler.command = ['upaudio']
handler.owner = true 
module.exports = handlerconst fs = require('fs')
let db = './database/sewa.json'
if (!fs.existsSync(db)) fs.writeFileSync(db, '{}')

let handler = async (m, { conn, args, isOwner }) => {
  let data = JSON.parse(fs.readFileSync(db))
  let user = m.sender

  if (args[0] == 'request') {
    if (!data[user] || data[user].exp < Date.now())
      return m.reply('Belum sewa/bayar')

    let [judul, link] = m.text.split('|').slice(1)
    await conn.sendMessage('120363xxx@newsletter', {
      audio: { url: link },
      mimetype: 'audio/mpeg',
      caption: `🎵 ${judul}\nReq: @${user.split('@')[0]}`
    }, { mentions: [user] })
    return m.reply('Up ✅')
  }

  if (args[0] == 'sewa') {
    return m.reply('1h=2k | 3h=5k | 7h=10k\nBayar DANA 08xxx, kirim bukti ke owner')
  }

  if (args[0] == 'add' && isOwner) {
    let target = m.mentionedJid[0]
    let hari = parseInt(args[2]) * 86400000
    data[target] = { exp: Date.now() + hari }
    fs.writeFileSync(db, JSON.stringify(data))
    return m.reply(`Akses ${args[2]} hari ditambah`)
  }
}
handler.command = ['sewa','request','addsewa']
module.exports = handler
