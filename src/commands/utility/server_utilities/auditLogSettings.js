const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { paginate } = require('../../../utils/utils')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "logsettings",
    category: "Utility",
    aliases: ["auditlogsettings", 'alsettings', 'als'],
    description: "Allows you to customize audit log settings",
    usage: "- \`PREFIXlogsettings\` to display the server audit log settings\n- \`PREFIXlogsettings [setting] [disable/enable]\` to disable/enable audit log settings.",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    canNotDisable: true,
    ignoreDisabledChannels: true,
    execute: async function (client, message, args) {
        let guildSettings = client.guildSettingsCache.get(message.guild.id);
        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let auditLogChannel = guildSettings.auditLogChannelId

        let guildAudit = client.guildAuditCache.get(message.guild.id)

        let messageDelete = guildAudit.messageDelete
        let messageUpdate = guildAudit.messageUpdate
        let messageDeleteBulk = guildAudit.messageDeleteBulk

        let guildMemberAdd = guildAudit.guildMemberAdd
        let guildMemberRemove = guildAudit.guildMemberRemove
        let guildMemberUpdate = guildAudit.guildMemberUpdate

        let channelCreate = guildAudit.channelCreate
        let channelDelete = guildAudit.channelDelete

        let guildBanAdd = guildAudit.guildBanAdd
        let guildBanRemove = guildAudit.guildBanRemove

        let roleCreate = guildAudit.roleCreate
        let roleDelete = guildAudit.roleDelete
        let roleUpdate = guildAudit.roleUpdate

        let voiceStateUpdate = guildAudit.voiceStateUpdate

        const logE = new Discord.MessageEmbed()

        let loge1 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`Audit Log Settings`)
            .setDescription(`Here is a list of all the audit log settings for the server.  Use the number after the setting to enable/disable it. You can also use \`${guildInfo.prefix}als all [disable/enable]\` to disable/enable all settings`)
            .setThumbnail(message.guild.iconURL())
            .addField(`Deleted Messages \`1\``, `${messageDelete}`)
            .addField(`Edited Messages \`2\``, `${messageUpdate}`)
            .addField(`Bulk Deleted Messages \`3\``, `${messageDeleteBulk}`)
            .addField(`Members That Join \`4\``, `${guildMemberAdd}`)
            .addField(`Members That Leave \`5\``, `${guildMemberRemove}`)
            .addField(`Guild Member Updates \`6\``, `${guildMemberUpdate}`)
            .addField(`Created Channels \`7\``, `${channelCreate}`)

        let loge2 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`Audit Log Settings`)
            .setDescription(`Here is a list of all the audit log settings for the server.  Use the number after the setting to enable/disable it. You can also use \`${guildInfo.prefix}als all [disable/enable]\` to disable/enable all settings`)
            .setThumbnail(message.guild.iconURL())
            .addField(`Deleted Channels \`8\``, `${channelDelete}`)
            .addField(`Banned Members \`9\``, `${guildBanAdd}`)
            .addField(`Unbanned Members \`10\``, `${guildBanRemove}`)
            .addField(`Created Roles \`11\``, `${roleCreate}`)
            .addField(`Deleted Roles \`12\``, `${roleDelete}`)
            .addField(`Updated Roles \`13\``, `${roleUpdate}`)
            .addField(`Updated Voice States \`14\``, `${voiceStateUpdate}`)

        let setting = args[0]

        if (!setting && (auditLogChannel === undefined)) {
            logE
                .setColor(message.guild.me.displayColor)
                .setTitle('Audit Log Settings')
                .setDescription('A audit log channel has not been set up for this server')
            return message.channel.send(logE)
        }

        if (!setting) {
            return paginate(message, [loge1, loge2], { time: 1000 * 30 })
        }

        const setE = new Discord.MessageEmbed()

        if (setting === '1') {
            switch (args[1]) {
                case 'disable':
                    if (messageDelete === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Deleted messages are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { messageDelete: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.messageDelete = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Deleted messages will now not be logged**`))
                    break;
                case 'enable':
                    if (messageDelete === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Deleted messages are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { messageDelete: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.messageDelete = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Deleted messages will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '2') {
            switch (args[1]) {
                case 'disable':
                    if (messageUpdate === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Edited messages are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { messageUpdate: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.messageUpdate = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Edited messages will now not be logged**`))
                    break;
                case 'enable':
                    if (messageUpdate === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Edited messages are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { messageUpdate: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.messageUpdate = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Edited messages will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '3') {
            switch (args[1]) {
                case 'disable':
                    if (messageDeleteBulk === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Bulk deleted messages are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { messageDeleteBulk: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.messageDeleteBulk = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Bulk deleted messages will now not be logged**`))
                    break;
                case 'enable':
                    if (messageDeleteBulk === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Bulk deleted messages are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { messageDeleteBulk: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.messageDeleteBulk = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Bulk deleted messages will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '4') {
            switch (args[1]) {
                case 'disable':
                    if (guildMemberAdd === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Members that join are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildMemberAdd: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildMemberAdd = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Members that join will now not be logged**`))
                    break;
                case 'enable':
                    if (guildMemberAdd === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Members that join are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildMemberAdd: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildMemberAdd = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Members that join will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '5') {
            switch (args[1]) {
                case 'disable':
                    if (guildMemberRemove === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Members that leave are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildMemberRemove: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildMemberRemove = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Members that leave will now not be logged**`))
                    break;
                case 'enable':
                    if (guildMemberRemove === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Members that leave are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildMemberRemove: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildMemberRemove = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Members that leave will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '7') {
            switch (args[1]) {
                case 'disable':
                    if (channelCreate === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Channels that are created are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { channelCreate: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.channelCreate = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Channels that are created will now not be logged**`))
                    break;
                case 'enable':
                    if (channelCreate === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Channels that are created are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { channelCreate: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.channelCreate = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Channels that are created will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '8') {
            switch (args[1]) {
                case 'disable':
                    if (channelDelete === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Channels that are deleted are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { channelDelete: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.channelDelete = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Channels that are deleted will now not be logged**`))
                    break;
                case 'enable':
                    if (channelDelete === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Channels that are deleted are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { channelDelete: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.channelDelete = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Channels that are deleted will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '9') {
            switch (args[1]) {
                case 'disable':
                    if (guildBanAdd === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Banned members are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildBanAdd: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildBanAdd = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Banned members will now not be logged**`))
                    break;
                case 'enable':
                    if (guildBanAdd === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Banned members are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildBanAdd: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildBanAdd = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Banned members will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '10') {
            switch (args[1]) {
                case 'disable':
                    if (guildBanRemove === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Unbanned members are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildBanRemove: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildBanRemove = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Unbanned members will now not be logged**`))
                    break;
                case 'enable':
                    if (guildBanRemove === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Unbanned members are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildBanRemove: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildBanRemove = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Unbanned members will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '11') {
            switch (args[1]) {
                case 'disable':
                    if (roleCreate === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Created roles are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { roleCreate: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.roleCreate = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Created roles will now not be logged**`))
                    break;
                case 'enable':
                    if (roleCreate === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Created roles already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { roleCreate: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.roleCreate = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Created roles will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '12') {
            switch (args[1]) {
                case 'disable':
                    if (roleDelete === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Deleted roles are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { roleDelete: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.roleDelete = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Deleted roles will now not be logged**`))
                    break;
                case 'enable':
                    if (roleDelete === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Deleted roles are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { roleDelete: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.roleDelete = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Deleted roles will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '13') {
            switch (args[1]) {
                case 'disable':
                    if (roleUpdate === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Updated roles are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { roleUpdate: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.roleUpdate = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Updated roles will now not be logged**`))
                    break;
                case 'enable':
                    if (roleUpdate === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Updated roles are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { roleUpdate: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.roleUpdate = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Updated roles will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '14') {
            switch (args[1]) {
                case 'disable':
                    if (voiceStateUpdate === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Voice state updates are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { voiceStateUpdate: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.voiceStateUpdate = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Voice state updates will now not be logged**`))
                    break;
                case 'enable':
                    if (voiceStateUpdate === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Voice state updates are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { voiceStateUpdate: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.voiceStateUpdate = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Voice state updates will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === '6') {
            switch (args[1]) {
                case 'disable':
                    if (guildMemberUpdate === 'Disabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Guild member updates are already not being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildMemberUpdate: 'Disabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildMemberUpdate = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Guild member updates will now not be logged**`))
                    break;
                case 'enable':
                    if (guildMemberUpdate === 'Enabled') return message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Guild member updates are already being logged**`))

                    await client.DBAudit.findByIdAndUpdate(message.guild.id, { $set: { guildMemberUpdate: 'Enabled' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildAudit.guildMemberUpdate = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**Guild member updates will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting === 'all') {
            switch (args[1]) {
                case 'disable':
                    await client.DBAudit.findByIdAndUpdate(
                        message.guild.id, {
                        $set: {
                            voiceStateUpdate: 'Disabled',
                            roleUpdate: 'Disabled',
                            roleDelete: 'Disabled',
                            roleCreate: 'Disabled',
                            guildBanRemove: 'Disabled',
                            guildBanAdd: 'Disabled',
                            channelDelete: 'Disabled',
                            channelCreate: 'Disabled',
                            guildMemberRemove: 'Disabled',
                            guildMemberAdd: 'Disabled',
                            messageDeleteBulk: 'Disabled',
                            messageUpdate: 'Disabled',
                            messageDelete: 'Disabled',
                            guildMemberUpdate: 'Disabled'
                        }
                    }, {
                        new: true, upsert: true, setDefaultsOnInsert: true
                    })
                    guildAudit.voiceStateUpdate = 'Disabled'
                    guildAudit.roleUpdate = 'Disabled'
                    guildAudit.roleDelete = 'Disabled'
                    guildAudit.roleCreate = 'Disabled'
                    guildAudit.guildBanRemove = 'Disabled'
                    guildAudit.guildBanAdd = 'Disabled'
                    guildAudit.channelDelete = 'Disabled'
                    guildAudit.channelCreate = 'Disabled'
                    guildAudit.guildMemberRemove = 'Disabled'
                    guildAudit.guildMemberAdd = 'Disabled'
                    guildAudit.messageDeleteBulk = 'Disabled'
                    guildAudit.messageDelete = 'Disabled'
                    guildAudit.messageUpdate = 'Disabled'
                    guildAudit.guildMemberUpdate = 'Disabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**All settings will now not be logged**`))
                    break;
                case 'enable':
                    await client.DBAudit.findByIdAndUpdate(
                        message.guild.id, {
                        $set: {
                            voiceStateUpdate: 'Enabled',
                            roleUpdate: 'Enabled',
                            roleDelete: 'Enabled',
                            roleCreate: 'Enabled',
                            guildBanRemove: 'Enabled',
                            guildBanAdd: 'Enabled',
                            channelDelete: 'Enabled',
                            channelCreate: 'Enabled',
                            guildMemberRemove: 'Enabled',
                            guildMemberAdd: 'Enabled',
                            messageDeleteBulk: 'Enabled',
                            messageUpdate: 'Enabled',
                            messageDelete: 'Enabled',
                            guildMemberUpdate: 'Enabled'
                        }
                    }, {
                        new: true, upsert: true, setDefaultsOnInsert: true
                    })
                    guildAudit.voiceStateUpdate = 'Enabled'
                    guildAudit.roleUpdate = 'Enabled'
                    guildAudit.roleDelete = 'Enabled'
                    guildAudit.roleCreate = 'Enabled'
                    guildAudit.guildBanRemove = 'Enabled'
                    guildAudit.guildBanAdd = 'Enabled'
                    guildAudit.channelDelete = 'Enabled'
                    guildAudit.channelCreate = 'Enabled'
                    guildAudit.guildMemberRemove = 'Enabled'
                    guildAudit.guildMemberAdd = 'Enabled'
                    guildAudit.messageDeleteBulk = 'Enabled'
                    guildAudit.messageDelete = 'Enabled'
                    guildAudit.messageUpdate = 'Enabled'
                    guildAudit.guildMemberUpdate = 'Enabled'
                    client.guildAuditCache.set(message.guild.id, guildAudit)

                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**All settings will now be logged**`))
                    break;
                default:
                    message.channel.send(setE.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        }



    }
}
