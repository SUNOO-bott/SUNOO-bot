const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const pino = require('pino')

const prefix = '.'
const owner = '6283821428149'
const ownerName = 'Reina!! gf sunoo'

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session-owner')

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if(qr) {
            console.log('SCAN QR OWNER DI BAWAH:')
            qrcode.generate(qr, {small: true})
        }
        if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut
            if(shouldReconnect) startBot()
        }
        if(connection === 'open') console.log('✅ BOT OWNER ONLINE')
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0] // <-- ini yang lu tanya tadi bro
        if(!m.message || m.key.fromMe) return

        const from = m.key.remoteJid
        const body = m.message.conversation || m.message.extendedTextMessage?.text || ''

        if(!body.startsWith(prefix)) return
        const command = body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase()

        // COMMAND OWNER DOANG - VERSI KONTAK FORWARD
        if(command === 'owner') {
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${ownerName}\nFN:${ownerName}\nTEL;type=CELL;type=VOICE;waid=${owner}:+${owner}\nEND:VCARD`

            await sock.sendMessage(from, {
                contacts: {
                    displayName: ownerName,
                    contacts: [{ vcard }]
                },
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            })
        }
    })
}

startBot()
