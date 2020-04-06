## Promise
> 更新时间：2020.4.5

主要知识点：
* 背景
* Promise 是什么？
* Promise 的使用？
* Promise 的错误监测？
* Promise 实例对象的方法  
* Promise 的实现？

> 背景
* 线程
* 同步和异步
* 阻塞和非阻塞

> Promise 是什么
* 概念：`Promise`对象用于表示一个异步操作的最终完成或失败，及其结果值。
* 作用：处理回调地狱，使回调变得扁平化

> Promise 的使用
* 语法
  ```js
  let p = new Promise((resolve, reject) => {
    console.log('这里的代码会同步执行');
    resolve();  // 这里会创建一个 微任务，并且将其放到微任务队列中
    // reject(); 这里也会创建一个 微任务，并且将其放到微任务队列中
  });

  p.then((res) => {
    // 成功时执行的回调，也就是微任务队列中的任务
  }, (reason) => {
    // 失败时执行的回调，也就是微任务队列中的任务
  });
  ```
* 状态
  * `pending`：即`new Promise`时返回的对象状态
  * `resolved`：调用`resolve`方法时改变的状态
  * `rejected`：调用`reject`方法时改变的状态
* 注意：
  * 状态一旦变为成功 or 失败，都不可逆，即不能从`resolved`变为`rejected`
  * `p.then()`：返回也是一个`promise`对象
  * `then`方法中若返回的值里面包括了`then`方法，则会自动将返回值包装为`Promise`对象，`then`方法的返回值可以自定义修改。  

> Promise 的错误监测
* 方式
  * `then(success, error)`：可以通过`error`方法处理，这是一个`promise`对应一个
    * 缺点：每个实例都必须传一个错误处理函数
    * 优点：精确知道是哪个`promise`失败
  * `catch`：放在`promise`链调用最后，用于捕获`promise`(没有设置错误处理的)产生的错误
    * 优点：只写一个，就可以捕获到其他的错误
    * 缺点：无法知道是哪个`catch`


> Promise 实例的方法
* `then`：`resolve`或者`reject`回调时的函数
* `catch`：`reject`时调用
* `finally`：无论加载成功或失败，都调用
* `Promise.resolve`：创建`Promise`对象并且调用`resolve`方法
* `Promise.reject`：创建`Promise`对象并且调用`reject`方法
* `Promise.race`：`Promise`队列中又一个执行完（有一个成功）
* `Promise.all`：`Promise`队列中全部执行完（成功）
* `Promise.allSettled`：`Promise`队列中全部执行，无论成功或者失败

> Promise 的实现

## 参考
* [使用Promise - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)