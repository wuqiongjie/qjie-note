# 浏览器多标签页之间的通讯方式
> 更新时间：2019.11.30

本文主要记录如下内容：
* 浏览器多标签页之间的通讯方式

## 方案1
> 使用`localstorage`本地存储实现

* 用法
  * A 标签页： 监听`storage`事件
  * B 标签页： 调用`localStorage.setItem`方法
* 示例
    ``` js
    // 注意：A 标签页如果调用 localStorage.setItem 是不会触发该页面的 storage 事件的
    // A 页面中
    window.addEventListener("storage", function(event) {
      // 执行其他操作, B页面设置了key, 则A可以通过这个事件监听到
    })
    // B 页面中
    localStorage.setItem(key, value);
    
    ```
* 效果
    <br>![localStorage标签页通讯展示](https://wuqiongjie.github.io/qjie-note/gif/localStorage.gif)
* 兼容
  <br>![localStorage兼容性](https://wuqiongjie.github.io/qjie-note/static/localStorage.png)
* 不足：同源限制，不支持跨域
* 其他
  * [localStroage 相关 API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 方案2
> 使用`window.postMessage`实现

* 用法
    * 获取`window`对象：**A** 通过 `window.open`或者`iframe`获取 **B** 的`window`对象, **B** 可以通过`window.opener`来获取通讯对象（不是`window`对象）
    * 监听`message`事件：**A**, **B** 都监听`message`事件，即`window.addEventListener("message", function(event) {})`
    * 发送消息：**A** 通过`window.postMessage`发送消息给 **B**; **B** 通过`window.opener.postMessage`发送消息给**A**
    * 通过以上做法，可以实现两个窗口间的通信
* 示例
  * A 标签页
    ``` js
    // https://www.baidu.com
    window.addEventListener("message", function(event) {
        // 对发送过来的消息进行拦截
        // 执行重新获取信息操作
        console.log(event);
    })

    var Bwin = window.open("https://i.fkw.com");    // 打开新窗口，并且获取 B 窗口的 window 对象
    Bwin.postMessage("hello B, i am from A", "https://www.i.fkw.com");   // 发送消息给 B 窗口
    ```

  * B 标签页
    ``` js
    // https://i.fkw.com
    var Awin = window.opener;      // 获取 A 窗口通讯对象
    window.addEventListener("message", function(event) {
        // 执行其他操作
    });
    
    Awin.postMessage("hello A, i am from B", "https://www.baidu.com");  // 发送消息给 A 窗口
    ```
* 展示
    <br>![postMessage示例](https://wuqiongjie.github.io/qjie-note/gif/postMessage.gif)
* 兼容
    <br>![postMessage兼容](https://wuqiongjie.github.io/qjie-note/static/postMessage.png)
* 好处：支持跨域，推荐
* 其他
    * [postMessage 相关 API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

## 方案3
> 使用`SharedWorker`实现

* 用法
    * 服务端添加`sharedWorker.js`，用于客户端创建`SharedWorker`对象
    * 标签页创建`SharedWorker`对象：新打开的标签页必须创建`SharedWorker`对象，才能接收到其他标签页传送的信息
* 示例
    ``` js
    // sharedWorker.js 文件
    var clients = [];   // 存储每个标签页
    onconnect = function(e) {
      var port = e.ports[0];
      clients.push(port);   
      port.addEventListener('message', function(e) {
        for(var i = 0; i < clients.length; i++) {
          var eElement = clients[i];
          eElement.postMessage(e.data);
        }
      });
      port.start();
    }
    
    // page1 页面 page2 页面基本相同，都是定义一个 sharedWorker 对象
    var myWorker1 = new SharedWorker("./sharedWorker.js");
  
    myWorker1.port.postMessage('i am from page1');
  
    myWorker1.port.onmessage = function(e) {
        var result = e.data;  // 共享推过来的数据
        console.log(result);
    }
    ```
* 展示
    <br>![sharedWorker展示](https://wuqiongjie.github.io/qjie-note/gif/sharedWorker.gif)
* 兼容
    <br>![sharedWorker兼容性](https://wuqiongjie.github.io/qjie-note/static/sharedWorker.png)
* 不足：只能同源，并且`sharedWorker.js`文件放在服务端,兼容性一般; 
* 其他
    * [sharedWorker 相关 API ](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)   
    * [sharedWorker Demo](https://github.com/wuqiongjie/communicationDemo)
    * [参考链接](https://zhuanlan.zhihu.com/p/38380765)

## 其他
* `WebSocket`也可以实现多标签页之间的通讯，其是HTML5新增的协议，它的目的是在浏览器和服务器之间建立一个不受限的双向通信的通道。比如说，服务器可以在任意时刻发送消息给浏览器，这意味着 **B** 页面的消息可以由服务器发送给 **A**页面。
* `Cookie + setInterval`：只能同域，并且耗费资源过多，需要不断获取 `Cookie` 以判断 **B** 是否传消息给 **A** 页面。