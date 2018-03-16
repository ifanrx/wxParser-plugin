function init(config) {
  let _this = this

  _this.tapWxParserImg = e => {
    if (config && config.tapWxParserImg) {
      config.tapWxParserImg()
      return
    }

    let src = e.target.dataset.src;

    if(src) {
      wx.previewImage({
        current: src,
        urls: [src]
      })
    }
  },

  _this.tapWxParserLink = e => {
    if (config && config.tapWxParserLink) {
      config.jump()
      return
    }
  }
}

module.exports = {
  init
}

