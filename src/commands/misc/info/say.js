const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor



module.exports = {
    name: "say",
    category: "Misc",
    description: "I will say whatever you want",
    usage: "\`PREFIXsay\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const no = new Discord.MessageEmbed()

        if (message.author.id !== `751606134938402866`) {
            return message.channel.send(no.setColor(message.guild.me.displayColor).setTitle('sike you thought'))
        }
        const say = args.join(" ")

        message.delete()
        message.channel.send(say)
    }
}