/**
 * 这里主要编写函数相关demo
 */

var name = "windowsName";
var a = {
  name: "aName",
  showName: function(){
    console.log(this.name);
  }
}

// a.showName();
let b = a.showName;
// b();

/**
 * 实现 call 函数， apply函数， bind函数 */
Object.prototype.myCall = function(context) {
  context = context || window;    
  context.fn = this;
  let args = [...arguments].slice(1); // 去除上下文参数
  let r = context.fn(...args);
  delete context.fn;  // 移除新加的属性
  return r;
};

Object.prototype.myApply = function(context) {
  context = context || window;
  context.fn = this;
  let args = [...arguments][1];
  let r = context.fn(...args);
  delete context.fn;
  return r;
}

function User() {}

User.prototype.show = function(name) {
  console.log(name);
}

// User.prototype.show.myCall({}, 'call');
// User.prototype.show.myApply({}, ['apply']);

// my bind 实现
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
      _fn.apply(this, bindArgs.concat(fnArgs));
    }else {
      _fn.apply(context, bindArgs.concat(fnArgs));
    }
    
  }

  fNOP.prototype = this.prototype;    // 这里补上原型链上的属性
  fBound.prototype = new fNOP();
  
  return fBound;
}

function foo(x) {
  this.b = 100;
  // console.log(this.a, this.b);
  return this.a  + x;
}

let func = foo.myBind({a: 2}, 200);
let funcIns = new func();
// console.log(funcIns);

// 模拟实现 new 构造函数实现过程
function factory() {
  /**
   * 1. 创建空对象
   * 2. 空对象利用对应的构造函数初始化属性
   * 3. 空对象原型对象修改为目标原型对象
   * 4. 返回该对象
   */
  let obj = new Object();
  let constructor = [].shift.call(arguments);
  constructor.apply(obj, arguments);
  obj.__proto__ = constructor.prototype;
  return obj; 
}