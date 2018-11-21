const { Command } = require('discord-akairo')
const moment = require('moment')
const fs = require('fs')
const r = require('../utils/redditUtil')

module.exports = class extends Command {
  constructor() {
    super('hot', {
      aliases: ['hot', 'trending']
    })
  }

  async exec(message) {
    r.redditClient.getSubreddit('ffxiv').getHot().map(post => {
      // console.log(post.selftext)
      fs.writeFile('./temp/temp.json', JSON.stringify(post), (err) => {
        if (err) {
          console.error('Error: ', err)
        }

        console.log('Check to see if file created.')
      })

      // message.channel.send({
      //   embed: {
      //     title: `${post.link_flair_text} ${post.title.trunc(245)}`,
      //     url: `${post.url}`,
      //     timestamp: `${moment.unix(post.created_utc).format()}`,
      //     author: {
      //       name: `${post.author.name}`
      //     },
      //     fields: [
      //       {
      //         name: 'Contents',
      //         value: `${post.selftext.trunc(500)}`
      //       }
      //     ]
      //   }
      // })
    })
  }
}