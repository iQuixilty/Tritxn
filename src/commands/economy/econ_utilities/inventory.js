const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const economy = require('../../../../schemas/economy')

const emoji = require('../../../../config/emoji.json')

const { setCooldown, paginate } = require('../../../utils/utils')

module.exports = {
    name: "inventory",
    category: "Economy",
    aliases: ["backpack", 'pack', 'inv'],
    description: "Displays what you have in your inventory",
    usage: "\`PREFIXinventory [user]\`",
    cooldown: 5,
    canNotSetCooldown: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {

        let target;

        if (!message.mentions.members.first()) {
            target = message.guild.members.cache.get(message.author.id);
        } else {
            target = message.mentions.members.first()
        }

        let userId = target.id



        const Rods = await economy.getInv(userId, 'fishingRod')
        const Fishs = await economy.getInv(userId, 'fish')
        const Trident = await economy.getInv(userId, 'trident')
        const TriShard = await economy.getInv(userId, 'trishard')
        const Rifle = await economy.getInv(userId, 'rifle')
        const Pick = await economy.getInv(userId, 'pickaxe')
        const Rabbits = await economy.getInv(userId, 'rabbit')
        const Raccoons = await economy.getInv(userId, 'raccoon')

        const SilverIngot = await economy.getInv(userId, 'silverIngot')
        const GoldIngot = await economy.getInv(userId, 'goldIngot')


        const bronzeLock = await economy.getInv(userId, 'bronzeLock')
        const silverLock = await economy.getInv(userId, 'silverLock')
        const goldLock = await economy.getInv(userId, 'goldLock')
        const bronzeKey = await economy.getInv(userId, 'bronzeKey')
        const silverKey = await economy.getInv(userId, 'silverKey')
        const goldKey = await economy.getInv(userId, 'goldKey')

        let oresCount = GoldIngot + SilverIngot
        let animalsCount = Fishs + Rabbits + Raccoons
        let toolsCount = Pick + Rifle + Rods
        let collectablesCount = bronzeLock + silverLock + goldLock + bronzeKey + silverKey + goldKey + Trident + TriShard

        setCooldown(client, this, message);

        let inventoryE1 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${target.user.username}'s Inventory`)
            .setDescription(animalsCount === 0 ? 'This user has not caught any animals yet!' : `-----------Tools-----------${Rods === 0 ? '' : `\n\n${emoji.rod} \`${Rods} fishing rod(s)\``}${Rifle === 0 ? '' : `\n\n${emoji.rifle} \`${Rifle} hunting rifle(s)\``}${Pick === 0 ? '' : `\n\n${emoji.pick} \`${Pick} pickaxe(s)\``}`)

        let inventoryE2 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${target.user.username}'s Inventory`)
            .setDescription(toolsCount === 0 ? 'This user has not found any tools yet!' : `-----------Animals-----------\n\n ${Fishs === 0 ? '' : `\n\n🐟 \`${Fishs} fish\``}${Rabbits === 0 ? '' : `\n\n🐇 \`${Rabbits} rabbits\``}${Raccoons === 0 ? '' : `\n\n🦝 \`${Raccoons} raccoon(s)\``}`)

        let inventoryE3 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${message.author.username}'s Inventory`)
            .setDescription(oresCount === 0 ? 'This user has not collected any ores yet!' : `-----------Ores-----------${SilverIngot === 0 ? '' : `\n\n${emoji.silver} \`${SilverIngot} silver ingot(s)\``} ${GoldIngot === 0 ? '' : `\n\n${emoji.gold} \`${GoldIngot} gold ingot(s)\``}`)

        let inventoryE4 = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle(`${message.author.username}'s Inventory`)
            .setDescription(collectablesCount === 0 ? 'This person does not have any collectables yet!' : `-----------Collectables-----------${bronzeLock === 0 ? '' : `\n\n${emoji.bLock} \`${bronzeLock} bronze lock(s)\``} ${bronzeKey === 0 ? '' : `\n\n${emoji.bKey} \`${bronzeKey} bronze key(s)\``}${silverLock === 0 ? '' : `\n\n${emoji.sLock} \`${silverLock} silver lock(s)\``}${silverKey === 0 ? '' : `\n\n${emoji.sKey} \`${silverKey} silver key(s)\``}${goldLock === 0 ? '' : `\n\n${emoji.gLock} \`${goldLock} gold lock(s)\``}${goldKey === 0 ? '' : `\n\n${emoji.gKey} \`${goldKey} gold key(s)\``}${TriShard === 0 ? '' : `\n\n${emoji.trishard} \`${TriShard} trident shard(s)\``}${Trident === 0 ? '' : `\n\n${emoji.tri} \`${Trident} trident(s)\``}`)


        paginate(message, [inventoryE1, inventoryE2, inventoryE3, inventoryE4], { time: 1000 * 7 })
    }
}

