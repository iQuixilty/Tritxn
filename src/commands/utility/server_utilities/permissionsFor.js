const Discord = require('discord.js')

const yes = '✔️'
const no = '❌'
const x = "```"
const s = '📛'
const c = '♨️'

const permissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
]


/**
 * @type {import('../../../typings.d').Command}
 */

module.exports = {
    name: "permissionsfor",
    category: "Utility",
    aliases: ['permsfor', 'pf'],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    perms: ['MANAGE_GUILD'],
    description: "Allows you to view permissions for a user in the server and channel",
    usage: "- \`PREFIXpermissionsfor [user]\` to display all permissions",

    execute: async function (client, message, args) {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let userId = user.user.id

        let description = `Server - ${s}\nCurrent channel - ${c}\n\n${s} | ${c}\n`

        let embed = new Discord.MessageEmbed()
            .setTitle(`${user.user.username}'s Permissions`)
            .setColor(user.displayColor)

        permissions.forEach(perm => {
            description += `${user.permissions.has(perm) ? yes : no} | ${message.channel.permissionsFor(userId).has(perm) ? yes : no} - ${perm.replace('CREATE_INSTANT_INVITE', 'Create Invite').replace('KICK_MEMBERS', 'Kick Members').replace('BAN_MEMBERS', 'Ban Members').replace('ADMINISTRATOR', 'Administrator').replace('MANAGE_CHANNELS', 'Manage Channels').replace('MANAGE_GUILD', 'Manage Guild').replace('ADD_REACTIONS', 'Add Reactions').replace('VIEW_AUDIT_LOG', 'View Audit Log').replace('PRIORITY_SPEAKER', 'Priority Speaker').replace('STREAM', 'Stream').replace('VIEW_CHANNEL', 'View Channel').replace('SEND_MESSAGES', 'Send Messages').replace('SEND_TTS_MESSAGES', 'Send TTS Messages').replace('MANAGE_MESSAGES', 'Manage Messages').replace('EMBED_LINKS', 'Embed Links').replace('ATTACH_FILES', 'Attach Files').replace('READ_MESSAGE_HISTORY', 'Read Message History').replace('MENTION_EVERYONE', 'Mention Everyone').replace('USE_EXTERNAL_EMOJIS', 'Use External Emojis').replace('VIEW_GUILD_INSIGHTS', 'View Guild Insights').replace('CONNECT', 'Connect').replace('SPEAK', 'Speak').replace('MUTE_MEMBERS', 'Mute Members').replace('DEAFEN_MEMBERS', 'Defean Members').replace('MOVE_MEMBERS', 'Move Members').replace('USE_VAD', 'Use VAD').replace('CHANGE_NICKNAME', 'Change Nickname').replace('MANAGE_NICKNAMES', 'Manage Nicknames').replace('MANAGE_ROLES', 'Manage Roles').replace('MANAGE_WEBHOOKS', 'Manage Webhooks').replace('MANAGE_EMOJIS', 'Manage Emojis')}\n`
        })
        embed.setDescription(x + description + x)

        const msg = await message.channel.send(embed)
        msg.react('🗑')

        let react;

        try {
            react = await msg.awaitReactions(
                (reaction, user) => reaction.emoji.name === `🗑` && user.id === message.author.id,
                { max: 1, time: 1000 * 15, errors: ['time'] }
            )
        } catch (error) {
            msg.reactions.removeAll();
        }

        if (react && react.first()) {
            msg.delete()
        }

        return message;
    }
}