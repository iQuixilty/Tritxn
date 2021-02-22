const { MessageEmbed, DiscordAPIError } = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

/** 
 * @type {import('../../../typings.d').Command}
*/


module.exports = {
    name: "words",
    category: "Utility",
    aliases: ["blword", 'blacklistword', 'blw'],
    usage: "- \`PREFIXwords\` to display all currently blacklisted words\n- \`PREFIXwords [blacklist/whitelist] [word/phrase]\` to blacklist/whitelist words.",
    canNotDisable: true,
    ignoreDisabledChannels: true,
    description: "Allows you to view, blacklist and whitelist words so that if they are used in your server, the message will be deleted",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {
        let guildInfo = client.guildInfoCache.get(message.guild.id);
        let disabledWords = guildInfo.disabledWords;
        

        const wordsEmbed = new MessageEmbed()
            .setTimestamp()

        if (!args[0]) {
            wordsEmbed
                .setColor(message.guild.me.displayColor)
                .setTitle('Blacklisted Words')
                .setDescription(disabledWords.length === 0 ? 'There are no blacklisted words in this server!' : '\`' + disabledWords.join('\`, \`') + '\`')

            return message.channel.send(wordsEmbed)
        }

    

        const setting = args[0]
        let words = args.slice(1).join(' ')
     

        setCooldown(client, this, message);
        switch (setting) {
            case 'blacklist':
                if (disabledWords.includes(words)) return message.channel.send(wordsEmbed.setColor(message.guild.me.displayColor).setDescription(`**The word(s) \`${words.toLowerCase()}\` is already blacklisted.**`))

                await client.DBGuild.findByIdAndUpdate(message.guild.id, { $push: { disabledWords: words.toLowerCase() } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                guildInfo.disabledWords.push(words)
                client.guildInfoCache.set(message.guild.id, guildInfo)

                message.channel.send(wordsEmbed.setColor(message.guild.me.displayColor).setDescription(`**The word(s) \`${words.toLowerCase()}\` has been blacklisted.**`))
                break;
            case 'whitelist':
                if (!disabledWords.includes(words)) return message.channel.send(wordsEmbed.setColor(message.guild.me.displayColor).setDescription(`**The word(s) \`${words.toLowerCase()}\` is already whitelisted.**`))

                guildInfo = await client.DBGuild.findByIdAndUpdate(message.guild.id, { $pull: { disabledWords: words.toLowerCase() } }, { new: true, upsert: true, setDefaultsOnInsert: true })
                client.guildInfoCache.set(message.guild.id, guildInfo)

                message.channel.send(wordsEmbed.setColor(message.guild.me.displayColor).setDescription(`**The word(s) \`${words.toLowerCase()}\` has been whitelisted.**`))
                break;
            default:
                message.channel.send(wordsEmbed.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, please check the usage of the command.**`))
                break;
        }
    }
}
