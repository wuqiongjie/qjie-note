# 瀑布流布局
> 更新时间：2019.11.23
## 方案1 -- absolute + js
* 布局：`absolute` + `javascript`控制
* 步骤
    * 定义容器布局为 `relative` 
    * 定义条目布局为 `absolute`
    * 计算一行展示`n`列，并且记录该行所有列的`top`, `left`, `index`, `height`值，用于下次插入`dom`节点做准备
    * 每次找到`top + height`的最小值，并将对应的`dom`插入到最小值的列中
* 优劣势：精准排位，靠js来排序，性能较差
* 容器结构
    ``` html
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

    ``` js
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
          itemObjArr.push(obj);
        }else if(index == 1) {
          obj.left = gab + width;
          obj.height = el.offsetHeight;
          obj.top = 0;
          obj.index = 1;
          itemObjArr.push(obj);
        }else {
          // 找出最小值
          let minObject = JSON.parse(JSON.stringify(itemObjArr[0]));
          for(let i = 1; i < itemObjArr.length; i++) {
                if(minObject.top + minObject.height > itemObjArr[i].top + itemObjArr[i].height) {
              minObject = itemObjArr[i];
            }
          }
          
          obj.left = minObject.left;
          obj.height = el.offsetHeight;
          obj.top = minObject.top + gab + minObject.height;
          obj.index = minObject.index;
          
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
    
      containerDom.style.height = maxObject.top + maxObject.height + gab + 'px';
    ```
## 方案2 -- flex
* 布局：`flex`
* 步骤：
    * 定义容器布局为`flex`，并且设置方向为水平方向(作为行)
    * 定义条目容器布局为`flex`，并且设置方向为垂直方向（作为列）
* 优劣势：采用 css 来进行布局，不依赖 js，缺点是如果有些很长，会照成整体样式不好看，比如一列很长，然后一列很短
* 结构
    ``` html
    <div style='display: flex; flex-direction: row'>
        <div style='display: flex; flex-direction: columns;'>
            <div>展示内容</div>
            <div>展示内容</div>
            <div>展示内容</div>
            <div>展示内容</div>
        </div>
        <div style='display: flex; flex-direction: columns;'>
            <div>展示内容</div>
            <div>展示内容</div>
            <div>展示内容</div>
            <div>展示内容</div>
        </div>
    </div>
    ```
## 方案3 -- multi-columns
* 布局：`Multi-columns`
* 步骤：
    * 父容器设置`column-count`以及`column-gap`，前者用于设置列数，后者用于设置列的间隔
    * 子条目设置` break-inside: avoid;`防止被切割
* 优劣势：兼容性较差，不采用 js ，也是纯 css
* 容器结构
    ``` html
    <div style="column-count: 2; column-gap: 20">
        <div style="break-inside: avoid;">展示条目1</div>
        <div style="break-inside: avoid;">展示条目1</div>
        <div style="break-inside: avoid;">展示条目1</div>
        <div style="break-inside: avoid;">展示条目1</div> 
        <div style="break-inside: avoid;">展示条目1</div>
    </div>
    ```