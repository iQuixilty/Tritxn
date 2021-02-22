const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "invite",
    category: "Utility",
    description: "Generates a link for you to invite the bot to your server",
    usage: "\`PREFIXinvite\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed5 = new Discord.MessageEmbed()
                .setTitle(`Invite Tritxn!`)
                .setDescription(`To invite me to your server, click [here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`)
                .setColor(message.guild.me.displayColor)
                .setFooter('Developer - Qzxy#0001', message.author.displayAvatarURL());
            message.channel.send(embed5)
    }
}