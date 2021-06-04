
module.exports = {
  "url": (process.env.CONTEXT === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL) || "",
  "baseurl": process.env.BASE_URL || ""
}

