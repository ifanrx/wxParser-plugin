var plugin = requirePlugin("myPlugin")
Page({
  data: {
    richText: ''
  },

  onLoad: function() {
    this.setData({
      richText: '<p style="text-align: center;"><img src="https://media.ifanrusercontent.com/media/user_files/hydrogen/d3/bd/d3bd4900a1ca1ed76e3bd39b9961084d3fe8234c-ba44bb070dd36bc3a6a0adbe1b4faa524673fe9b.jpg"/></p><p><strong><br/></strong></p><h2>基本信息</h2><p><em class="em">《2001太空漫游》（2001: A Space Odyssey）是由斯坦利·库布里克执导，根据科幻小说家亚瑟·克拉克小说改编的美国科幻电影，于1968年上映，被誉为“现代科幻电影技术的里程碑”。[1]&nbsp;</em></p><p><em>本片获得当年最佳美术指导、最佳导演、最佳编剧等4项奥斯卡奖提名，获最佳视觉效果奖，获1968年英国电影学院最佳摄影、最佳音响、最佳美工奖。</em></p><p style="text-align: center;"><br/></p><p><br/></p><p style="text-align: center;"><img src="https://cloud-minapp-7894.cloud.ifanrusercontent.com/1f3COHqMRKCJPPxG.jpg" width="1453" height="1083"/></p><p><a href="../other/index" target="_self" style="white-space: normal;">其它页面</a></p><section>adfasdfasdfasdf</section><img src="https://cloud-minapp-32117.cloud.ifanrusercontent.com/1j7YrKIS5zsQqpip.jpg" /><video src="https://cloud-minapp-32117.cloud.ifanrusercontent.com/1j8f1XTxvqKXHFiY.mp4"></video>'
    })
  },

  tapWxParserImg: function(e) {
    console.log(e.detail.src)
  },

  tapWxParserLink: function(e) {
    wx.navigateTo({
      url: e.detail.href
    })
  },

  wxParserImgLoad: function(e) {
    console.log(e.detail.src)
  },

  wxParserAttached: function() {
    console.log('wxParserAttached')
  },

  wxParserReady: function() {
    console.log('wxParserReady')
  },

  wxParserDetached: function() {
    console.log('wxParserDetached')
  },

  changeContent: function() {
    this.setData({
      richText: '<p style="text-align: center;"><img src="https://media.ifanrusercontent.com/media/user_files/hydrogen/d3/bd/d3bd4900a1ca1ed76e3bd39b9961084d3fe8234c-ba44bb070dd36bc3a6a0adbe1b4faa524673fe9b.jpg"/></p><p style="text-align: center;"><img src="https://cloud-minapp-7894.cloud.ifanrusercontent.com/1f3CQKqRSXpEXOhI.jpg" width="1453" height="1083"/></p>'
    })
  }
})