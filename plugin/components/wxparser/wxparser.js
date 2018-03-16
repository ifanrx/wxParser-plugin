import parse from '../../api/index.js'
import tmpl from '../tmpl/tmpl.js'

Component({
  properties: {
    richText: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.setData({richTextNode: (parse(newVal)).nodes})
      }
    },
    tapWxParserImg: {
      type: Function,
    },
    tapWxParserLink: {
      type: Function,
    },
  },

  data: {
    richTextNode: ''
  },

  ready: function() {
    tmpl.init.call(this, {
      tapWxParserImg: this.tapWxParserImg,
      tapWxParserLink: this.tapWxParserLink,
    })
  }
})