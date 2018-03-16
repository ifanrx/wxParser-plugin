const utils = require('./utils');
const elements = require('./elements');
const codeTransformation = require('./codeTransformation');
const htmlParser = require('./htmlparser');

let olTagCount = [];

/**
 * 移除文档头信息
 * @param  {String} str   HTML 内容
 * @return {String}
 */
const removeDOCTYPE = (str) => {
  return str.replace(/<\?xml.*\?>\n/, '').replace(/<.*!doctype.*\>\n/, '').replace(/<.*!DOCTYPE.*\>\n/, '');
};

/**
 * HTML 内容转化为 JSON 格式的对象
 * @param  {String} html     HTML 内容
 * @param  {String} bindName 绑定的数据名
 * @return {Object}
 */
const html2json = (html, bindName) => {
  html = removeDOCTYPE(html);

  // 节点缓冲区，与 htmlparser.js 中的 stack 对应，只存储非自闭和标签
  // 比如 <span></span>，而非 <img src="#"> 等
  let bufferNodes = [];
  let nodeStyles = [];
  // html2json 结果
  let results = {
    nodes: [],
    images: [],
    imageUrls: []
  };

  /**
   * 把节点放到父节点的 nodes 列表
   * @param  {Object} node 节点对象
   */
  const putNode2ParentNodeList = (node) => {
    if (bufferNodes.length === 0) { // 表明关闭此 node 时，不存在任何未关闭标签，也就是不存在父元素，所以直接挂到根节点即可
      results.nodes.push(node);
    } else {
      // 如果节点缓冲区还有节点，子节点会不断的被放到该子节点的父节点下，形成一个嵌套引用的节点对象。
      // 直到缓冲区没有节点，此时组装起来的整个嵌套引用节点对象会被放到根节点的 results.nodes 下
      let parent = bufferNodes[0]; // 取该 node 的父级节点
      if (parent.nodes === undefined) {
        parent.nodes = [];
      }
      node.parent = parent.tag
      parent.nodes.push(node);
    }
  };

  // 开始解析 HTML
  // 核心思路：
  // 1、遇到开始标签时，如果该标签是非自闭合标签，就把该节点存到缓存区（入栈），
  // 如果是自闭合标签、空标签等就直接存到根节点下（因为这种几点没有子节点）。
  // 2、当遇到文本时（文本也是节点），判断缓冲区是否还有节点，如果有，证明该节点有父节点，
  // 需要把此节点放到父节点的 nodes 列表，如果没有，则证明该节点没有父节点了，放到根节点即可。
  // 3、当遇到结束标签时，就从缓存区取出第一个节点（出栈），比较是否与该结束标签对应，
  // 如果不对应，证明逻辑出错。如果对应，则判断缓冲区是否还有节点，如果有，证明该节点有父节点，
  // 需要把此节点放到父节点的 nodes 列表，如果没有，则证明该节点没有父节点了，放到根节点即可。
  //
  // 总体来说，就是一个进栈出栈（节点缓冲区）的算法问题。
  htmlParser.parseHtml(html, {
    /**
     * 处理开始标签
     * @param  {String} tag       标签名称
     * @param  {Array}  attrs     属性
     * @param  {Boolean} isUnary  是否是自闭合标签
     */
    start: function (tag, attrs, isUnary) {
      let node = {
        node: 'element',
        tag: tag
      };

      if (elements.block[tag]) {
        node.tagType = 'block';
      } else if (elements.inline[tag]) {
        node.tagType = 'inline';
      } else if (elements.closeSelf[tag]) {
        node.tagType = 'closeSelf';
      }

      nodeStyles = [];

      if (attrs.length) {
        node.attr = {};
        attrs.map((item) => {
          if (item.name === 'style') { // 对 style 做单独处理，因为后面会根据 tag 添加更多的 style
            if (nodeStyles.indexOf(item.value) === -1) {
              nodeStyles.push(item.value);
            }
          }
          if (item.name === 'color') {
            nodeStyles.push('color: ' + item.value);
          }
          if (node.tag === 'font' && item.name === 'size') {
            nodeStyles.push('font-size: ' + utils.getFontSizeByAttribsSize(item.value));
          }

          // 特殊属性做转换
          if (item.name === 'class') {
            node.classStr = item.value;
          }

          node.attr[item.name] = item.value; // 重复的属性，后面的会覆盖前面的
        });

        node.styleStr = nodeStyles.join(' ');
      }

      if (node.tag == 'ol' || node.tag == 'ul') {
        olTagCount.push(0)
      }

      if (node.tag == 'li') {
        let len = olTagCount.length - 1
        olTagCount[len] = olTagCount[len] + 1
        node.order = olTagCount[len]
      }

      // img 标签 添加额外数据
      if (node.tag === 'img') {
        node.imgIndex = results.images.length;
        node.from = bindName;

        results.images.push(node);
        results.imageUrls.push(node.attr.src);
      }

      if (node.tag === 'video' || node.tag === 'audio') {
        node.attr.controls = !node.attr.controls ? false : true
        node.attr.autoplay = !node.attr.autoplay ? false : true
        node.attr.loop = !node.attr.loop ? false : true
      }

      if (node.tag === 'video') {
        node.attr.muted = !node.attr.muted ? false : true
      }

      if (node.tag === 'audio') {
        let params = node.attr['data-extra']
        if (params) {
           params = params.replace(new RegExp('&quot;', 'g'), '"');
           params = JSON.parse(params)
           node.attr.poster = params.poster
           node.attr.name = params.name
           node.attr.author = params.author
        }
      }

      if (isUnary) {
        // 自闭合标签，比如 <img src="https://github.com/pacochan/wxParser.png"/>
        // 这种类型不会进入 end 函数或者 text 函数处理，在 start 函数放入到父元素的 nodes 列表即可
        putNode2ParentNodeList(node);
      } else {
        // 只要有非自闭＆标签就往缓冲区保存节点，等待关闭
        bufferNodes.unshift(node);
      }
    },
    /**
     * 处理关闭标签
     * @param  {String} tag 标签名称
     */
    end: function (tag) {
      let node = bufferNodes.shift(); // 取出缓冲区的第一个的未关闭标签，也就是与该结束标签对应的标签

      if (node.tag !== tag) {
        throw new Error('不匹配的关闭标签');
      }

      if (node.tag == 'ol' || node.tag == 'ul') {
        olTagCount.pop()
      }

      if (node.tag === 'video' || node.tag === 'audio') {
        if (!node.attr.src) {
          let nodes = node.nodes
          let len = nodes.length
          let src = ''
          for (let i = 0; i < len; i++) {
            if (nodes[i].tag === 'source') {
              src = nodes[i].attr.src
              break
            }
          }
          node.attr.src = src
        }
      }

      putNode2ParentNodeList(node);
    },
    /**
     * 处理文本内容
     * @param  {String} text 文本字符串
     */
    text: function (text) {
      let node = {
        node: 'text',
        text: codeTransformation.transform(text),
      };

      putNode2ParentNodeList(node);
    },
    /**
     * 处理评论内容
     * @param  {String} content 注释内容
     */
    comment: function (content) {},
  });

  return results;

};

module.exports = {
  html2json
};
