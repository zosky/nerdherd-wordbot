const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const hddFile = path.join(path.resolve(), 'words.json')

const cacheFile = { // .load() || .save(words)
  load: async () => {
    const fileContent = readFileSync(hddFile, 'utf8')
    const words = JSON.parse(fileContent)
    return words
  }, 
  save: async (words) => {
    const fileContent = JSON.stringify(words)
    writeFileSync(hddFile, fileContent, 'utf8')
  }
}

module.exports = cacheFile