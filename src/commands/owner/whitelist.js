const { whitelist } = require('../../utils/utils')
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

module.exports = {
    name: "whitelist",
    category: "Owner",
    aliases: ["wl"],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    hideCommand: true,
    description: "Whitelists a user from the bot",
    usage: "\`PREFIXwhitelist\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        if (message.author.id !== '751606134938402866') {
            const wlno = new Discord.MessageEmbed()
                .setDescription("**You don't have permission to whitelist users**")
            message.channel.send(wlno)
            return;
        }

        const wlcheck = new Discord.MessageEmbed()

        const wluser = message.mentions.users.first()

        if (!wluser) {
            return message.channel.send(wlcheck.setColor(message.guild.me.displayColor).setDescription("**Who should I whitelist?**"))
        }

        whitelist(client, wluser.id)


        const wl = new Discord.MessageEmbed()
            .setDescription("**Whitelisting the user...**")
            .setColor(message.guild.me.displayColor)
        message.channel.send(wl)
    }
}

