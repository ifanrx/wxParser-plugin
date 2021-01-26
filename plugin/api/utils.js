/**
 * 生成 Map
 * @param  {String} str 以逗号分隔的字符串
 * @return {Object}     映射表
 */
const makeMap = (str) => {
  let map = {}
  let items = str.split(',')
  for (let i = 0, len = items.length; i < len; i++) {
    map[items[i]] = true
  }
  return map
}
/**
 * 根据 size 属性得到字体大小
 * @param  {Number|String} size
 * @return {String}
 */
const getFontSizeByAttribsSize = function (size) {
  let fontSize
  size = parseInt(size, 10)
  switch (size) {
  case 2:
    fontSize = 0.75
    break
  case 3:
    fontSize = 1
    break
  case 4:
    fontSize = 1.17
    break
  case 5:
    fontSize = 1.5
    break
  case 6:
    fontSize = 2
    break
  case 7:
    fontSize = 3
    break
  default:
    fontSize = 1
  }
  return fontSize + 'em'
}
/**
 * 格式化数字：小于10的数字前补全0，大于10的数字直接返回
 * @param  {Number} data 0和正整数
 * @return {Number|String}
 */
const patch = (data) => {
  if (data < 10) {
    return `0${data}`
  }
  return data
}
/**
 * 格式化时间：秒数转换为00：00
 * @param  {Number} data 秒数
 * @return {Number|String}
 */
const formatterTime = (data) => {
  if (data > 3600) return data

  let result
  const value = Math.floor(data)
  if (value > 60) {
    const minutes = patch(Math.floor(value / 60))
    const seconds = patch(value % 60)
    result = `${minutes}:${seconds}`
  } else if (value > 9 && value < 61) {
    result = `00:${value}`
  } else {
    result = `00:0${value}`
  }
  return result
}

module.exports = {
  makeMap,
  getFontSizeByAttribsSize,
  formatterTime
}