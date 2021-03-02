const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
/**
 * @type {import('../../typings.d').Command}
 */


module.exports = {
    name: "guildmulti",
    category: "Utility",
    aliases: ["gmulti", "servermulti", "smulti"],
    usage: "- \`PREFIXguildmulti\` to display the current guild multiplier\n- \`PREFIXguildmulti [amount] [set/remove]\` to set/remove the guild multiplier .",
    description: "Allows you to set and remove the guild multiplier so each message gains more XP, default is 1",
    perms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        let guildLevels = client.guildLevelsCache.get(message.guild.id);
        let guildMultiplier = guildLevels.guildMultiplier;


        const embed = new Discord.MessageEmbed()
            

        if (!args[0]) {
            embed
                .setColor(message.guild.me.displayColor)
                .setTitle('Guild Multiplier')
                .setDescription(guildMultiplier === undefined ? 'The guild multiplier for this server is set to \`1\`' : `The guild multiplier for this server is set to \`${guildMultiplier}\``)
                .setTimestamp()
                
            return message.channel.send(embed)
        }


        const gmulti = args[0]

        if (!gmulti || isNaN(gmulti) || gmulti <= 1) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**Please provide a valid guild multiplier that is greater than 1.**`))


        switch (args[1]) {
            case 'remove':
                if (guildMultiplier !== parseFloat(gmulti)) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The guild multiplier for this server is not \`${parseFloat(gmulti)}\`**`))

                guildLevels = await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { guildMultiplier: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildLevelsCache.set(message.guild.id, guildLevels)

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The guild multiplier for this server is no longer \`${parseFloat(gmulti)}\`**`))
                break;
            case 'set':
                if (guildMultiplier === parseFloat(gmulti)) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The guild multiplier for this server is already \`${parseFloat(gmulti)}\``))

                await client.DBLevels.findByIdAndUpdate(message.guild.id, { $set: { guildMultiplier: parseFloat(gmulti) } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildLevels.guildMultiplier = parseFloat(gmulti)
                client.guildLevelsCache.set(message.guild.id, guildLevels)

                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**The guild multiplier for this server is now \`${parseFloat(gmulti)}\`**`))
                break;
            default:
                message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription(`**${message.author} please check the usage of the command.**`))
                break;
        }
    }
}
