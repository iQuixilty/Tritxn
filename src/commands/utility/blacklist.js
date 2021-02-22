const { blacklist } = require('../../utils/utils')
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "blacklist",
    category: "Misc",
    aliases: ["bl"],
    ignoreDisabledChannels: true,
    canNotDisable: true,
    hideCommand: true,
    description: "Blacklists a user from the bot",
    usage: "\`PREFIXblacklist\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        if (message.author.id !== '751606134938402866') {
            const blno = new Discord.MessageEmbed()
                .setDescription("**You don't have permission to blacklist users**")
            message.channel.send(blno)
            return;
        }

        const blcheck = new Discord.MessageEmbed()

        const bluser = message.mentions.users.first()

        if (!bluser) {
            return message.channel.send(blcheck.setColor(message.guild.me.displayColor).setDescription("**Who should I blacklist?**"))
        }
        
        blacklist(client, bluser.id)


        const bl = new Discord.MessageEmbed()
            .setDescription("**Blacklisting the user...**")
            .setColor(message.guild.me.displayColor)
        message.channel.send(bl)
    }
}

