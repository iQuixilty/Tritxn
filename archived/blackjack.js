// const PREFIX = require('../../../../config/config.json').PREFIX;
// const Discord = require('discord.js')

// const economy = require('../../../../schemas/economy')
// const Emoji = require('../../../../config/emoji.json')

// const { setCooldown } = require('../../../utils/utils')


// /**
//  * @type {import('../../../typings.d').Command}
//  */

// module.exports = {
//     name: "blackjack",
//     category: "Economy",
//     aliases: ['bj'],
//     description: "Starts a game of blackjack for money (using reactions)",
//     cooldown: 15,
//     canNotSetCooldown: true,
//     usage: "\`PREFIXblackjack [type of coin] [amount]\`",
//     examples: "\`PREFIXblackjack bcoins 500\`",
//     clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

//     execute: async function (client, message, args) {
//         const BJ = new Discord.MessageEmbed()

//         const userId = message.author.id

//         let typeOfCoin = args[0]
//         let bet = args[1]

//         if (!typeOfCoin) {
//             return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`**You need to provide what type of coin you are going to bet**`))
//         }

//         if (!bet) {
//             return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`**You need to actually bet something**`))
//         }

//         if (bet < 500) {
//             return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`**You need to actually bet something greater than 500**`))
//         }

//         if (bet > 1000000) {
//             return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`**You cannot bet more than 1000000 coins**`))
//         }

//         let blackjack = async (typeOfCoin, nameOfCoin, emojiOfCoin) => {
//             const typeOfC = await economy.getInv(userId, typeOfCoin)

//             if (isNaN(bet)) {
//                 if (bet.toLowerCase() === 'all' || bet.toLowerCase() === 'max') {
//                     if (typeOfC > 1000000) {
//                         bet = 1000000
//                     } else {
//                         bet = typeOfC
//                     }
//                 } else if (bet.toLowerCase() === 'half') {
//                     bet = Math.round(typeOfC / 2)
//                 } else {
//                     return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`**You have to bet an actual amount of coins**`))
//                 }
//             }

//             if (!Number.isInteger(Number(bet))) {
//                 return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`**Your bet must be a whole number**`))
//             }

//             if (typeOfC === 0) {
//                 return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`**You have no ${nameOfCoin.toLowerCase()} coins**`))
//             }

//             if (bet > typeOfC) {
//                 return message.channel.send(BJ
//                     .setColor(message.guild.me.displayColor)
//                     .setDescription(`**You only have ${emojiOfCoin} \`${typeOfC} coins\`**`))
//             }

//             let winnings = 0;

//             const faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
//             const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
//             const suits = ['spades', 'hearts', 'diamonds', 'clubs'];

//             let stood = false;
//             let first = true;

//             function deal() {
//                 let card = { face: randomInArray(faces), suit: randomInArray(suits) };
//                 return card;
//             }

//             let cards = {
//                 bot: [deal(), deal()],
//                 user: [deal(), deal()]
//             };

//             while (addCards('user') === 21 || addCards('bot') === 21) { // redraw
//                 cards = {
//                     bot: [deal(), deal()],
//                     user: [deal(), deal()]
//                 };
//             }

//             function getRespectiveIcon(suit) {
//                 switch (suit) {
//                     case 'spades':
//                         return '♠';
//                     case 'hearts':
//                         return '♥';
//                     case 'diamonds':
//                         return '♦';
//                     case 'clubs':
//                         return '♣';
//                 }
//             }

//             function getValue(card) {
//                 return { value: values[faces.indexOf(card.face)], card };
//             }

//             function addCards(type) {
//                 return cards[type].sort((a, b) => getValue(b).value - getValue(a).value).reduce((p, c) => {
//                     let newCard = getValue(c).value;
//                     if (newCard === 1) {
//                         if (p + 11 <= 21) {
//                             newCard = 11;
//                         }
//                     }
//                     return p + newCard;
//                 }, 0);
//             }


