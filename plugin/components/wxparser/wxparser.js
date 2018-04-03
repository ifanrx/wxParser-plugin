import parse from '../../api/index.js'
import tmpl from '../tmpl/tmpl.js'

Component({
  properties: {
    richText: {
      type: String,
      value: '',
      observer: function (richText) {
        let parsedData = parse(richText)
        this.setData({ richTextNode: parsedData.nodes })
        tmpl.init.call(this, { imgUrls: parsedData.imageUrls })
      }
    }
  },

  data: {
    richTextNode: ''
  }
})