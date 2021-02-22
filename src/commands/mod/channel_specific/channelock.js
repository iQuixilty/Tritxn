const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const cvalidateFlag = f => f === 'true' || f === 'false' || f === 'null'

/** 
 * @type {import('../../../typings.d').Command}
*/


module.exports = {
    name: "channellock",
    category: "Moderation",
    aliases: ["cl"],
    description: "Locks down a channel with the given role. Use true to put the channel in lockdown and false to remove it from lockdown.  If no channel is specified, it will default to the channel the message was sent in",
    ignoreDisabledChannels: true,
    usage: "\`PREFIXchannellock | [role] | [true | false | null] | #channel | [reason]\`",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADMINISTRATOR'],

    execute: async function (client, message, args) {

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        const LOCKC = new Discord.MessageEmbed()

        let msg = message.content.slice(guildInfo.prefix.length)
        msg = msg.split(' | ')
     
        if (msg.length < 3) {
            return message.channel.send(LOCKC.setColor('RED').setDescription(`**Usage: \`${guildInfo.prefix}cl | [roleID | everyone] | [true | false | null] | #channel | [reason]\`**`))
        }

        let RoleId = msg[1]

        if (isNaN(RoleId)) {
            if (RoleId === 'everyone' || RoleId === 'every1' || RoleId === 'all') {
                RoleId = message.guild.roles.everyone.id
            } else {
                let role = message.guild.roles.cache.find(r => r.name === RoleId);

                if (!role) {
                    return message.channel.send(LOCKC.setColor(message.guild.me.displayColor).setDescription(`**The supplied role is invalid or does not exist**`))
                }

                RoleId = role.id
            }
        } else {
            let role = message.guild.roles.cache.find(r => r.id === RoleId);
            if (!role) {
                return message.channel.send(LOCKC.setColor(message.guild.me.displayColor).setDescription(`**The supplied role is invalid or does not exist**`))
            }
        }

        let Flag = msg[2]

        let lockedChannel = message.mentions.channels.first()

        let reason;

        if (!lockedChannel) {
            lockedChannel = message.channel
            reason = msg.slice(3).join(" ")
        } else {
            reason = msg.slice(4).join(" ")
        }

        if (!reason) {
            reason = "No reason given"
        }



        if (!isNaN(RoleId) && cvalidateFlag(Flag.toLowerCase())) {

            const rolePermissions = lockedChannel.permissionsFor(RoleId).has('SEND_MESSAGES')

            Flag = Flag.toLowerCase() === 'true' ? true : (Flag.toLowerCase() === 'false' ? false : null)


            if (rolePermissions !== Flag) {
                return message.channel.send(LOCKC.setColor(message.guild.me.displayColor).setDescription(`**This channel is ${Flag ? `already locked` : `not unlocked`} right now**`))
            }

            lockedChannel.send(LOCKC.setColor(message.guild.me.displayColor).setTitle(`Channel ${Flag ? `Locked` : `Unlocked`}`).setThumbnail(client.user.avatarURL())
                .setDescription(`${Flag ? `This channel has been locked for the <@&${RoleId}> role by a staff member, no one can send messages` : `This channel has been unlocked for the <@&${RoleId}> role by a staff member, you can now send messages`}`)
                .addField(`${Flag ? `Locked By:` : `Unlocked By:`}`, message.author)
                .addField(`Reason`, reason))

            lockedChannel.updateOverwrite(RoleId, {
                SEND_MESSAGES: !Flag,
                ADD_REACTIONS: !Flag
            })

        } 
    }
}