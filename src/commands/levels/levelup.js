const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')


/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "levelup",
    category: "Levels",
    aliases: ["lvlup", "ann"],
    description: "Customize the levelup settings for your server",
    usage: "- \`PREFIXlevelup\` to view server level up settings\n- \`PREFIXlevelup [notifs / type/ ping] [option]\` to change server level up settings",
    examples: "- \`PREFIXlevelup [notifs / ping] [true / false]\` \n- \`PREFIXlevelup type [DM / #channel / off]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()
        let guildLevels = client.guildLevelsCache.get(message.guild.id)
        let levelUpNotifs = guildLevels.levelUp
        let levelUpDisplay = guildLevels.levelUpType
        let levelUpPings = guildLevels.levelUpPings

        let setting = args[0]


        if (!setting) {
            return message.channel.send(embed
                .setColor(message.guild.me.displayColor)
                .setThumbnail(message.guild.iconURL())
                .setAuthor(`Level Up Settings Overview For ${message.guild.name}`)
                .addField(`Level Up Notifications`, `${guildLevels.levelUp === undefined ? '\`Disabled\`' : '\`Enabled\`'}`)
                .addField(`Level Up Display`, levelUpDisplay === undefined ? '\`Off\`' : levelUpDisplay === 'DM' ? `\`DM\`` : `<#${guildLevels.levelUpType}>`)
                .addField(`Level Up Pings`, `${guildLevels.levelUpPings === undefined ? '\`Off\`' : '\`On\`'}`))
        }


        if (setting.toLowerCase() === 'notifications' || setting.toLowerCase() === 'notifs') {
            switch (args[1]) {
                case 'true':
                    if (levelUpNotifs === true) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifcations are already enabled**`))

                    await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { levelUp: true } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildLevels.levelUp = true
                    client.guildLevelsCache.set(message.guild.id, guildLevels)

                    message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifications are now enabled**`))
                    break;
                case 'false':
                    if (levelUpNotifs === undefined) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifications are already disabled**`))

                    guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $unset: { levelUpPings: false } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $unset: { levelUpType: 'Off' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $unset: { levelUp } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    client.guildLevelsCache.set(message.guild.id, guildLevels)

                    message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifications are now disabled**`))
                    break;
                default:
                    message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else if (setting.toLowerCase() === 'display' || setting.toLowerCase() === 'type') {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])

            if (channel) {
                if (levelUpDisplay === channel.id) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifcations are already set to ${channel}**`))

                await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { levelUp: true } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels.levelUp = true
                await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { levelUpType: channel.id } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels.levelUpType = channel.id
                client.guildLevelsCache.set(message.guild.id, guildLevels)

                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifications are now set to ${channel}**`))

            } else if (args[1].toLowerCase() === 'dm') {
                if (levelUpDisplay === 'DM') return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifcations are already set to DMs**`))

                await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { levelUp: true } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels.levelUp = true
                await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { levelUpType: 'DM' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels.levelUpType = 'DM'
                client.guildLevelsCache.set(message.guild.id, guildLevels)

                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifications are now set to DMs**`))

            } else if (args[1].toLowerCase() === 'off') {
                if (levelUpDisplay === 'Off') return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifcations are already disabled**`))

                guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $unset: { levelUpType: 'Off' } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $unset: { levelUp: false } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $unset: { levelUpPings: false } }, { new: true, upsert: true, setDefaultsOnInsert: true })

                client.guildLevelsCache.set(message.guild.id, guildLevels)

                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up notifications are now disabled**`))

            } else {
                return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
            }


        } else if (setting.toLowerCase() === 'ping' || setting.toLowerCase() === 'pings') {
            switch (args[1]) {
                case 'true':
                    if (levelUpPings === true) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up pings are already enabled**`))

                    await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { levelUp: true } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildLevels.levelUp = true
                    await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { levelUpPings: true } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                    guildLevels.levelUpPings = true
                    client.guildLevelsCache.set(message.guild.id, guildLevels)

                    message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up pings are now enabled**`))
                    break;
                case 'false':
                    if (levelUpPings === undefined) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up pings are already disabled**`))

                    guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $unset: { levelUpPings } }, { new: true, upsert: true, setDefaultsOnInsert: true })


                    client.guildLevelsCache.set(message.guild.id, guildLevels)

                    message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Level up pings are now disabled**`))
                    break;
                default:
                    message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                    break;
            }
        } else {
            return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
        }

    }
}