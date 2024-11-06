const { Webhook, MessageBuilder } = require('discord-webhook-node');
const cacheFile = require('./cacheFile')
const maxWordCountPerDay = process.env.MAX_WORD_PER_DAY
const discord = new Webhook( process.env.DISCORD_WEBHOOK_URL )
  .setUsername( process.env.DISCORD_BOT_NAME )
  .setAvatar( process.env.DISCORD_BOT_AVATAR )

const dailyCard = async (words) => {
  words = await cacheFile.load() // refresh word cache
  // send message
  const cardMsg = Object.entries(words)
    .map((w,wx)=>`${wx+1}. 📺 ${w[0]} ✏️ **${w[1].join(', ')}**`)
    .join('\n')
  const newMsg =  new MessageBuilder()
    .setTitle(process.env.DISCORD_DAILY_CARD_TITLE)
    .setDescription(cardMsg)
  discord.send(newMsg)
  // reset words file
  await cacheFile.save({})
}

const pumpToDiscord = async (user, word) => {
  const words = await cacheFile.load() // refresh word cache
  const wordCountNow = Object.values(words).flat().length
  const peopleCount = Object.keys(words).length
  if (wordCountNow >= maxWordCountPerDay) { 
    dailyCard(words)
  } else { // in progress
    let dmsg = process.env.DISCORD_WORD_ADDED
    dmsg = dmsg
      .replace('#WORDCOUNT#', wordCountNow)
      .replace('#MAXWORDS#', maxWordCountPerDay)
      .replace('#USERCOUNT#', peopleCount)
      .replace('#USER#', user)
      .replace('#WORD#', word)
    discord.send(dmsg) // post on discord
  }
}

module.exports = { pumpToDiscord, dailyCard }