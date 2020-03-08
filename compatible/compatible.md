# 兼容问题
> 这里主要记录在平时开发过程中遇到的兼容性问题以及解决方案<br>
> 更新时间：2019.11.23

## ios移动端 Iframe宽度被内容撑出设备宽度
解决方案
```html
<style>
iframe {    /* 解决 ios 下，iframe 宽度被 iframe 内容撑开问题，配合 scrolling 属性*/
    width:1px;
    min-width: 100%;
    *width:100%;
}
</style>
<iframe  height="100%" frameborder="0" src="xxx" id="exqIframe"></iframe>

<script>
    var exqFrameUa = navigator.userAgent;
    var isIOS = !! exqFrameUa.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否是 ios 环境
    var exqIframe = document.getElementById('exqIframe');
    if(isIOS) {
        if(screen.width == 375 && screen.height == 812) {   // iphoneX 会出现不滚动情况
        exqIframe.scrolling = "yes"
        }else if(screen.width == 414 && screen.height == 896){  // iphone11 会出现不滚动的情况
            exqIframe.scrolling = "yes"
        }else {
             exqIframe.scrolling = "no"; // ios 环境下设置此属性 为 no
        }
    }
</script>
```

## transform中宽、高为奇数，会导致文字、边框模糊  
* 原因： 像素是浏览器的渲染单位，没有小数之分。若宽、高为奇数，经过 `transform: translate(xx, xx)`可能会变小数，导致模糊
* 解决方案：宽、高统一设置成偶数

## canvas 画图在高清屏下会模糊问题
* 原因
  * canvas不是矢量图，而是跟图片一样是位图模式的。
  * 高`dpi`显示意味着每平方英寸有更多的像素，比如说二倍屏，浏览器会以2个像素点的宽度来渲染一个像素
* 解决方案
  ```js
  var getPixelRatio = function(context) {
    var backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
      return (window.devicePixelRatio || 1) / backingStore;
  };

  //调用
  var ratio = getPixelRatio(ctx); // 获取到真正要放大的尺寸，对于文字、图片都应相应放大对应的倍数
  var fontSize = $('html').css('fontSize');
  var baseFontSize = ratio * fontSize;  // 放大倍数，解决模糊的问题
  ```
## IE 兼容问题
  * `img`标签不支持流，后台尽量返回`Content-type: image/png`格式
  * ie中的`dom`节点并不存在`append`方法，`jQuery`可以的原因是内部使用了`appendChild`方法