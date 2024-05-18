module.exports = {
    // ... other Webpack configuration
    resolve: {
      fallback: {
        "buffer": false,
        "url": false,
        "https": false
      }
    }
  }