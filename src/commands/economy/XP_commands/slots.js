const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')

const economy = require('../../../../schemas/economy')
const emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

// **Rates:**
// \`🍋🍋❔\` - 0.5x **|** \`🍋🍋🍋\` - 2.5x
// \`🍎🍎❔\` - 2x **|**  \`🍎🍎🍎\` - 3x
// \`🍀🍀❔\` - 2x **|**   \`🍀🍀🍀\` - 4x
// \`🍇🍇❔\` - 3.5x **|** \`🍇🍇🍇\` - 7x
// \`💎💎❔\` - 7x **|**  \`💎💎💎\` - 15x

module.exports = {
    name: "slots",
    category: "Economy",
    aliases: ['slot'],
    description: `Take your chances in slots`,
    cooldown: 5,
    canNotSetCooldown: true,
    usage: `\`PREFIXslots [type of coin] [amount]\``,
    examples: "\`PREFIXslots bcoins 500\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const DR = new Discord.MessageEmbed()

        const userId = message.author.id


        let randomNum = Math.floor(Math.random() * 8) + 1

        let typeOfCoin = args[0]
        let bet = args[1]

        if (!typeOfCoin) {
            return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You need to provide what type of coin you are going to bet**`))
        }

        if (!bet) {
            return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You need to actually bet something**`))
        }

        if (bet < 500) {
            return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You need to actually bet something greater than 500**`))
        }

        if (bet > 1000000) {
            return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You cannot bet more than 1000000 coins**`))
        }

        let slotsFunction = async (typeOfCoin, coinName, emojiOfCoin) => {
            const typeOfC = await economy.getInv(userId, typeOfCoin)

            if (isNaN(bet)) {
                if (bet.toLowerCase() === 'all' || bet.toLowerCase() === 'max') {
                    if (typeOfC > 1000000) {
                        bet = 1000000
                    } else {
                        bet = typeOfC
                    }
                } else if (bet.toLowerCase() === 'half') {
                    bet = Math.round(typeOfC / 2)
                } else {
                    return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You have to bet an actual amount of coins**`))
                }
            }

            if (!Number.isInteger(Number(bet))) {
                return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**Your bet must be a whole number... no decimals**`))
            }

            if (typeOfC === 0) {
                return message.channel.send(DR.setColor(message.guild.me.displayColor).setDescription(`**You have no ${coinName} coins**`))
            }

            if (bet > typeOfC) {
                return message.channel.send(DR
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**You only have ${emojiOfCoin} \`${typeOfC} coins\`**`))
            }

            const slot = [];
            const border = '---------------------';
            const L = ':lemon:';
            const G = ':grapes:';
            const GE = ':gem:';
            const F = ':four_leaf_clover:';
            const A = ':apple:';
            const T = ':tangerine:'
            const ME = ':melon:'
            const C = ':carrot:'
            const B = ':banana:'
            const Q = ':grey_question:';

            const symbols = [L, G, GE, F, A, T, ME, C, B];
            const doubles = {};
            doubles[':lemon:'] = 0.5;
            doubles[':tangerine:'] = 0.5
            doubles[':melon:'] = 1
            doubles[':carrot:'] = 1
            doubles[':banana:'] = 2
            doubles[':apple:'] = 2;
            doubles[':four_leaf_clover:'] = 2;
            doubles[':grapes:'] = 3.5;
            doubles[':gem:'] = 7;
            const triples = {};
            triples[':tangerine:'] = 1.5
            triples[':melon:'] = 2
            triples[':carrot:'] = 2.5
            triples[':banana:'] = 3.5
            triples[':lemon:'] = 2.5;
            triples[':apple:'] = 3;
            triples[':four_leaf_clover:'] = 4;
            triples[':grapes:'] = 7;
            triples[':gem:'] = 15;


            const randomSlots = new Array(3);
            randomSlots.fill('❔');
            const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

            const current = client.games.get(message.channel.id);

            if (current) {
                return message.reply(new MessageEmbed().setColor(message.guild.me.displayColor).setDescription(`**Please wait until the current game of \`${current.name}\` is finished.**`));
            }

            client.games.set(message.channel.id, {
                name: this.name
            });

            setCooldown(client, this, message);

            const embed = new MessageEmbed()
                .setAuthor(`Win or Lose`, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`**${border}\n   | ${randomSlots.join(' | ')} |\n${border}\n-- Spinning --**`)
                .setColor(message.guild.me.displayColor);
            const msg = await message.channel.send(embed);

            for (let i = 0; i < 3; i++) {
                await sleep(1666);
                slot.push(symbols[Math.floor(Math.random() * symbols.length)]);
                randomSlots[i] = slot[i];
                msg.edit(embed.setDescription(`**${border}\n   | ${randomSlots.join(' | ')} |\n${border}\n-- Spinning --**`));
            }

            const triplesWin = slot[0] === slot[1] && slot[0] === slot[2]
            const doublesWin = slot[0] === slot[1] || slot[1] === slot[2] || slot[0] === slot[2]
            const triplesProfit = Math.floor(bet * triples[slot[0]]);
            const doublesProfit = Math.floor(bet * doubles[slot[1]]);
            client.games.delete(message.channel.id);

            if (triplesWin) {
                await economy.buyItem(userId, 'XP', randomNum * 3)
                const newBalance = await economy.buyItem(userId, typeOfCoin, triplesProfit);
                embed.setAuthor(`${message.author.username} Won!`, message.author.displayAvatarURL({ dynamic: true }))
                embed.setDescription(`**${border}\n   | ${randomSlots.join(' | ')} |\n${border}**`);
                embed.addFields({
                    name: 'You Won',
                    value: `${emojiOfCoin} \`${triplesProfit.toLocaleString()} coins\``,
                    inline: true
                }, {
                    name: 'Balance',
                    value: `You have ${emojiOfCoin} \`${newBalance.toLocaleString()} coins\``,
                    inline: false
                });
                embed.setColor('GREEN');
                return msg.edit(embed);
            } else if (doublesWin) {
                await economy.buyItem(userId, 'XP', randomNum * 2)
                const newBalance = await economy.buyItem(userId, typeOfCoin, doublesProfit);
                embed.setAuthor(`${message.author.username} Won!`, message.author.displayAvatarURL({ dynamic: true }))
                embed.setDescription(`**${border}\n   | ${randomSlots.join(' | ')} |\n${border}**`);
                embed.addFields({
                    name: 'You Won',
                    value: `${emojiOfCoin} \`${doublesProfit.toLocaleString()} coins\``,
                    inline: true
                }, {
                    name: 'Balance',
                    value: `You have ${emojiOfCoin} \`${newBalance.toLocaleString()} coins\``,
                    inline: false
                });
                embed.setColor('GREEN');
                return msg.edit(embed);
            } else {
                await economy.buyItem(userId, 'XP', randomNum)
                const newBalance = await economy.buyItem(userId, typeOfCoin, bet * -1);

                embed.setAuthor(`${message.author.username} Lost`, message.author.displayAvatarURL({ dynamic: true }))
                embed.setDescription(`**${border}\n   | ${randomSlots.join(' | ')} |\n${border}**`);
                embed.addFields({
                    name: 'You Lost',
                    value: `${emojiOfCoin} \`${bet.toLocaleString()} coins\``,
                    inline: true
                }, {
                    name: 'Balance',
                    value: `You have ${emojiOfCoin} \`${newBalance.toLocaleString()} coins\``,
                    inline: false
                });
                embed.setColor('RED');
                return msg.edit(embed);
            }
        }


        if (typeOfCoin.toLowerCase() === 'bronzecoins' || typeOfCoin.toLowerCase() === 'bcoins') {
            slotsFunction('bronzeCoins', 'bronze', emoji.bronzeCoin)

        } else if (typeOfCoin.toLowerCase() === 'silvercoins' || typeOfCoin.toLowerCase() === 'scoins') {
            slotsFunction('silverCoins', 'silver', emoji.silverCoin)

        } else if (typeOfCoin.toLowerCase() === 'goldcoins' || typeOfCoin.toLowerCase() === 'gcoins') {
            slotsFunction('goldCoins', 'gold', emoji.goldCoin)

        }
    }
}

