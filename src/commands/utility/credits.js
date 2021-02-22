const { blacklist } = require('../../utils/utils')
const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const { setCooldown } = require('../../utils/utils')

module.exports = {
    name: "credits",
    category: "Utility",
    aliases: ["cred", 'thanks'],
    description: "Thank you to everyone who helped create this bot",
    usage: "\`PREFIXcredits\`",
    cooldown: 5,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message);
        const Credit = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`Credits`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`**Thank you to everyone who helped create my bot,
            whether it was with suggestions or with code to help me along! Even if your not on here, still thank you for using my bot**`)
            .addField(`Ideas`, `<@!743242732570673284>
            <@!669353507035545610>
            <@!709918645152645192>
            <@!244219148467437568>`, true)
            .addField(`Actual Code`, `<@!244219148467437568> 
            <@!743242732570673284>`, true)
            .addField(`Command Handler`, `<@!277215400696217610>`, true)
            .setFooter(`ZeroErrors owns 40% of the economy commands`)


        message.channel.send(Credit)
    }
}

