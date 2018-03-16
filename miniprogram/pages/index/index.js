var plugin = requirePlugin("myPlugin")
Page({
  data: {
    richText: '<p style="text-align: center;"><img src="https://media.ifanrusercontent.com/media/user_files/hydrogen/d3/bd/d3bd4900a1ca1ed76e3bd39b9961084d3fe8234c-ba44bb070dd36bc3a6a0adbe1b4faa524673fe9b.jpg"/></p><p><strong><br/></strong></p><h2>基本信息</h2><p><em>《2001太空漫游》（2001: A Space Odyssey）是由斯坦利·库布里克执导，根据科幻小说家亚瑟·克拉克小说改编的美国科幻电影，于1968年上映，被誉为“现代科幻电影技术的里程碑”。[1]&nbsp;</em></p><p><em>本片获得当年最佳美术指导、最佳导演、最佳编剧等4项奥斯卡奖提名，获最佳视觉效果奖，获1968年英国电影学院最佳摄影、最佳音响、最佳美工奖。</em></p><p style="text-align: center;"><br/></p><p><br/></p>'
  },

  methods: {
    tapWxParserLink: () => {
      console.log('link')
    }
  }
})