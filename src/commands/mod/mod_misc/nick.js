const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const emoji = require('../../../../config/emoji.json')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "nick",
    aliases: ['nickname', 'setnick'],
    category: "Moderation",
    description: "Nickname any users in your server that doesn't have a role higher than the bots.  The bot will need to be able to change nicknames for this command to be run.",
    usage: "\`PREFIXnick [user] [new name]\`",
    perms: ['MANAGE_NICKNAMES'],
    clientPerms: ['SEND_MESSAGES', 'MANAGE_NICKNAMES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const nicks = new Discord.MessageEmbed();

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!member) {
            message.channel.send(nicks
                .setColor('RED')
                .setDescription(`**${emoji.downvote} ${message.author} please provide a user**`));
            return;
        }
        var nickname = args.slice(1).join(' ');

        if (nickname === '') {
            message.channel.send(nicks
                .setColor('RED')
                .setDescription(`**${emoji.downvote} ${message.author} please provide a nickname**`))
                return;
        }

        if (nickname.length > 32) {
            message.channel.send(nicks
                .setColor('RED')
                .setDescription(`**${emoji.downvote} ${message.author} please provide a nickname less than 32 characters**`));
            return;
        }
        
        let userHighestRole = message.member.roles.highest;
        let memberHighestRole = message.mentions.members.first().roles.highest

        if (memberHighestRole.position >= userHighestRole.position || message.guild.me.roles.highest <= memberHighestRole) {
            return message.channel.send(nicks
                .setColor('RED')
                .setDescription(`**${emoji.downvote} ${message.author} you cant nick someone with a role higher or equal to you**`));
        }


       member.setNickname(nickname);
        message.channel.send(nicks
            .setColor('GREEN')
            .setDescription(`**${emoji.upvote} Successfully changed ${member.user.username}'s nickname to \`${nickname}\`**`));
    }
}
