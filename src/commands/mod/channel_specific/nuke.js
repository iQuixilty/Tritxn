const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')


module.exports = {
    name: "nuke",
    category: "Moderation",
    description: "Deletes and creates a channel with the same permissions",
    usage: "\`PREFIXnuke\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const nukeE = new Discord.MessageEmbed()

        message.channel.send(new Discord.MessageEmbed().setDescription(`\`[⏰ 10s]\` Are you sure you want nuke ${message.channel}? \`[yes/no]\``).setColor(message.guild.me.displayColor))

        const collector = new Discord.MessageCollector(message.channel, msg => msg.author.id === message.author.id, {
            time: 10000
        })

        collector.on('collect', async (msg) => {
            switch (msg.content.toLowerCase()) {
                case "yes":
                    message.channel.send(nukeE.setColor(message.guild.me.displayColor).setTitle('🧨 Tactical Nuke Incoming 🧨!'))

                    let channel = message.guild.channels.cache.get(message.channel.id)

                    var position = channel.position

                    channel.clone().then((channel2) => {
                        channel2.setPosition(position)

                        channel.delete()

                        channel2.send(nukeE.setColor(message.guild.me.displayColor).setTitle('💥 Nuked Channel Successfully 💥'))
                        channel2.send('https://giphy.com/gifs/80s-akira-oQtO6wKK2q0c8')
                    })
                    break
               
                case "no":
                    message.channel.send(nukeE.setDescription(`**Cancelled**`).setColor('RED'))
                    collector.stop('success')
                    break
                default:
                    message.channel.send(nukeE.setDescription(`**Cancelled**`).setColor('RED'))
                    collector.stop('success')
            }
            collector.stop('success')
        })
        collector.on('end', (ignore, error) => {
            if (error && error !== "success") {
                return message.channel.send(nukeE.setDescription(`**Timed out**`).setColor('RED'))
            };
            collector.stop('success')
        });


    }
}