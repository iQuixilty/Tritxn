const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor



module.exports = {
    name: "embed",
    category: "Misc",
    aliases: ["em"],
    description: "Generates a custom embed for you to use",
    usage: "\`PREFIXembed\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setDescription("What's the title for this embed?")).then(msg => { msg.delete({ timeout: 20000 }) }).then(msg2 => {
                    let Title = message.channel.createMessageCollector(t => t.author.id === message.author.id, { max: 1 })
                        .on('collect', t => {
                            let title = t.content


                            message.channel.send(
                                new Discord.MessageEmbed()
                                    .setColor(message.guild.me.displayColor)
                                    .setDescription("Give me a description")).then(msg => { msg.delete({ timeout: 20000 }) }).then(msg3 => {
                                        let description = message.channel.createMessageCollector(d => d.author.id === message.author.id, { max: 1 })
                                            .on('collect', d => {
                                                let desc = d.content

                                                const embed = new Discord.MessageEmbed()
                                                    .setTitle(title)
                                                    .setDescription(`${desc}`)
                                                    .setFooter(`Created by: ${message.author.username}`, message.guild.iconURL())
                                                    .setColor(message.guild.me.displayColor)
                                                message.channel.send(embed)

                                            })
                                    })
                        })
                })
    }
}