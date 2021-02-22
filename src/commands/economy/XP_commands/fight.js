const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')
const Emoji = require('../../../../config/emoji.json')

const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "duel",
    category: "Economy",
    aliases: ['fight'],
    description: "Allows you to fight a user for a random amount money",
    usage: "\`PREFIXfight [user] [type of coin] [amount]\`",
    examples: "\`PREFIXfight @Qzxy bcoins 500\`",
    cooldown: 60,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const fighte = new Discord.MessageEmbed()
        let randomNum = Math.floor(Math.random() * 15) + 1

        let typeOfCoin = args[1]
        let bet = args[2]

        if (!typeOfCoin) {
            return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**You need to provide what type of coin you are going to bet**`))
        }

        if (!bet) {
            return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**You need to actually bet something**`))
        }

        if (bet < 500) {
            return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**You need to actually bet something greater than 500**`))
        }

        if (bet > 1000000) {
            return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**You cannot bet more than 1000000 coins**`))
        }

        let fightFunction = async (typeOfCoin, nameOfCoin, emojiOfCoin) => {
            const challenger = message.author;
            const oppenent = message.mentions.users.first() || message.guild.members.cache.get(args[0])

            let userId = challenger.id

            if (!oppenent) return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription('**Mention someone to fight**'));

            let oppenentId = oppenent.id

            const authorCoins = await economy.getInv(userId, typeOfCoin)
            const oppenentCoins = await economy.getInv(oppenentId, typeOfCoin)

            if (isNaN(bet)) {
                if (bet.toLowerCase() === 'all' || bet.toLowerCase() === 'max') {
                    if (authorCoins > 1000000) {
                        bet = 1000000
                    } else {
                        bet = authorCoins
                    }
                } else if (bet.toLowerCase() === 'half') {
                    bet = Math.round(authorCoins / 2)
                } else {
                    return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**You have to bet an actual amount of coins**`))
                }
            }

            if (!Number.isInteger(Number(bet))) {
                return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**Your bet must be a whole number... no decimals**`))
            }

            if (authorCoins === 0) {
                return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**You have no ${nameOfCoin} coins**`))
            }

            if (oppenentCoins === 0) {
                return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**${oppenent} has no ${nameOfCoin} coins**`))
            }

            if (challenger.id === oppenent.id) return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**You cannot fight yourself**`))

            const question = await message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription(`**${oppenent} would you like to fight ${challenger}?**`));

            ['✅', '❌'].forEach(async el => await question.react(el));

            const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === oppenent.id;

            const response = await question.awaitReactions(filter, { max: 1, time: 10 * 1000 });
            const reaction = response.first();

            if (reaction.emoji.name === '❌') {
                return question.edit(fighte.setColor(message.guild.me.displayColor).setDescription("**Looks like they didn't want to play**"))
            } else {
                setCooldown(client, this, message);

                const challengerHealth = 100;
                const oppenentHealth = 100;

                const challengerLastAttack = 'defend';
                const oppenentLastAttack = 'defend';

                const gameData = [
                    { member: challenger, health: challengerHealth, lastAttack: challengerLastAttack },
                    { member: oppenent, health: oppenentHealth, lastAttack: oppenentLastAttack }
                ];

                let player = 0;

                const checkHealth = (member) => {
                    if (gameData[member].health <= 0) return true;
                    else return false;
                };

                await question.edit(fighte
                    .setColor(message.guild.me.displayColor)
                    .setDescription(`**${challenger}, you go first! Would you like to attack or defend?**`))

                const gameFilter = m => m.author.id === challenger.id || m.author.id === oppenent.id;
                const gameCollector = message.channel.createMessageCollector(gameFilter);

                gameCollector.on('collect', async (msg) => {
                    if (msg.author.id === gameData[player].member.id) {
                        if (!checkHealth(player)) {

                            const selection = msg.content.toLowerCase();
                            if (selection !== 'attack' && selection !== 'defend') {
                                return message.channel.send(fighte.setColor(message.guild.me.displayColor).setDescription('**Invalid move, please choose from attack or defend**'));
                            }

                            if (selection === 'attack') {

                                let randNumb = Math.floor(Math.random() * (50 - 12) + 12);
                                const tempPlayer = (player + 1) % 2;

                                if (gameData[tempPlayer].lastAttack === 'defend') randNumb = Math.floor(randNumb / 2);

                                gameData[tempPlayer].health -= randNumb;

                                if (gameData[tempPlayer].health <= 0) {
                                    gameData[tempPlayer].health = 0
                                }

                                gameData[player].lastAttack = 'attack';

                                const FightE = new Discord.MessageEmbed()

                                message.channel.send(`${gameData[tempPlayer].member} **⇒**`)
                                message.channel.send(FightE
                                    .setColor(message.guild.me.displayColor)
                                    .setDescription(`**${gameData[player].member} has dealt ${randNumb} damage to you**`)
                                    .addField(`${gameData[player].member.username}'s Health`, `💓 \`${gameData[player].health}\``, true)
                                    .addField(`${gameData[tempPlayer].member.username}'s Health`, `💓 \`${gameData[tempPlayer].health}\``, true)
                                    .setFooter(`It is now your turn. Would you like to attack or defend?`))
                                    .then(msg => { msg.delete({ timeout: 60000 }) });;

                                player = (player + 1) % 2;
                            } else if (selection === 'defend') {
                                const tempPlayer = (player + 1) % 2;

                                message.channel.send(`${gameData[tempPlayer].member} **⇒**`)
                                message.channel.send(fighte
                                    .setColor(message.guild.me.displayColor)
                                    .setDescription(`**${gameData[player].member} defended. It is now your turn. Would you like to \`attack\` or \`defend\`?**`))
                                    .then(msg => { msg.delete({ timeout: 60000 }) });;;

                                gameData[player].lastAttack = 'defend';
                                player = (player + 1) % 2;
                            }

                            if (checkHealth(player)) {
                                const FIGHTE = new Discord.MessageEmbed()

                                gameCollector.stop();
                                const tempPlayer = (player + 1) % 2;

                                await economy.buyItem(gameData[tempPlayer].member.id, 'XP', randomNum * 2)
                                await economy.buyItem(gameData[player].member.id, 'XP', randomNum - 5)

                                const winnerNewCoins = await economy.buyItem(gameData[tempPlayer].member.id, typeOfCoin, bet)
                                const loserNewCoins = await economy.buyItem(gameData[player].member.id, typeOfCoin, -bet)

                                message.channel.send(FIGHTE
                                    .setColor(message.guild.me.displayColor)
                                    .setTitle(`Game ended! ${gameData[tempPlayer].member.username} has won`)
                                    .addField(`${gameData[tempPlayer].member.username} Won And Now Has`, `${emojiOfCoin} \`${winnerNewCoins} coins\``)
                                    .addField(`${gameData[player].member.username} Lost And Now Has`, `${emojiOfCoin} \`${loserNewCoins} coins\``))
                                    .then(msg => { msg.delete({ timeout: 60000 }) });;;
                            }
                        } else {
                            const FIGHTe = new Discord.MessageEmbed()

                            const tempPlayer = (player + 1) % 2;
                            const winnerNewCoins = await economy.buyItem(gameData[player].member.id, typeOfCoin, bet)
                            const loserNewCoins = await economy.buyItem(gameData[tempPlayer].member.id, typeOfCoin, -bet)

                            await economy.buyItem(gameData[player].member.id, 'XP', randomNum * 2)
                            await economy.buyItem(gameData[tempPlayer].member.id, 'XP', randomNum - 5)

                            message.channel.send(FIGHTe
                                .setColor(message.guild.me.displayColor)
                                .setTitle(`${gameData[player].member.username} has won the game!`)
                                .addField(`${gameData[player].member.username} Won And Now Has`, `${emojiOfCoin} \`${winnerNewCoins} coins\``)
                                .addField(`${gameData[tempPlayer].member.username} Lost And Now Has`, `${emojiOfCoin} \`${loserNewCoins} coins\``))
                                .then(msg => { msg.delete({ timeout: 60000 }) });;;
                        }
                    }
                });
            }
        }


        if (typeOfCoin.toLowerCase() === 'bronzecoins' || typeOfCoin.toLowerCase() === 'bcoins') {
            fightFunction('bronzeCoins', 'bronze', Emoji.bronzeCoin)

        } else if (typeOfCoin.toLowerCase() === 'silvercoins' || typeOfCoin.toLowerCase() === 'scoins') {
            fightFunction('silverCoins', 'silver', Emoji.silverCoin)

        } else if (typeOfCoin.toLowerCase() === 'goldcoins' || typeOfCoin.toLowerCase() === 'gcoins') {
            fightFunction('goldCoins', 'gold', Emoji.goldCoin)

        }


    }
}