const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, downloadMediaMessage } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const pino = require('pino')

const prefix = '.'
const ownerName = 'Reina!! gf sunoo'

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session')

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if(qr) {
            console.log('SCAN QR DI BAWAH:')
            qrcode.generate(qr, {small: true})
        }
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut
            if(shouldReconnect) startBot()
        }
        if(connection === 'open') console.log('✅ BOT STICKER ONLINE')
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if(!m.message || m.key.fromMe) return

        const from = m.key.remoteJid
        const body = m.message.conversation || m.message.extendedTextMessage?.text || ''

        if(!body.startsWith(prefix)) return
        const command = body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase()

        // COMMAND STICKER DOANG
        if(command === 'sticker' || command === 's' || command === 'stik') {
            const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage
            const isImage = quoted?.imageMessage || m.message.imageMessage

            if(!isImage) return sock.sendMessage(from, { text: 'Reply gambarnya dulu bro' })

            await sock.sendMessage(from, { text: 'Bentar lagi jadi stiker...' })
            const media = await downloadMediaMessage(m, 'buffer', {})
            await sock.sendMessage(from, {
                sticker: media,
                packname: 'SUNOO BOT',
                author: ownerName
            })
        }
    })
}

startBot()
