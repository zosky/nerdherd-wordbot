//!/usr/bin/env node

// load env vars
const envFile = 'wordbot-config.ini' + (process.env.NODE_ENV === 'development' ? '.dev' : '')
require('dotenv').config({path: envFile})
// load modules
const { twitchGoTime, hourlyMarker } = require('./twitch')
const { dailyCard } = require('./discord')
// start cron job & bot
const cron = require('node-cron')
cron.schedule( '0 * * * *', hourlyMarker )
cron.schedule( process.env.RESET_CRON, dailyCard )
twitchGoTime() // start twitch bota