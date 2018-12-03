const Snoowrap = require('snoowrap')

String.prototype.trunc = String.prototype.trunc ||
  function (n) {
    return (this.length > n) ? this.substr(0, n - 1) + '...' : this
  }

const r = new Snoowrap({
  userAgent: 'discordjs:com.stelth2000inc.ffxivreddit:v1.0.0 (by /u/demonicpagan)',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
})

r.config({ requestDelay: 5000, continueAfterRatelimitError: true, debug: true })

module.exports = {
  redditClient: r
}