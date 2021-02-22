const { MessageEmbed } = require('discord.js');


module.exports = async (client, oldMember, newMember) => {

    const result = await client.DBSettings.findOne({ _id: oldMember.guild.id })

    let auditLogChannel = result.auditLogChannelId

    const guildAudit = await client.DBAudit.findOne({ _id: oldMember.guild.id })

    if (auditLogChannel === undefined) return;
    if (guildAudit.guildMemberUpdate === undefined || guildAudit.guildMemberUpdate === 'Disabled') return;

    // console.log(oldMember._roles)
    // console.log(newMember._roles)


    if (oldMember.user.discriminator !== newMember.user.discriminator || oldMember.user.avatar !== newMember.user.avatar) return;

    const Channel = client.channels.cache.get(auditLogChannel)
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

}