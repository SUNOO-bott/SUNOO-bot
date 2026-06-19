let handler = m => m

handler.before = async function(m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return
    if (isAdmin) return
    if (!isBotAdmin) return

    let chat = global.db.data.chats[m.chat]
    if (!chat.antibot) return

    let participants = m.messageStubParameters || []
    if (m.messageStubType == 27) { // 27 = add member
        for (let user of participants) {
            if (user.endsWith('@s.whatsapp.net') && user.includes('bot')) {
                await conn.sendMessage(m.chat, {text: `🤖 Terdeteksi bot masuk grup\n@${user.split('@')[0]} langsung dikick`, mentions: [user]})
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            }
        }
    }
}

module.exports = handler
