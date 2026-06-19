let fetch = require('node-fetch')

let handler = async (m, { conn, text }) => {
  if (!text || !text.includes('tiktok.com')) return m.reply('Link tiktok')
  
  m.reply('Tunggu 5 detik...')
  
  let res = await fetch(`https://api.tikwm.com/api/?url=${text}`)
  let json = await res.json()
  
  if (!json.data) return m.reply('Link error bang')
  
  let video = json.data.play
  let title = json.data.title
  
  await conn.sendVideo(m.chat, video, title, m)
}
handler.command = ['tt','tiktok']
module.exports = handler
