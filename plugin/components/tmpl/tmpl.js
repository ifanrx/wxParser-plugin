function init(config) {
  let _this = this

  // 暴露图片点击事件给用户，返回图片地址
  _this.tapWxParserImg = e => {
    let src = e.currentTarget.dataset.src

    if(src && _this.data.imagePreview) {
      wx.previewImage({
        current: src,
        urls: config.imgUrls
      })
    }
    this.triggerEvent('tapImg', { src: src })
  },

  // 暴露链接点击事件给用户，需要 wx.navigateTo 接口，微信小程序插件目前暂不开放，因此提供该接口给用户自己触发链接跳转（链接必须为该小程序中的页面）
  _this.tapWxParserLink = e => {
    this.triggerEvent('tapLink', { href: e.currentTarget.dataset.href })
  }

  _this.bindImgLoad = e => {
    let src = e.currentTarget.dataset.src
    this.triggerEvent('bindImgLoad', { src: src })
  }
}

module.exports = {
  init
}