//             function score() {
//                 if (addCards('user') > 21) { // User busted
//                     return { result: false, message: 'Rip you lost, shouldnt have gone over 21\n' };
//                 } else if (addCards('bot') > 21) { // Bot busted
//                     return { result: true, message: 'Congrats you won, I somehow went over 21!\n' };
//                 } else if (addCards('user') === 21) { // User has exactly 21
//                     return { result: true, message: 'Dang, the chances that you got 21 are so low, congrats\n' };
//                 } else if (addCards('bot') === 21) { // Bot has exactly 21
//                     return { result: false, message: 'Haha I got 21, guess you arent winning today\n' };
//                 } else if (addCards('bot') === addCards('user') && stood) { // Tie
//                     return { result: null, message: 'Wow! We tied, guess no one wins anything then\n' };
//                 } else if (addCards('user') <= 21 && cards.user.length === 5) { // User took more than 5 cards without going over 21
//                     return { result: true, message: 'Dam, the fates are with you today, you got 5 cards without going over\n' };
//                 } else if (addCards('bot') <= 21 && cards.bot.length === 5) { // Bot took more than 5 cards without going over 21
//                     return { result: false, message: 'RIP I got 5 cards (its not rigged I swear) without going over 21, you lost\n' };
//                 } else if (addCards('bot') > addCards('user') && stood) {
//                     // If the bot has a score of 17 or more and the user has less than the bot, and the user is also stood
//                     return { result: false, message: `Yikes, you lost. You only had a total value of ${addCards('user')}, I had ${addCards('bot')}.\n` };
//                 } else if (addCards('user') > addCards('bot') && stood) {
//                     // If the user has a higher score than the bot and they are
//                     return { result: true, message: `Awwww, you won! You had a total value of ${addCards('user')}, and I only had ${addCards('bot')}.\n` };
//                 } else {
//                     return addCards('user'); // else
//                 }
//             }

//             let randomNum = Math.floor(Math.random() * 8) + 1
//             setCooldown(client, this, message);

//             const gambed = async (final) => {
//                 const status = score();
//                 let desc = '';
//                 if (status.constructor === Object) {
//                     const coinCheck = await economy.getInv(userId, typeOfCoin);
//                     if (bet > coinCheck) {
//                         await economy.buyItem(userId, typeOfCoin, Math.round(bet / 2))
//                         return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`You don't enough money for this bet. Im going to have to take away half the bet`));
//                     }
//                     let finalMsg = '';
//                     // Win
//                     if (status.result) {
//                         winnings = Math.ceil(bet); // ceil here to avoid winnings being 0

//                         finalMsg += `You won ${emojiOfCoin} \`${winnings.toLocaleString()} coins\`. You now have ${emojiOfCoin} \`${(coinCheck + winnings).toLocaleString()} coins\``;
//                         await economy.buyItem(userId, typeOfCoin, winnings)
//                         await economy.buyItem(userId, 'XP', randomNum)
//                     } else {
//                         // Tie
//                         if (status.result === null) {
//                             await economy.buyItem(userId, 'XP', randomNum)
//                             finalMsg += `Your wallet hasn't changed! You have ${emojiOfCoin} \`${coinCheck} coins\` still`;
//                         } else {
//                             // Loss

//                             finalMsg += `You lost ${emojiOfCoin} \`${Number(bet).toLocaleString()} coins\`. You now have ${emojiOfCoin} \`${(coinCheck - bet).toLocaleString()} coins\`.`;
//                             await economy.buyItem(userId, typeOfCoin, -bet)
//                             await economy.buyItem(userId, 'XP', randomNum)
//                         }
//                     }
//                     final = true;
//                     desc = `**${status.message}** ${finalMsg}`;
//                 }
//                 const satisfied = final
//                 const BJE = new Discord.MessageEmbed()
//                     .setColor(final ? status.result === null ? 16757504 : (winnings ? 5025616 : 15022389) : message.guild.me.displayColor)

