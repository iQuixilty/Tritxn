const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')


module.exports = {
    name: "say",
    category: "Misc",
    description: "I will say whatever you want",
    usage: "\`PREFIXsay\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const no = new Discord.MessageEmbed()

        let users = [`751606134938402866`, `713897845412855828`, `478605759542722570`]

        if (!users.includes(message.author.id)) {
            return message.channel.send(no.setColor(message.guild.me.displayColor).setDescription('**sike you thought**'))
        }
        const say = args.join(" ")
        if (!say) return;

        message.delete()
        message.channel.send(say)
    }
}