const { Command } = require('discord-akairo')
const moment = require('moment')
const r = require('../utils/redditUtil')

module.exports = class extends Command {
  constructor() {
    super('top', {
      aliases: ['top']
    })
  }

  async exec(message) {
    await r.redditClient.getSubreddit('ffxiv').getTop({ limit: 10, time: 'day' }).map(post => {
      if (post.selftext === '' && (post.post_hint === 'image' || post.post_hint === 'link')) {
        const imgUrl = (typeof post.preview === 'undefined') ? '' : post.preview.images[0].source.url
        // const title = ((post.link_flair_text === 'null') || (post.link_flair_text === '')) ? `${post.title.trunc(225)}` : `${post.link_flair_text} ${post.title.trunc(225)}`

        message.channel.send({
          embed: {
            title: `${post.title.trunc(225)}`,
            url: `https://reddit.com${post.permalink}`,
            color: 4289797,
            footer: {
              icon_url: 'http://i.imgur.com/sdO8tAw.png',
              text: 'Reddit'
            },
            timestamp: `${moment.unix(post.created_utc).format()}`,
            image: {
              url: `${imgUrl}`
            },
            author: {
              name: 'r/ffxiv'
            },
            fields: [
              {
                name: 'Author',
                value: `${post.author.name}`
              }
            ]
          }
        })
      } else {
        const imgUrl = (typeof post.preview === 'undefined') ? '' : post.preview.images[0].source.url
        // const title = ((post.link_flair_text === 'null') || (post.link_flair_text === '')) ? `${post.title.trunc(225)}` : `${post.link_flair_text} ${post.title.trunc(225)}`

        message.channel.send({
          embed: {
            title: `${post.title.trunc(225)}`,
            url: `https://reddit.com${post.permalink}`,
            color: 4289797,
            footer: {
              icon_url: 'http://i.imgur.com/sdO8tAw.png',
              text: 'Reddit'
            },
            timestamp: `${moment.unix(post.created_utc).format()}`,
            image: {
              url: `${imgUrl}`
            },
            author: {
              name: 'r/ffxiv'
            },
            fields: [
              {
                name: '\u200b',
                value: `${(post.selftext === '') ? "\u200b" : post.selftext.trunc(500)}`
              },
              {
                name: 'Author',
                value: `${post.author.name}`
              }
            ]
          }
        })
      }
    })
  }
}