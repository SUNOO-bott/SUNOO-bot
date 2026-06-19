const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const pino = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Chrome'),
        printQRInTerminal: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update
        if(qr) {
            console.log('SCAN QR DI BAWAH INI BRO:')
            qrcode.generate(qr, {small: true})
        }
        if(connection === 'open') {
            console.log('✅ BOT CONNECTED!')
        }
        if(connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode
            if(reason !== DisconnectReason.loggedOut) {
                startBot()
            }
        }
    })
    sock.ev.on('creds.update', saveCreds)
}
startBot()
