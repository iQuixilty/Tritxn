const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
const canvacord = require('canvacord')
const { setCooldown } = require('../../utils/utils')

/**
 * @type {import('../../typings.d').Command}
 */

//https://cdn.discordapp.com/attachments/800789365411938335/816827131858124841/images.png <-- Black
//https://cdn.discordapp.com/attachments/800789365411938335/817123660845809664/images.png <-- Red
//https://cdn.discordapp.com/attachments/800789365411938335/817124024235720704/4686795.png <-- Blue
//https://cdn.discordapp.com/attachments/800789365411938335/817125127389052999/video-games-firewatch-wood-wallpaper-preview.png <-- Green

module.exports = {
    name: "rank",
    category: "Levels",
    aliases: ["r"],
    description: "Displays what rank you are",
    usage: "\`PREFIXrank [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const embed = new Discord.MessageEmbed()

        let target = args[0]

        if (!target) {
            target = message.guild.members.cache.get(message.author.id);
        } else {
            target = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        }
        setCooldown(client, this, message)

        const user = await Levels.fetch(target.id, message.guild.id, true);

        if (!user) return message.channel.send(embed.setColor(message.guild.me.displayColor).setDescription("**This user has not amassed any XP yet.**"));

        const neededXp = Levels.xpFor(parseInt(user.level) + 1)

        const rank = new canvacord.Rank()
            .setAvatar(target.user.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp)
            .setLevel(user.level)
            .setRequiredXP(neededXp)
            .setProgressBar(message.guild.me.displayHexColor, "COLOR")
            .setUsername(target.user.username)
            .setDiscriminator(target.user.discriminator)
            .setRank(user.position)
            .setCustomStatusColor('#000000')
            .setBackground('IMAGE', `https://cdn.discordapp.com/attachments/800789365411938335/816827131858124841/images.png`)
        rank.build()
            .then(data => {
                const attachment = new Discord.MessageAttachment(data, 'rank.png')
                message.channel.send(attachment)
            })


    }
}