module.exports = {
  /**
   * 生成 Map
   * @param  {String} str 以逗号分隔的字符串
   * @return {Object}     映射表
   */
  makeMap: (str) => {
    let map = {};
    let items = str.split(',');
    for (let i = 0, len = items.length; i < len; i++) {
      map[items[i]] = true;
    }
    return map;
  },
  /**
   * 根据 size 属性得到字体大小
   * @param  {Number|String} size
   * @return {String}
   */
  getFontSizeByAttribsSize: function (size) {
    var fontSize;
    size = parseInt(size, 10);
    switch (size) {
      case 2:
        fontSize = 0.75;
        break;
      case 3:
        fontSize = 1;
        break;
      case 4:
        fontSize = 1.17;
        break;
      case 5:
        fontSize = 1.5;
        break;
      case 6:
        fontSize = 2;
        break;
      case 7:
        fontSize = 3;
        break;
      default:
        fontSize = 1;
    }
    return fontSize + 'em';
  },
}
