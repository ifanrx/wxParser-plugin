const html2Json = require('./html2json');

module.exports = html => {
  if (Object.prototype.toString.call(html) !== '[object String]') {
    throw new Error('HTML 内容必须是字符串');
  }

  return html2Json.html2json(html)
};