const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

module.exports = {
    name: "avatar",
    category: "Misc",
    aliases: ["a"],
    description: "Displays a users avatar",
    usage: "\`PREFIXavatar\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let targetMember;

        if (!message.mentions.members.first()) {
            targetMember = message.guild.members.cache.get(message.author.id);
        } else {
            targetMember = message.mentions.members.first()
        }

        let avatar = targetMember.user.displayAvatarURL({ size: 4096, dynamic: true });

        const aEmbed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(`${targetMember.user.username}`, targetMember.user.displayAvatarURL())
            .setTitle(`${targetMember.user.username}'s avatar`)
            .setImage(avatar)
        message.channel.send(aEmbed)
    }
}
