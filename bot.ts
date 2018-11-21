require('dotenv').config()

import { AkairoClient } from 'discord-akairo'
import * as moment from 'moment'

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
    results: 25
  })

  submissionStream.on('submission', (post) => {
    console.log('text: ', post.selftext)
    console.log(post.selftext.trunc(500))

    channel.send({
      embed: {
        title: `${post.link_flair_text} ${post.title}`,
        url: `${post.url}`,
        color: 2993093,
        timestamp: `${moment.unix(post.created_utc).format()}`,
        author: {
          name: `${post.author.name}`
        },
        fields: [
          {
            name: 'Contents',
            value: `${post.selftext.trunc(500)}`
          }
        ]
      }
    })
  })
}
