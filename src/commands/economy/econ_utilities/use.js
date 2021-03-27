const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const economy = require('../../../../schemas/economy')
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "use",
    category: "Economy",
    description: "Uses an item in your inventory",
    usage: "\`PREFIXuse [item]\`",
    cooldown: 5,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const Use = new Discord.MessageEmbed()

        item = args[0]
        let userId = message.author.id

        let guildInfo = client.guildInfoCache.get(message.guild.id)
        let guildPrefix = guildInfo.prefix


        if (!item) {
            message.channel.send(Use
                .setColor(message.guild.me.displayColor)
                .setDescription(`**What are you trying to use?**`))
            return;
        }

        setCooldown(client, this, message);

        let defaultUse = async (itemIndex, itemName, useWord) => {
            const userItem = await economy.getInv(userId, itemIndex)

            if (!userItem) {
                message.channel.send(Use.setColor(message.guild.me.displayColor).setDescription(`**You don't have any ${itemName}s and you need to do \`${guildPrefix}${useWord}\` to use this item.**`))
                return;
            } else {
                message.channel.send(Use
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**Do \`${guildPrefix}${useWord}\` to use this item**`))
            }
        }

        if (item === 'trident' || item === 'trid') {
            const Trid = await economy.getInv(userId, 'trident')

            if (!Trid) {
                message.channel.send(Use.setColor(message.guild.me.displayColor).setDescription(`**${message.author}, you don't have a trident, aka your poor**`))
                return;
            } else {
                message.channel.send(Use
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${message.author} flexes on you with his TRIDENT!**`))
            }

        } else if (item === 'pole' || item === 'rod' || item === 'fishingpole' || item === 'fishingrod') {
            defaultUse('fishingRod', 'fishing rod', 'fish')

        } else if (item === 'pick' || item === 'axe' || item === 'pickaxe') {
            defaultUse('pickaxe', 'pickaxe', 'mine')

        } else if (item === 'gun' || item === 'rifle' || item === 'huntingrifle') {
            defaultUse('rifle', 'rifle', 'hunt')

        } else {
            message.channel.send(Use
                .setColor(message.guild.me.displayColor)
                .setDescription(`**Either you can't use this item or it doesnt exist!**`))
        }

    }
}