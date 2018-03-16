const html2Json = require('./html2json');

/**
 * 主解析函数
 * @param  {Object}   options                             配置参数
 * @param  {String}   [options.bind=wxParserData]         绑定的变量名
 * @param  {String}   options.html                        HTML 内容
 * @param  {Object}   options.target                      要绑定的模块对象
 * @param  {Boolean}  [options.enablePreviewImage=true]   是否启用预览图片功能
 * @param  {Function} [options.tapLink]                   点击超链接后的回调函数
 */
const parse = ({ bind = 'wxParserData', html, target, enablePreviewImage = true, tapLink }) => {
  if (Object.prototype.toString.call(html) !== '[object String]') {
    throw new Error('HTML 内容必须是字符串');
  }
  let that = target;
  let transData = {}; // 存放转化后的数据
  transData = html2Json.html2json(html, bind);

  let bindData = {};
  bindData[bind] = transData;

  that.setData(bindData)

  // 加载图片后回调函数
  that.loadedWxParserImg = (e) => {

  };

  // 点击图片
  that.tapWxParserImg = (e) => {
    if (!enablePreviewImage) {
      return;
    }
    let src = e.target.dataset.src;
    let tagFrom = e.target.dataset.from;
    if (typeof (tagFrom) !== 'undefined' && tagFrom.length > 0) {
      wx.previewImage({
        current: src, // 当前显示图片的 http 链接
        urls: that.data[tagFrom].imageUrls // 需要预览的图片 http 链接列表
      })
    }
  };

  // 点击超链接
  if (Object.prototype.toString.call(tapLink) === '[object Function]') {
    that.tapWxParserA = (e) => {
      let href = e.currentTarget.dataset.href;
      tapLink(href);
    };
  }

};

module.exports = {
  parse
}