//                     .setAuthor(`Will ${message.author.username} Win Or Will They Lose?`, message.author.displayAvatarURL({ dynamic: true }))
//                     .addField(`Your`, `Cards - **${cards.user.map(card => `[\`${getRespectiveIcon(card.suit)} ${card.face}\`](https://www.youtube.com/watch?v=DLzxrzFCyOs)`).join('  ')}**\nTotal - \`${addCards('user')}\``, true)
//                     .addField(`My`, `Cards - **${cards.bot.slice(0, satisfied ? cards.bot.length : 2).map((card, i) => (!i || satisfied) ? `[\`${getRespectiveIcon(card.suit)} ${card.face}\`](https://www.youtube.com/watch?v=DLzxrzFCyOs)` : '`?`').join('  ')}**\nTotal - \`${satisfied ? addCards('bot') : ' ? '}\``, true)
//                     .addField(!final ? `React With` : `Results`, !final ? `${Emoji.hit} to **hit** (draws a new card) \n${Emoji.stand} to **stand** (leaves your cards as is) \n${Emoji.end} to **end** (will cause you to lose half the bet value)` : `${desc}`)
//                     .setFooter(`${!final ? 'Kings, Queens, Jacks are worth 10  |  Aces are worth 1 or 11' : ''}`)

//                 const d = await message.channel.send(BJE)
//                 d.edit(BJE)
//                 if (!final) {
//                     await d.react(Emoji.hit)
//                     await d.react(Emoji.stand)
//                     await d.react(Emoji.end)
//                 }

//                 first = false;

//                 if (final) return;

//                 const filter = (reaction, user) => [`794422128811442237`, `794422126630797322`, `794450357102968852`].includes(reaction.emoji.id) && user.id === message.author.id

//                 try {
//                     const response = await d.awaitReactions(filter, {
//                         max: 1,
//                         time: 15 * 1000,
//                         errors: ['time']
//                     })


//                     if (!response.size) {
//                         return undefined;
//                     }


//                     const emoji = response.first().emoji.id;

//                     if (emoji === `794422128811442237`) {
//                         d.reactions.removeAll()
//                         cards.user.push(deal());
//                         return gambed();
//                     } else if (emoji === `794422126630797322`) {
//                         d.reactions.removeAll()
//                         stood = true;
//                         return dealersTurn(stood);
//                     } else if (emoji === '794450357102968852') {
//                         d.reactions.removeAll()
//                         const newEndCoins = await economy.buyItem(userId, typeOfCoin, -bet / 2)
//                         return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`You ended the game and lost half your bet`))
//                     } else {
//                         d.reactions.removeAll()
//                     }

//                     if (final) {
//                         d.reactions.removeAll()
//                     }
//                 } catch {
//                     d.reactions.removeAll()
//                     await economy.buyItem(userId, typeOfCoin, -bet / 2)
//                     return message.channel.send(BJ.setColor(message.guild.me.displayColor).setDescription(`**You took too long to respond and I took away half your bet**`));
//                 }
//             }

//             const dealersTurn = (end) => {
//                 if (addCards('user') > 21) {
//                     return gambed();
//                 }
//                 const thoughts = [];
//                 if (cards.bot.length < 5) {
//                     if (addCards('bot') <= 16) {
//                         thoughts.push('Drawing.');
//                         cards.bot.push(deal());
//                     } else {
//                         thoughts.push('Standing.');
//                     }
//                     if (end) {
//                         return dealersTurn();
//                     }
//                 }
//                 return gambed();
//             };
//             return gambed();

//         }


//         if (typeOfCoin.toLowerCase() === 'bronzecoins' || typeOfCoin.toLowerCase() === 'bcoins') {
//             blackjack('bronzeCoins', 'bronze', Emoji.bronzeCoin)

//         } else if (typeOfCoin.toLowerCase() === 'silvercoins' || typeOfCoin.toLowerCase() === 'scoins') {
//             blackjack('silverCoins', 'silver', Emoji.silverCoin)

//         } else if (typeOfCoin.toLowerCase() === 'goldcoins' || typeOfCoin.toLowerCase() === 'gcoins') {
//             blackjack('goldCoins', 'gold', Emoji.goldCoin)
//         }
//     }
// }

// function randomInArray(array) {
//     return array[Math.floor(Math.random() * array.length)];
// }