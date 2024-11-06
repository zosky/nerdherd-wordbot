const tmi = require('tmi.js');
const cacheFile = require('./cacheFile')
const { pumpToDiscord } = require('./discord');
const say = t => process.stdout.write(t)

const maxWordCountPerDay = process.env.MAX_WORD_PER_DAY
const maxWordPerPerson = process.env.MAX_WORD_PER_USER
const twitchOptions = {
  identity: { 
    username: process.env.TWITCH_USER, 
    password: process.env.TWITCH_API_KEY },
    channels: [ `#${process.env.TWITCH_CHANNEL}` ]
}

const hourlyMarker = async () => { // ouput progress (if needed)
  const theDate = (new Date).toLocaleTimeString()
  const words = await cacheFile.load()
  const wordsLen = Object.values(words).flat().length
  const wordsNeeded = maxWordCountPerDay - wordsLen
  say(`\n${theDate} ${wordsLen}/${maxWordCountPerDay}\t`)
  
  if ( wordsNeeded ) { 
    let msg = process.env.HOURLY_MSG
      .replace('#NUMBER#', wordsNeeded )
    twitch.say( twitchOptions.channels[0], msg )
  }
}

function onConnectedHandler (addr, port) { say('🤖') }
function onMessageHandler (target, context, msg, self) { 
  const isAImsg = msg?.match(/^!ai (.*)/i)
  const aiWord = isAImsg?.[1]?.toLowerCase()?.trim()
  if (aiWord && !self) processEntry(context.username, aiWord)
}

const processEntry = async (user, word) => {
  const words = await cacheFile.load() // refresh word cache
  const allWords = Object.values(words).flat()
  const stillOpen = allWords.length < maxWordCountPerDay
  let [msg,wordsLeft] = [null,null]

  if (!stillOpen) {
    say(`🚫`)
    msg = process.env.REPLY_FULL
  } else {
    if(!words?.[user]) words[user] = [] // init new u in cache
    wordsLeft = maxWordPerPerson - words[user].length
    if ( !wordsLeft ) msg = process.env.REPLY_MAX
    else if (allWords.includes(word)) msg = process.env.REPLY_DUP
    else { 
      words[user].push(word)
      wordsLeft = maxWordPerPerson - words[user].length
      msg = process.env.REPLY_GOOD
      cacheFile.save(words) // update cache
      say(`🧠 ${word}`)
      pumpToDiscord(user, word)
    }
  } 
  if (msg) { 
    // var transformers
    msg = msg
      .replace('#USER#', `@${user}`)
      .replace('#MAXUSERWORDS#', maxWordPerPerson ?? '-')
      .replace('#NUMBER#', wordsLeft ?? '-' )
    // drop it
    twitch.say(twitchOptions.channels[0], msg)
  }
}

const twitch = new tmi.client(twitchOptions)
twitch.on('message', onMessageHandler)
twitch.on('connected', onConnectedHandler)
// modulerize
const twitchGoTime = () => { twitch.connect() }
module.exports = { twitchGoTime, hourlyMarker } 
