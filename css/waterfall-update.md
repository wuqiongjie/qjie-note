# 瀑布流布局
> 更新时间：2019.11.25<br>

本文主要讲解的点包括以下：
* 什么是瀑布流布局，它的排列又是怎样的。
* 瀑布流布局的几种实现方案及其实现原理。

## 基本概念
> 什么是瀑布流呢？排列方式？

答： 瀑布流又称瀑布流式布局，视觉表现为参差不齐的多栏布局; 排列方式表现为页面容器内的多个**高度不固定**元素之间按照**一定的间隔**参差不齐的无序浮动。
## 实现方案
> 方案1：采用 absolute + js 实现

* 实现原理
  * 定布局：容器定位设置为`position: relative`，元素定位设置为`position: absolute`。 
  * 定列数：根据**元素宽度**以及浏览器**页面宽度**来得出要展示的列数`n`（这里暂记为`n`）。 
  * 定初值：先初始化一行，并用长度为`n`的数组记录该行的元素基本数据。（包括`left`, `height`, `top`，用于下次插入元素使用）。
  * 定位置：查找数组中(`top` + `height`)最小的那位，并将要插入的元素插入到该列，并更新当前列的`height`，`top`值。循环当前步骤，直至所有元素全部添加到节点上。
  * 定高度：查找数组中（`top` + `height`）最大的那位，作为父节点的高度以撑开父元素的内容。
* 优缺点：定位精准，但相对来说采用`js`来动态计算不是很好。
* 示例： 
  ```html
  <style>
        #container {
          position: relative;
        }
        .item {
          width: 200px;
          box-sizing: border-box;
          border: 1px solid red;
        }
    </style>
    <div id='container'>
        <div class='item' style='height: 200px;'>测试内容1，我高度为200px</div>
        <div class='item' style='height: 300px;'>测试内容2，我高度为300px</div>
        <div class='item' style='height: 400px;'>测试内容3，我高度为400px</div>
        <div class='item' style='height: 200px;'>测试内容4，我高度为200px</div>
        <div class='item' style='height: 300px;'>测试内容5，我高度为300px</div>
        <div class='item' style='height: 400px;'>测试内容6，我高度为400px</div>
        <div class='item' style='height: 200px;'>测试内容7，我高度为200px</div>
        <div class='item' style='height: 400px;'>测试内容8，我高度为400px</div>
      </div>  
  ```
  ```js
  // 这里只展示两列的
    var containerDom = document.getElementById('container');
    var itemArr = document.querySelectorAll('.item');
  
    var minObject = null;
    var maxObject = null;
    var gab = 20; // 列之间的间距，上下元素的间距
    var width = 200;  // 元素的宽度
  
    var itemObjArr = [];
  
    itemArr.forEach(function(el, index) {
      let obj = {};
      if(index == 0) {
        obj.left = 0;
        obj.height = el.offsetHeight;
        obj.top = 0;
        obj.index = 0;
        itemObjArr.push(obj); // 第一行第一列第一个元素（直接push）
      }else if(index == 1) {
        obj.left = gab + width;
        obj.height = el.offsetHeight;
        obj.top = 0;
        obj.index = 1;
        itemObjArr.push(obj); // 第一行第二列第一个元素（直接push）
      }else {
        // 找出最小值
        let minObject = JSON.parse(JSON.stringify(itemObjArr[0]));
        for(let i = 1; i < itemObjArr.length; i++) {
              if(minObject.top + minObject.height > itemObjArr[i].top + itemObjArr[i].height) {
            minObject = itemObjArr[i];
          }
        }
        // 定位置
        obj.left = minObject.left;
        obj.height = el.offsetHeight;
        obj.top = minObject.top + gab + minObject.height;
        obj.index = minObject.index;
        // 修改原先列所在的top以及 height值
        itemObjArr[minObject.index] = obj;
        minObject = null;
      }
  
      // 修改节点
      el.style.top = obj.top + 'px';
      el.style.left = obj.left + 'px';
      el.style.position = 'absolute';
    })

    // 获取最大值
    for(let i = 0; i < itemObjArr.length; i++) {
      let temp = itemObjArr[i];
      if(maxObject == null) {
        maxObject = temp;
        continue;
      }
  
      if(maxObject.top + maxObject.height < temp.top + temp.height) {
        maxObject = temp;
      }
    }

    containerDom.style.height = maxObject.top + maxObject.height + gab + 'px';  // 修改父容器高度
  ```

> 方案2：采用 flex 布局实现

* 实现原理
  * 定布局：设置父、子容器布局为`display: flex`，并且设置父容器方向为水平方向`flex-direction: row'`，设置子容器方向为垂直方向`flex-direction: columns;`
  * 定列数：根据自己的宽度来定义列数（`n`个子容器），并根据自己的规则获取每列多少个元素（即子容器里的元素个数）
  * 循环遍历子容器个数以及每个子容器里元素个数即可
* 优缺点：实现方式简单，纯`css`实现，较高性能；元素高度极端参差不齐的情况下不推荐使用。  
* 结构示例：
  ```html
  <div style='display: flex; flex-direction: row'>  // 父容器
    <div style='display: flex; flex-direction: columns;'> // 子容器一
        <div>展示内容</div>
        <div>展示内容</div>
        <div>展示内容</div>
        <div>展示内容</div>
    </div>
    <div style='display: flex; flex-direction: columns;'> // 子容器二
        <div>展示内容</div>
        <div>展示内容</div>
        <div>展示内容</div>
        <div>展示内容</div>
    </div>
  </div>

  ```

> 方案3：采用 multi-columns 实现

* 实现原理
  * 定列数：父容器设置`column-count`来确定列数，可通过`column-gap`来设置列间距
  * 防跨列：子元素设置` break-inside: avoid;`防止元素被切割
  * 循环遍历子元素即可 
* 优缺点
  * 纯`css`实现，较简单，也能实现瀑布流布局；兼容性一般，不推荐在元素高度参差不齐的情况下使用。
* 示例结构：
  ```html
    <div style="column-count: 2; column-gap: 20">
        <div style="break-inside: avoid;">展示条目1</div>
        <div style="break-inside: avoid;">展示条目1</div>
        <div style="break-inside: avoid;">展示条目1</div>
        <div style="break-inside: avoid;">展示条目1</div> 
        <div style="break-inside: avoid;">展示条目1</div>
    </div>
  
  ``` 
## 总结
 若元素高度较为统一，则推荐方案二以及方案三，若兼顾浏览器兼容性，则推荐方案二。对于元素高度较为参差不齐，推荐采用方案一，精准定位。