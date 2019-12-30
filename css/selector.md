# CSS 选择器相关
> 更新时间：2019.12.24

本文主要讲解以下几个内容：
* 选择器的位置关系

## 选择器的位置关系
> 祖孙选择器
* 符号：` `
* 例子：其中 `grandfather`与`child1`、`child2`、`child3`构成祖孙关系，表达式可以为`#grandfather #child1`
  ```html
  <div id="grandfather">
    <div id="father">
      <div id="child1"></div>
      <div id="child2"></div>
      <div id="child3"></div>
    </div>
  </div>
  ```

> 父子选择器
* 符号: `>`
* 例子：其中 `father`与`child1`、`child2`、`child3`构成父子关系，表达式可以为`#father>div`
  ```html
  <div id="grandfather">
    <div id="father">
      <div id="child1"></div>
      <div id="child2"></div>
      <div id="child3"></div>
    </div>
  </div>
  ```

> 相邻选择器
* 符号：`+`
* 例子：其中 `child1`与`child2`、`child2`和`child3`构成相邻关系关系，表达式可以为`#child1+div`, `#child2+div`
  ```html
  <div id="grandfather">
    <div id="father">
      <div id="child1"></div>
      <div id="child2"></div>
      <div id="child3"></div>
    </div>
  </div>
  ```

> 普通兄弟选择器
* 符号：`~`
* 例子：其中 `child1`、`child2`、`child3`构成兄弟关系，表达式可以为`#child1~`
  ```html
  <div id="grandfather">
    <div id="father">
      <div id="child1"></div>
      <div id="child2"></div>
      <div id="child3"></div>
    </div>
  </div>
  ```