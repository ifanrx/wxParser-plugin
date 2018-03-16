const elements = require('./elements');

const startTagReg = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const endTagReg = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
const attrReg = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

/**
 * 解析 HTML
 * @param {String} html    HTML 内容
 * @param {Object} handler 处理器
 */
const parseHtml = (html, handler) => {
  let index;
  let isText;
  let match;
  let stack = [];
  let last = html;
  // 只存放非自闭合普通标签，不存放空标签、特殊标签和自闭合标签
  stack.last = function () {
    return this[this.length - 1];
  };

  while (html) {
    isText = true;

    if (!stack.length || !elements.special[stack.last()]) {
      if (html.indexOf('<!--') === 0) { // comment
        index = html.indexOf('-->'); // indexOf 会匹配到第一个满足条件的字符位置
        if (index !== -1) {
          if (handler.comment) {
            // 因为注释信息不会像其他标签那样包含内部标签，所以可以直接传注释内容给 handler 处理
            handler.comment(html.substring(4, index));
          }
          html = html.substring(index + 3);
          isText = false;
        }
      } else if (html.indexOf('</') === 0) { // end tag
        match = html.match(endTagReg);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(endTagReg, parseEndTag);
          isText = false;
        }
      } else if (html.indexOf('<') === 0) { // start tag
        match = html.match(startTagReg);
        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(startTagReg, parseStartTag);
          isText = false;
        }
      }

      // 处理文本内容
      if (isText) {
        index = html.indexOf('<');
        let text = ''
        while (index === 0 && !html.match(startTagReg)) { // 处理以 < 开头，但是却不满足 startTagReg 的情况
          text += '<';
          html = html.substring(1);
          index = html.indexOf('<');
        }
        text += index < 0 ? html : html.substring(0, index);
        html = index < 0 ? '' : html.substring(index);

        if (handler.text) {
          handler.text(text);
        }
      }

    } else {
      html = html.replace(new RegExp("([\\s\\S]*?)<\/" + stack.last() + "[^>]*>"), function (all, text) {
        // 丢弃 special tag 内部的所有内容，包括该 special tag 的闭合标签
        return '';
      });
    }

    if (html === last) {
      throw new Error('解析 html 内容时出席异常');
    }

    last = html;
  }

  if (stack.length) {
    throw new Error('HTML 内容存在未关闭的标签，会导致未关闭标签的内容无法被解析');
  }

  /**
   * 解析开始标签
   * @param  {String} match    匹配结果
   * @param  {String} tagName  标签名称
   * @param  {String} attrsStr 属性信息
   * @param  {String} unary
   */
  function parseStartTag(match, tagName, attrsStr, unary) {
    // 举例：
    // match: <p style="text-align: center; " width="100">
    // tagName: p
    // attrsStr: style="text-align: center; " width="100"

    tagName = tagName.toLowerCase();

    let isUnary = elements.empty[tagName] || unary;

    // 空标签、自闭和标签、特殊标签不需要进 stack
    if (!isUnary && !elements.closeSelf[tagName] && !elements.special[tagName]) {
      stack.push(tagName);
    }

    if (handler.start && !elements.special[tagName]) {
      let attrs = [];

      attrsStr.replace(attrReg, function (match, name, value) {

        if (elements.fillAttrs[name]) {
          value = name;
        }

        attrs.push({
          name: name,
          value: value || '',
        });
      });

      handler.start(tagName, attrs, isUnary);

    }
  }

  /**
   * 解析结束标签
   * @param  {String} match   匹配结果
   * @param  {String} tagName 标签名称
   */
  function parseEndTag(match, tagName) {
    if (!tagName) {
      return;
    }

    // 找到最近同种类型的未关闭标签的位置
    tagName = tagName.toLowerCase();
    let closestOpenedTagPos = -1;
    for (let pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos] == tagName) {
        closestOpenedTagPos = pos;
        break;
      }
    }

    if (closestOpenedTagPos >= 0) {
      if (handler.end) {
        handler.end(stack[closestOpenedTagPos]);
      }
      // 处理后从 stack 中移除该标签
      stack.length = closestOpenedTagPos;
    }
  }
};

module.exports = {
  parseHtml
};
