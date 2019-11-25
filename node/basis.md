# 基础
> 更新时间：2019.11.24
## 基本概念
> 关键词：`require`, `exports`, `module`

* require
  * 概念：该函数用于在当前模块加载和使用别的模块。传入模块名，返回模块对象。
  * 用法
    ```js
    var foo1 = require('./foo');  // 相对路径
    var foo2 = require('./foo.js');
    var foo3 = require('/home/user/foo'); // 绝对路径
    var foo4 = require('/home/user/foo.js');

    // foo1至foo4中保存的是同一个模块的导出对象。
    var data = require('./data.json');  // 可以这样加载和使用一个`JSON`文件
    ```
* exports
  * 概念：当前模块的导出对象，用于导出模块公有方法和属性。 
  * 用法：
    ```js
    exports.hello = function () {
        console.log('Hello World!');
    };
    ```
* module
  * 概念：通过`module`对象可以访问到当前模块的一些相关信息，但最多的用途是替换当前模块的导出对象。
  * 用法
    ```js
    module.exports = function () {
        console.log('Hello World!');
    };
    ``` 
* 模块初始化
  * 概念：一个模块中的`JS`代码仅在模块第一次被使用时执行一次，并在执行过程中初始化模块的导出对象。之后，缓存起来的导出对象被重复利用。 
  * 示例
    ```js
    // counter.js
    var i = 0;

    function count() {
        return ++i;
    }

    exports.count = count;

    // main.js
    var counter1 = require('./util/counter');
    var counter2 = require('./util/counter');

    console.log(counter1.count());  // 1
    console.log(counter2.count());  // 2
    console.log(counter2.count());  // 3
    // 可以看出, counter.js 并没有因为被 require 了两次而初始化两次
    ```
  * 模块化规范的其他知识
    * `Node.js`使用 `CommonJS` 模块规范，其他相似的模块规范请点击点击[查看](https://juejin.im/post/5c17ad756fb9a049ff4e0a62) <br>
  <br>![模块化规范](https://wuqiongjie.github.io/qjie-note/static/module-rule.png)   

## 内置模块
> 关键词：`fs`, `path`, `Buffer`, `stream`, `url`

* `fs`模块
  * api文档：http://nodejs.cn/api/fs.html
* `Buffer`模块（数据块）
  * api文档：http://nodejs.cn/api/buffer.html
* `Stream`模块（数据流）
  * api文档：http://nodejs.cn/api/stream.html
* `Path`模块（文件路径）
  * api文档：http://nodejs.cn/api/path.html
* `Url`模块（请求地址路径）
  * api文档：http://nodejs.cn/api/url.html
* `Querystring`模块（解析和格式化 url）
  * api文档：http://nodejs.cn/api/querystring.html
* `http`模块（创建客户端或服务端）
  * api文档：http://nodejs.cn/api/http.html    