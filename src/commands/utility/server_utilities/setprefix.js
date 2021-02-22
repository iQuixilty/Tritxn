const prefixRegExp = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{1,15}$/
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "setprefix",
    category: "Utility",
    aliases: ["sp"],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    description: "Set a new prefix for your server.",
    usage: "\`PREFIXsetprefix [newprefix]\`",
    perms: ['ADMINISTRATOR'],
    arguments: [
        {
            type: 'SOMETHING',
            prompt: 'Please enter a new prefix to use!'
        }
    ],
    clientPerms: ['SEND_MESSAGES'],

    execute: async function (client, message, args) {
        if (!prefixRegExp.test(args[0])) return message.channel.send(`${message.author.username}, that prefix doesn't follow the rules. Please try again.`)

        const guildInfo = client.guildInfoCache.get(message.guild.id)
        if (guildInfo.prefix === args[0]) return message.channel.send(`${message.author.username}, please make sure to enter a new prefix.`)

        setCooldown(client, this, message);
        await client.DBGuild.findByIdAndUpdate(message.guild.id, { $set: { prefix: args[0] } }, { new: true, upsert: true, setDefaultsOnInsert: true });
        guildInfo.prefix = args[0]
        client.guildInfoCache.set(message.guild.id, guildInfo)

        const newPref = new Discord.MessageEmbed()

        message.channel.send(newPref.setColor(message.guild.me.displayColor).setTitle(`${message.author.username}, the new prefix is: \`${args[0]}\``))
    }
}
