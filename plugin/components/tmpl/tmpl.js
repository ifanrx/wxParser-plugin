const utils = require('../../api/utils')

function init(config) {
  let _this = this

  // 暴露图片点击事件给用户，返回图片地址
  _this.tapWxParserImg = e => {
    let src = e.currentTarget.dataset.src

    if (src && _this.data.imagePreview) {
      wx.previewImage({
        current: src,
        urls: config.imgUrls
      })
    }
    this.triggerEvent('tapImg', {
      src: src
    })
  },

  // 暴露链接点击事件给用户，需要 wx.navigateTo 接口，微信小程序插件目前暂不开放，因此提供该接口给用户自己触发链接跳转（链接必须为该小程序中的页面）
  _this.tapWxParserLink = e => {
    this.triggerEvent('tapLink', {
      href: e.currentTarget.dataset.href
    })
  }

  _this.bindImgLoad = e => {
    let src = e.currentTarget.dataset.src
    this.triggerEvent('bindImgLoad', {
      src: src
    })
  }
}

function initAudio(data) {
  let _this = this

  // create audios instance
  let audios = []
  let isMultiAutoplay = 0
  data.audios.forEach(item => {
    const instance = wx.createInnerAudioContext()
    instance.src = item.attr.src
    instance.loop = item.attr.loop

    // 存在多个autoplay的音频时，只自动播放第一个
    if (item.attr.autoplay) {
      isMultiAutoplay++
    }
    if (isMultiAutoplay===1 && item.attr.autoplay) {
      instance.autoplay = true
      responseAudioData.call(this,instance,item.attr.src)
    } else {
      instance.autoplay = false
    }

    const obj = {
      'src': item.attr.src,
      'instance': instance
    }
    audios.push(obj)
  })

  _this.handleClickAudio = (e) => {
    const src = e.currentTarget.dataset.src
    // instance
    const current = audios.filter(item => {
      if (item.src !== src) {
        item.instance.pause()
        return false
      }

      if (item.instance.paused) {
        item.instance.play()
      } else {
        item.instance.pause()
      }
      return item
    })

    //data
    const currentInstance = current[0].instance
    responseAudioData.call(this,currentInstance,src)
  }
}

function responseAudioData(instance,src) {
  const richTextNode = this.data.richTextNode
  // audio总是独占一行，外层包裹一个p元素，所以只需遍历两次即可
  richTextNode.forEach((item) => {
    if (!item.nodes || item.node.length === 0) return false

    item.nodes.forEach((subItem) => {
      if (subItem.tag !== 'audio') return false

      if (subItem.attr.src !== src) {
        subItem.isPlaying = false
        return false
      }

      subItem.isPlaying = !subItem.isPlaying
      clearInterval(this.timer)
      this.timer = null
      if (subItem.isPlaying) {
        this.timer = setInterval(() => {
          subItem.currentTime = utils.formatterTime(instance.currentTime)

          this.setData({
            richTextNode
          })
        }, 1000)
      }

      // 监听audio的暂停事件
      // 以便在锁屏、小程序退出后台等非用户主动按下暂停的情况下更新isPlaying
      instance.onPause(()=>{
        subItem.isPlaying = false
      })
    })
  })

  this.setData({
    richTextNode
  })
}

module.exports = {
  init,
  initAudio
}
