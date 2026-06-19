let handler = async (m, { conn, text, participants }) => {
    if (!m.isGroup) return m.reply('⚠️ Command ini khusus grup!')
    
    let member = participants.map(v => v.id)
    let pesan = text ? text : 'Tag semua member'
    
    let teks = `乂 *TAG ALL*\n\n${pesan}\n\n`
    teks += member.map(v => `• @${v.replace(/@s.whatsapp.net/g, '')}`).join('\n')
    
    conn.sendMessage(m.chat, { 
        text: teks, 
        mentions: member 
    }, { quoted: m })
}

handler.command = ['tagall', 'everyone', 'all']
handler.group = true 
handler.admin = true
handler.botAdmin = true

module.exports = handler
