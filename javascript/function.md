## 函数那些事
> 更新时间：2020.4.1

主要知识点
* 函数定义方式
* this
* call
* apply
* bind
* new 

> 函数定义方式
* 定义方式
  * `new Function(name, '函数体')`
  * 函数声明：`function name() { // 函数体}`
  * 函数表达式：`let hhh = function() { // 函数体 }`,这种要注意声明顺序

> this
* 指向相关
  * 永远指向最后的调用者。
  * 示例
    ```js
    // 浏览器环境下
    var name = "windowsName";
    var a = {
      name: "Cherry",
      fn : function () {
        console.log(this.name);      // Cherry
      }
    }
    a.fn(); // Cherry
    let b = a.fn;
    b();  // windowsName

    // 示例2
    function fn() {
      var name = 'Cherry';
      innerFunction();
      function innerFunction() {
        console.log(this.name);      // windowsName
      }
    }
    fn(); // windowsName，声明函数，外围并不是对象定义的方法， 故其this指向window
    ```
* 如何改变 `this` 的指向
  * 通过`call`, `apply`, `bind`
  * 通过构造函数修改
  * 使用箭头函数(ES6语法)

> call
* 语法：`fun.call(thisArg, arg1, arg2...)`
* 作用：改变当前`this`的指向，并立即执行该函数。
* 实现
  ```js
  Object.prototype.myCall = function(context) {
    context = context || window;    
    context.fn = this;
    let args = [...arguments].slice(1); // 去除上下文参数
    let r = context.fn(...args);
    delete context.fn;  // 移除新加的属性
    return r;
  };
  ```

> apply
* 语法：`fun.apply(thisArg, [argsArray])`
* 作用：改变当前`this`的指向，并立即执行该函数。
* 实现：
  ```js
  Object.prototype.myApply = function(context) {
    context = context || window;
    context.fn = this;
    let args = [...arguments][1]; // apply 获取的第二个参数为数组，需要特殊处理
    let r = context.fn(...args);
    delete context.fn;            // 移除新加的属性
    return r;
  }
  ```

> bind
* 语法：`fun.bind(thisArg, args)`
* 作用：改变当前`this`的指向，返回改变指向后的函数, 并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。
* 实现：
  * 注意
    * bind需要返回函数
    * 可以多次传参，只取前若干项参数
    * 可以被`new`
  * 实例
    ```js
    Function.prototype.myBind = function(context) {
      if(typeof this !== 'function') {
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }
      let _fn = this; 
      let bindArgs = [...arguments].slice(1);
      
      let fNOP = function() {}
      let fBound = function() {
        let fnArgs = [...arguments];
        if(this instanceof fBound) {  // 这里判断是否是 new 操作符, new 出来的对象 this 指向构造函数原型
          _fn.apply(this, bindArgs.concat(fnArgs)); // 说明是实例对象，还是使用原来的上下文
        }else {
          _fn.apply(context, bindArgs.concat(fnArgs));  // 说明是方法调用，使用传参进来的上下文
        }
        
      }

      fNOP.prototype = this.prototype;    // 这里补上原型链上的属性
      fBound.prototype = new fNOP();
      
      return fBound;
    }
    ```

> new 
* 概念：创建一个用户定义的对象类型的实例
* 语法：`var a = new XXX();` 
* 实现
  ```js
  function factory() {
    /**
    * 1. 创建空对象
    * 2. 空对象利用对应的构造函数初始化属性
    * 3. 空对象原型对象修改为目标原型对象
    * 4. 返回该对象
    */
    let obj = new Object();
    let constructor = [].shift.call(arguments); // shift 会修改原数组
    constructor.apply(obj, arguments);  // 直接传参
    obj.__proto__ = constructor.prototype;  
    return obj; 
  }
  ```

## 参考
* [this, apply, call, bind](https://juejin.im/post/59bfe84351882531b730bac2)
* [call, apply, bind, new实现原理](https://juejin.im/post/5c73a602e51d457fd6235f66)
* [new 函数模拟实现](https://segmentfault.com/a/1190000009286643)