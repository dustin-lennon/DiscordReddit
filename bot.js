require('dotenv').config()

const { AkairoClient } = require('discord-akairo')
const moment = require('moment')

// import * as SQLite from 'better-sqlite3'

// Reddit Configuration
const Snoostorm = require('snoostorm')
const r = require('./utils/redditUtil')

// Discord configuration
const discordClient = new AkairoClient({
  ownerID: process.env.DISCORD_OWNER_ID,
  prefix: process.env.DISCORD_PREFIX,
  allowMention: false,
  commandDirectory: './commands/',
  inhibitorDirectory: './inhibitors/',
  listenerDirectory: './listeners'
}, {
    disableEveryone: true
  })

// SQlite 

discordClient.build()

discordClient.login(process.env.DISCORD_CLIENT_TOKEN).then(() => {
  console.log(`Logged in as ${discordClient.user.tag}`)

  const redditChan = discordClient.channels.get('514300373452849152')

  readFfxivSubreddit(redditChan)
})

function readFfxivSubreddit(channel) {
  const redditClient = new Snoostorm(r.redditClient)

  const submissionStream = redditClient.SubmissionStream({
    subreddit: 'ffxiv',
    results: 10
  })

  submissionStream.on('submission', (post) => {
    if (post.selftext === '' && (post.post_hint === 'image' || post.post_hint === 'link')) {
      const imgUrl = (typeof post.preview === 'undefined') ? '' : post.preview.images[0].source.url
      // const title = ((post.link_flair_text === 'null') || (post.link_flair_text === '')) ? `${post.title.trunc(225)}` : `${post.link_flair_text} ${post.title.trunc(225)}`

      channel.send({
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

      channel.send({
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
