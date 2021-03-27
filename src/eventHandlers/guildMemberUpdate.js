const { MessageEmbed } = require('discord.js');
const { getGuildInfo, getGuildAudit, getGuildLevels, getGuildSettings } = require("../utils/utils")

/**
 * @param {import('../typings.d').myClient} client 
 * @param {import('discord.js').GuildMember} oldMember 
 */

module.exports = async (client, oldMember, newMember) => {
    memberUpdate(client, oldMember, newMember)
}

const memberUpdate = async (client, oldMember, newMember) => {
    const result = await getGuildSettings(client, oldMember.guild.id)
    if (!result) return;

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await getGuildAudit(client, oldMember.guild.id)
    if (!guildAudit) return

    if (auditLogChannel === undefined) return;
    if (guildAudit.guildMemberUpdate === undefined || guildAudit.guildMemberUpdate === 'Disabled') return;


    if (oldMember.nickname !== newMember.nickname || oldMember._roles.length !== newMember._roles.length) {
        const Channel = oldMember.client.channels.cache.get(auditLogChannel)
        const auditE = new MessageEmbed()
            .setColor('BLACK')
            .setAuthor(`Member Was Updated`, newMember.guild.iconURL())
            .addField(`Member Updated`, `${newMember} \`${newMember.id}\``)
            .setFooter(`Member ID: ${newMember.id}`)
            .setTimestamp()

        if (oldMember.nickname !== newMember.nickname) {
            auditE
                .addField(`Old Nickname`, `\`${oldMember.nickname === null ? `${oldMember.user.username}` : `${oldMember.nickname}`}\``)
                .addField(`New Nickname`, `\`${newMember.nickname === null ? `${newMember.user.username}` : `${newMember.nickname}`}\``)
        }

        if (oldMember._roles.length !== newMember._roles.length) {
            if (oldMember._roles.length > newMember._roles.length) {
                let difference = oldMember._roles.filter(x => newMember._roles.indexOf(x) === -1);

                auditE.addField(`Role Removed`, `<@&${difference}> \`${difference}\``)
            } else {
                let sum = newMember._roles.filter(x => oldMember._roles.indexOf(x) === -1);

                auditE.addField(`Role Added`, `<@&${sum}> \`${sum}\``)

            }
        }

        Channel.send(auditE)
    } else {
        return;
    }
}