const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor
const {setCooldown} = require('../../../utils/utils')


module.exports = {
    name: "ping",
    category: "Misc",
    aliases: ["pong"],
    description: "Get the bots and API ping",
    usage: "\`PREFIXping\`",
    clientPerms: ['SEND_MESSAGES'],
    
    execute: async function(client, message, args) {
        const pingE = new Discord.MessageEmbed()
        setCooldown(client, this, message)

        const msg = await message.channel.send(pingE.setColor(message.guild.me.displayColor).setAuthor(`🏓・Pong!`))
    
        await msg.edit(pingE.setColor(message.guild.me.displayColor).setAuthor(`🏓・Pong!`)
        .addField('Bot:', `\`${msg.createdTimestamp - message.createdTimestamp}\``, true)
        .addField('API:', `\`${client.ws.ping}\``, true))
        
    }
}
