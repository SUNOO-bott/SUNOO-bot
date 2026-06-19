let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Format: .upchannel JUDUL|LINK LAGU|LINK THUMB')
  
  let [judul, linkLagu, thumb] = text.split('|')
  let idChannel = '120363xxxxxxxxxx@newsletter' // Ganti ID channel lu
  
  await conn.sendMessage(idChannel, {
    image: { url: thumb },
    caption: `🎵 ${judul}\n\nLink: ${linkLagu}`,
    audio: { url: linkLagu },
    mimetype: 'audio/mpeg'
  })
  
  m.reply('Udah ke-update ke channel ✅')
}
handler.command = ['upchannel', 'updatechannel']
handler.owner = true
module.exports = handler
