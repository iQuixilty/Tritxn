const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "nuke",
    category: "Moderation",
    description: "Deletes and creates a channel with the same permissions",
    usage: "\`PREFIXnuke\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const nukeE = new Discord.MessageEmbed()

        message.channel.send(nukeE.setColor(message.guild.me.displayColor).setTitle('🧨 Tactical Nuke Incoming 🧨!'))

        let channel = message.guild.channels.cache.get(message.channel.id)

        var position = channel.position

        channel.clone().then((channel2) => {
            channel2.setPosition(position)

            channel.delete()

            channel2.send(nukeE.setColor(message.guild.me.displayColor).setTitle('💥 Nuked Channel Successfully 💥'))
            channel2.send('https://giphy.com/gifs/80s-akira-oQtO6wKK2q0c8')
        })
    }
}