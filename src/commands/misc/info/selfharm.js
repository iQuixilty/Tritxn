const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')


module.exports = {
    name: "selfharm",
    category: "Misc",
    aliases: ["sf"],
    description: "Don't do it",
    usage: "\`PREFIXselfharm\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const sf = new Discord.MessageEmbed()
            .setAuthor("Suicide and Self-Harm Prevention")
            .setTitle("We want you to know you are never alone.")
            .setColor(message.guild.me.displayColor)
            .setThumbnail('https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif')
            .setDescription(`**__Suicide/Self-Harm Immediate 24/7 Hotlines:__** \n[USA Suicide Hotline](https://suicidepreventionlifeline.org/) \nPhone Number : 1-800-273-8255 \n\n[International Suicide Hotlines](https://www.opencounseling.com/suicide-hotlines) \nThese hotlines are made available to those that do not reside in the United States currently. Look up the number on the list that correlates to your residency and call it. It will connect you to your country's suicide hotline.`)
        message.channel.send(sf)
    }
}