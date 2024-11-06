# WordBox

a simple bot that collects words from twitch & shares them in discord

## Purpose

The NerdHerd community suggest words that get madLib'd together into a daily AI art creation. 

## instalation

  1. download the release (TODO linkHere) for your os
  2. edit sample config & rename to `wordbot-config.ini`
  3. initialize the `words.json` cache file
     - linux/mac: `echo '{}' > words.json`
     - win: TODO ?

## running
- lin/mac: run from a terminal 
- win: properties > show in terminal ?

## Example Config File

1. **the file must be (re)named `wordbot-config.ini`** and needs to contain the following:
    - first 6 lines for login to ttv and disco
    - the rest tell the bot what to do when & when
    ```BASH
    TWITCH_CHANNEL="CHANNEL_TO_JOIN"
    TWITCH_USER="BOT_USERNAME"
    TWITCH_API_KEY="oauth:xxxxxx"
    DISCORD_WEBHOOK_URL="DISCORD_CHANNEL_WEBHOOK_URL"
    DISCORD_BOT_NAME="DISCORD_BOT_NAME"
    DISCORD_BOT_AVATAR="AVATAR_URL"
    DISCORD_DAILY_CARD_TITLE="word suggestions from the community for today"
    DISCORD_WORD_ADDED="[#WORDCOUNT#/#MAXWORDS# by #USERCOUNT#🙋] 📺 #USER# ✏️ **#WORD#**"
    MAX_WORD_PER_DAY=40
    MAX_WORD_PER_USER=3
    HOURLY_MSG="!ai (word) 3 per user/day - example !ai bloop We need #NUMBER# more words for today please and thank you."
    REPLY_MAX="#USER# you have added #MAXUSERWORDS# today"
    REPLY_DUP="#USER# that has already been suggested today"
    REPLY_GOOD="thanks #USER#. you can add #NUMBER# more words today"
    REPLY_FULL="#USER# suggestions are full for today. try again after ~8am pst"
    RESET_CRON="57 19 * * *"
    ```
    
2. certain `#THINGS#` are replaced in each msg, like "blah blah `47` blah"
    - `#WORDCOUNT#` > how many words so far
    - `#MAXWORDS#` > max words
    - `#USER#` > who added a new word
    - `#WORD#` > the word they added
    - `#USERCOUNT#` > how many people so far
    - `#NUMBER#` > how many a person can still add

## words file

- `words.json` keeps track of who has submit what
  - must exist. can be an empty object: `{}`
- the format is an object of users, each with an array of words
   ```javascript
   { 
     user1: [ word1, w2, w3 ],
     user2: [ word4, w5, w6 ],
     ...
   }
   ```

## dev/contribut

1. clone the repo
2. make cool changes
3. send PR

### exec DEV mode
1. make `wordbot-config.ini.dev` (see config above)
2. set NODE_ENV to `development` (aka: `npm run dev`)

### build self contained exe
 
- compiled for win/mac/linux using node `pkg` 
- shortcut @ `npm run build`

# TODO

- github project
- checkin workflow > build & release