require('dotenv').config()

import { AkairoClient } from 'discord-akairo'

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

  const redditClient = new Snoostorm(r)

  const submissionStream = redditClient.SubmissionStream({
    subreddit: 'ffxiv',
    results: 25
  })

  submissionStream.on('submission', (post) => {
    channel.send({
      embed: {
        title: `${post.title}`,
        url: `${post.url}`,
        timestamp: 
      }
    })
    console.log('Post Info: ', post)
    console.log(`New submission by ${post.author.name}`)
  })
}







