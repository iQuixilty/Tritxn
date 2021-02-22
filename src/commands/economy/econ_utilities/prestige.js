const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')
const Emoji = require('../../../../config/emoji.json')

const profileSchema = require('../../../../schemas/economy-schema')
const { setCooldown } = require('../../../utils/utils')

/**
 * @type {import('../../../typings.d').Command}
 */

module.exports = {
    name: "prestige",
    category: "Economy",
    aliases: ["pres"],
    cooldown: 1000 * 60 * 60 * 24 * 3,
    canNotSetCooldown: true,
    description: "Allows you to prestige to the next level",
    usage: "\`PREFIXprestige [level]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        const prest = new Discord.MessageEmbed()

        let userId = message.author.id

        let levelTP = args[0]

        if (isNaN(levelTP)) {
            return message.channel.send(prest
                .setColor(message.guild.me.displayColor)
                .setTitle('Invalid Prestige Level')
                .setDescription(`**${message.author} the level you want to prestige to must be a number\n\nOptions: \`1\`,\`2\`,\`3\`**`))
        }
        const level = await economy.getInv(userId, 'level')

        let prestige = async (baseLevel, rarityOfKey, rarityOfLock, rarityName) => {
            const Key = await economy.getInv(userId, rarityOfKey)
            const Lock = await economy.getInv(userId, rarityOfLock)

            if (level != baseLevel) {
                message.channel.send(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`You Are Level ${level}`)
                    .setDescription(`${message.author} this means you cannot prestige using a ${rarityName.toLowerCase()} key`))
                return;
            }

            if (!Key) {
                message.channel.send(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`You Have No ${rarityName} Keys`)
                    .setDescription(`${message.author} this means you cannot prestige to level ${baseLevel + 1}`))
                return;
            }

            if (!Lock) {
                message.channel.send(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`You Have No ${rarityName} Locks`)
                    .setDescription(`${message.author} this means you cannnot prestige to level ${baseLevel + 1}`))
                return;
            }
        }

        if (levelTP === '1') {
            prestige(0, 'bronzeKey', 'bronzeLock', 'Bronze')
            
            const d = await message.channel.send(prest
                .setColor(message.guild.me.displayColor)
                .setTitle('Are You Sure You Want To Prestige To Level 1?')
                .setDescription('Prestiging to level 1 will cause all your items to be reset'))
            await d.react('✅')
            await d.react('⛔')

            const filter = (reaction, user) => ['✅', '⛔'].includes(reaction.emoji.name) && user.id === message.author.id
            const response = await d.awaitReactions(filter, {
                max: 1,
                time: 60000
            });

            if (!response.size) {
                return undefined;
            }

            const emoji = response.first().emoji.name;

            if (emoji === '✅') {

                await profileSchema.findOneAndDelete({
                    userId
                })

                setCooldown(client, this, message);

                const newLevel = await economy.buyItem(userId, 'level', 1)
                const newBCoins = await economy.buyItem(userId, 'bronzeCoins', 60000)
                const newSCoins = await economy.buyItem(userId, 'silverCoins', 30000)
                const newFRod = await economy.buyItem(userId, 'fishingRod', 1)
                const newHRifle = await economy.buyItem(userId, 'rifle', 1)

                d.reactions.removeAll()
                d.edit(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle('Congratulations On Leveling Up')
                    .setDescription(`Your items have been reset!`)
                    .addField('As A Gift For Leveling Up You Have Received:', `${Emoji.bronzeCoin} ─ \`${newBCoins} coins\`\n${Emoji.silverCoin} ─ \`${newSCoins} coins\`\n${Emoji.rod} ─ \`${newFRod} fishing rod\`\n${Emoji.rifle} ─ \`${newHRifle} hunting rifle\``)
                    .addField('You Used:', `${Emoji.bKey} ─ \`1 bronze key\`\n${Emoji.bLock} ─ \`1 bronze lock\``)
                    .setFooter(`You are now level ${newLevel}`))

            } else {
                d.reactions.removeAll()
                d.edit(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`Ok I guess you aren't leveling up today`)
                    .setDescription('Your items are safe and nothing has been used.'))
            }

        } else if (levelTP === '2') {
            prestige(1, 'silverKey', 'silverLock', 'Silver')

            
            const d = await message.channel.send(prest
                .setColor(message.guild.me.displayColor)
                .setTitle('Are You Sure You Want To Prestige To Level 2?')
                .setDescription('Prestiging to level 2 will cause all your items to be reset'))
            await d.react('✅')
            await d.react('⛔')

            const filter = (reaction, user) => ['✅', '⛔'].includes(reaction.emoji.name) && user.id === message.author.id
            const response = await d.awaitReactions(filter, {
                max: 1,
                time: 60000
            });

            if (!response.size) {
                return undefined;
            }

            const emoji = response.first().emoji.name;

            if (emoji === '✅') {

                await profileSchema.findOneAndDelete({
                    userId
                })

                setCooldown(client, this, message);

                const newLevel = await economy.buyItem(userId, 'level', 2)
                const newBCoins = await economy.buyItem(userId, 'bronzeCoins', 120000)
                const newSCoins = await economy.buyItem(userId, 'silverCoins', 60000)
                const newGCoins = await economy.buyItem(userId, 'goldCoins', 30000)
                const newFRod = await economy.buyItem(userId, 'fishingRod', 1)
                const newHRifle = await economy.buyItem(userId, 'rifle', 1)
                const newPick = await economy.buyItem(userId, 'pickaxe', 1)

                d.reactions.removeAll()
                d.edit(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle('Congratulations On Leveling Up')
                    .setDescription(`Your items have been reset!`)
                    .addField('As A Gift For Leveling Up You Have Received:', `${Emoji.bronzeCoin} ─ \`${newBCoins} coins\`\n${Emoji.silverCoin} ─ \`${newSCoins} coins\`\n${Emoji.goldCoin} ─ \`${newGCoins} coins\`\n${Emoji.rod} ─ \`${newFRod} fishing rod\`\n${Emoji.rifle} ─ \`${newHRifle} hunting rifle\`\n${Emoji.pick} ─ \`${newPick} pickaxe\``)
                    .addField('You Used:', `${Emoji.sKey} ─ \`1 silver key\`\n${Emoji.sLock} ─ \`1 silver lock\``)
                    .setFooter(`You are now level ${newLevel}`))

            } else {
                d.reactions.removeAll()
                d.edit(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`Ok I guess you aren't leveling up today`)
                    .setDescription('Your items are safe and nothing has been used.'))
            }
        } else if (levelTP === '3') {
            prestige(2, 'goldKey', 'goldLock', 'Gold')

            const d = await message.channel.send(prest
                .setColor(message.guild.me.displayColor)
                .setTitle('Are You Sure You Want To Prestige To Level 3?')
                .setDescription('Prestiging to level 3 will cause all your items to be reset'))
            await d.react('✅')
            await d.react('⛔')

            const filter = (reaction, user) => ['✅', '⛔'].includes(reaction.emoji.name) && user.id === message.author.id
            const response = await d.awaitReactions(filter, {
                max: 1,
                time: 60000
            });

            if (!response.size) {
                return undefined;
            }

            const emoji = response.first().emoji.name;

            if (emoji === '✅') {

                await profileSchema.findOneAndDelete({
                    userId
                })


                setCooldown(client, this, message);

                const newLevel = await economy.buyItem(userId, 'level', 3)
                const newBCoins = await economy.buyItem(userId, 'bronzeCoins', 240000)
                const newSCoins = await economy.buyItem(userId, 'silverCoins', 220000)
                const newGCoins = await economy.buyItem(userId, 'goldCoins', 140000)
                const newFRod = await economy.buyItem(userId, 'fishingRod', 3)
                const newHRifle = await economy.buyItem(userId, 'rifle', 3)
                const newPick = await economy.buyItem(userId, 'pickaxe', 3)
                const newTriShard = await economy.buyItem(userId, 'trishard', 1)

                d.reactions.removeAll()
                d.edit(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle('Congratulations On Leveling Up')
                    .setDescription(`Your items have been reset!`)
                    .addField('As A Gift For Leveling Up You Have Received:', `${Emoji.bronzeCoin} ─ \`${newBCoins} coins\`\n${Emoji.silverCoin} ─ \`${newSCoins} coins\`\n${Emoji.goldCoin} ─ \`${newGCoins} coins\`\n${Emoji.rod} ─ \`${newFRod} fishing rod\`\n${Emoji.rifle} ─ \`${newHRifle} hunting rifle\`\n${Emoji.pick} ─ \`${newPick} pickaxe\`\n${Emoji.tri} ─ \`${newTriShard} trident\``)
                    .addField('You Used:', `${Emoji.gKey} ─ \`1 gold key\`\n${Emoji.gLock} ─ \`1 gold lock\``)
                    .setFooter(`You are now level ${newLevel}`))

            } else {
                d.reactions.removeAll()
                d.edit(prest
                    .setColor(message.guild.me.displayColor)
                    .setTitle(`Ok I guess you aren't leveling up today`)
                    .setDescription('Your items are safe and nothing has been used.'))
            }
        } else {
            message.channel.send(prest
                .setColor(message.guild.me.displayColor)
                .setTitle('Invalid Prestige Level')
                .setDescription(`${message.author} the level you want to prestige to must be a number
                        Options: \`1\`,\`2\`,\`3\``))
        }
    }
}