# wxParser-plugin 使用指南

### 介绍

`wxParser-plugin` 为 `wxParser` 的微信小程序插件版本，与 `wxParser` 相比，`wxParser-plugin` 减少了很多繁琐的使用步骤，同时简化了接口。并且使用微信小程序插件，可以方便地对插件进行版本管理。


### 使用

1. 在微信小程序管理后台，按 APPID `wx9d4d4ffa781ff3ac` 搜索到该插件，并点击添加，即可在代码中使用 `wxParser-plugin` 了

2. 在 `app.json` 中声明插件引入。目前插件版本为 `0.1.0`，`provider` 为该插件的 APPID，`wxparserPlugin` 为自定义的插件名称。

```json
"plugins": {
  "wxparserPlugin": {
    "version": "0.1.0",
    "provider": "wx9d4d4ffa781ff3ac"
  }
}
```

3. 在需要使用到该插件的小程序页面的 `json` 配置文件中，做如下配置：

```json
{
  "usingComponents": {
    "wxparser": "plugin://wxparserPlugin/wxparser"
  }
}
```

4. 使用

```html
<wxparser rich-text="{{richText}}" />
```

### 组件属性介绍

| 参数                | 类型     | 必填  |默认值 | 说明 |
| :----------         | :---    | :--- | :--- | :--- |
| rich-text           | String    | 是    | ''    | 你的富文本字符串 |
| image-lazy-load     | Boolean   | 否    | false | 图片懒加载，设置小程序 image 标签的 lazy-load 属性 |
| image-zoom          | Boolean   | 否    | true  | 图片点击放大，为 true 时，富文本中所有的 image 标签在点击后都将放大 |
| bind:tapImg         | Function  | 否    | -     | 监听图片点击事件，通过 e.detail.src 可拿到图片地址 |
| bind:tapLink        | Function  | 否    | -     | 监听链接点击事件，由于微信小程序插件的限制，目前无法在插件中使用 wx.navigato 等跳转链接接口，开发者如需使用链接跳转功能，可在该事件的监听函数中操作 |
| bind:bindImgLoad    | Function  | 否    | -     | 监听图片加载事件，当图片载入完毕时触发，通过 e.detail.src 可拿到图片地址 |
| bind:ready          | Function  | 否    | -     | 组件生命周期： ready |
| bind:attached       | Function  | 否    | -     | 组件生命周期： attached |
| bind:detached       | Function  | 否    | -     | 组件生命周期： detached |

具体使用

```html
<wxparser rich-text="{{richText}}" bind:tapLink="goto" />
```

```js
goto: function(e) {
  wx.navigateTo({
    url: e.detail.href
  })
}
```

注：由于小程序的限制，链接必须为你的小程序中的页面的路径。
