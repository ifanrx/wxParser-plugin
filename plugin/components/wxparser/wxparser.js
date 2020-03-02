import parse from '../../api/index.js'
import tmpl from '../tmpl/tmpl.js'

Component({
  properties: {
    richText: {
      type: String,
      value: '',
    },
    imageLazyLoad: {
      type: Boolean,
      value: false,
    },
    imagePreview: {
      type: Boolean,
      value: true,
    },
  },

  observers: {
    'richText, imageLazyLoad': function(richText, imageLazyLoad) {
      let parsedData = parse(richText)
      this.setData({ richTextNode: parsedData.nodes.map(item => {
        if (item.tag === 'img') {
          item.imageLazyLoad = imageLazyLoad
        }
        return item
      })})
      tmpl.init.call(this, { imgUrls: parsedData.imageUrls })
    }
  },

  options: {
    styleIsolation: 'apply-shared',
  },

  data: {
    richTextNode: ''
  },

  lifetimes: {
    attached: function () {
      this.triggerEvent('attached')
    },

    ready: function() {
      this.triggerEvent('ready')
    },

    detached: function() {
      this.triggerEvent('detached')
    }
  }
})