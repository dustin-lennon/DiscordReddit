require('dotenv').config()

import { AkairoClient } from 'discord-akairo'
import * as moment from 'moment'

// Reddit Configuration
const Snoowrap = require('snoowrap')
const Snoostorm = require('snoostorm')

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
  const r = new Snoowrap({
    userAgent: 'discordjs:com.stelth2000inc.ffxivreddit:v1.0.0 (by /u/demonicpagan)',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
  })

  r.config({ debug: true })

  const redditClient = new Snoostorm(r)

  const submissionStream = redditClient.SubmissionStream({
    subreddit: 'ffxiv',
    results: 25
  })

  submissionStream.on('submission', (post) => {
    const timestamp = moment.unix(post.created_utc).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')

    console.log('timestamp: ', timestamp)

    // Take a look at post.selftext and truncate if longer than 1024 characters
    String.prototype.trunc = function (n) {
      return this.substr(0, n - 1) + (this.length > n ? '...' : '');
    }

    console.log(post.selftext.trunc(500))

    channel.send({
      embed: {
        title: `${post.link_flair_text} ${post.title}`,
        url: `${post.url}`,
        color: 2993093,
        timestamp: `${timestamp}`,
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







