const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const validateFlag = f => f === 'true' || f === 'false' || f === 'null'

module.exports = {
    name: "lock",
    ignoreDisabledChannels: true,
    category: "Moderation",
    description: "Locks the server down",
    usage: "\`PREFIXlock [roleID] [true | false | null]\` Use true to put the server in lockdown and false to remove it from lockdown.",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],

    execute: async function (client, message, args) {

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        const LOCK = new Discord.MessageEmbed()

        if (args.length < 2) {
            return message.channel.send(LOCK.setColor((message.guild.me.displayColor)).setDescription(`**Usage: ${guildInfo.prefix}lock [roleID] [true | false | null]**`))
        }

        let roleId = args[0]
        let flag = args[1]
        let reason = args.slice(2).join(" ")

        if (!reason) {
            reason = "No reason given"
        }

        let guildSettings = client.guildSettingsCache.get(message.guild.id);
        let ignoredChannelSetting = guildSettings.ignoredChannelSetting


        if (ignoredChannelSetting.length === 0) {
            return message.channel.send(LOCK.setColor(message.guild.me.displayColor).setDescription(`**Add some channels to ignore so permissions aren't messed up**`))
        }

        const d = await message.channel.send(LOCK.setColor(message.guild.me.displayColor).setDescription(`**Are you sure you want to lock / unlock the server?**`))
        await d.react('✅')
        await d.react('⛔')

        const filter = (reaction, user) => ['✅', '⛔'].includes(reaction.emoji.name) && user.id === message.author.id
        const response = await d.awaitReactions(filter, {
            max: 1,
            time: 8.64e+7
        });
        if (!response.size) {
            return undefined;
        }
        const emoji = response.first().emoji.name;

        if (emoji === '✅') {
            d.reactions.removeAll()
            if (!isNaN(roleId) && validateFlag(flag.toLowerCase())) {
                flag = flag.toLowerCase() === 'true' ? true : (flag.toLowerCase() === 'false' ? false : null)
                d.edit(LOCK
                    .setColor((message.guild.me.displayColor))
                    .setTitle(`${flag ? `Server lock has been enabled 🔒` : `Server lock has been disabled 🔓`}`)
                    .setThumbnail(client.user.avatarURL())
                    .setDescription(`${flag ? `This server has been locked! No, you have not been muted.` : `This server has been unlocked!`}`)
                    .addField('Reason:', `${reason}`)
                    .addField('Responsible Moderator:', `${message.author}`)
                    .setFooter(`${flag ? `This server has been locked for a reason. Please do not DM staff regarding the lockdown.` : `Feel free to use the server and remember to always follow the rules!`}`))
                const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');

                channels.forEach(channel => {
                    if (!ignoredChannelSetting.includes(channel.id)) {
                        channel.updateOverwrite(roleId, {
                            SEND_MESSAGES: !flag
                        }).then(g => {
                            if (flag) {
                                if (!g.name.endsWith('🔒')) {
                                    g.edit({ name: g.name + ' 🔒' })
                                }
                            } else {
                                g.edit({ name: g.name.replace(/\s*🔒/, '') });
                            }
                        })
                            .catch(err => console.log(err))
                    } else {
                        // console.log(`Skipping ${channel.name} (${channel.id})`);
                    }
                })
            }
            else {
                message.channel.send(LOCK.setColor((message.guild.me.displayColor)).setTitle("Invalid Role."))
            }
        }
        if (emoji === '⛔') {
            d.reactions.removeAll()
            d.edit(LOCK.setColor(message.guild.me.displayColor).setDescription("**Ok nevermind**"))
        }
    }
}