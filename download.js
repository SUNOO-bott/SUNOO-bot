const { tiktok, instagram, twitter, pinterest } = require('btch-downloader')

module.exports = {
    name: 'down',
    alias: ['dl'],
    run: async(sock, m, args) => {
        const from = m.key.remoteJid
        const url = args[0]
        if(!url) return sock.sendMessage(from, { text: '.down link' })

        try {
            let media = [], caption = ''

            if(url.includes('tiktok.com')) {
                const r = await tiktok(url)
                caption = `TIKTOK\nTitle: ${r.title}\nAuthor: @${r.author.name}\nLike: ${r.like}\n\nSUNOO BOT`
                r.video.map(v => media.push({type: 'video', url: v.url}))
                r.images?.map(i => media.push({type: 'image', url: i.url}))
            }
            else if(url.includes('instagram.com')) {
                const r = await instagram(url)
                caption = `INSTAGRAM\nAuthor: @${r.author.name}\nCaption: ${r.caption?.slice(0,150)}\n\nSUNOO BOT`
                r.video.map(v => media.push({type: 'video', url: v.url}))
                r.images.map(i => media.push({type: 'image', url: i.url}))
            }
            else if(url.includes('twitter.com') || url.includes('x.com')) {
                const r = await twitter(url)
                caption = `X\nAuthor: @${r.author.name}\nText: ${r.text?.slice(0,150)}\n\nSUNOO BOT`
                r.video.map(v => media.push({type: 'video', url: v.url}))
                r.images?.map(i => media.push({type: 'image', url: i.url}))
            }
            else if(url.includes('pinterest.com')) {
                const r = await pinterest(url)
                caption = `PINTEREST\nTitle: ${r.title}\nAuthor: ${r.author}\n\nSUNOO BOT`
                r.images.map(i => media.push({type: 'image', url: i.url}))
                r.video?.map(v => media.push({type: 'video', url: v.url}))
            }

            for(let i = 0; i < media.length; i++) {
                const cap = i === 0? caption : ''
                await sock.sendMessage(from,
                    media[i].type === 'video'?
                    {video: {url: media[i].url}, caption: cap} :
                    {image: {url: media[i].url}, caption: cap}
                )
            }
        } catch(e) {
            sock.sendMessage(from, { text: 'Gagal' })
        }
    }
                                               }
