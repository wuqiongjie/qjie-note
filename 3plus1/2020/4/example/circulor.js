/** 
 * Object.defineProperty 循环引用问题
 * 
*/

let obj = {
  a : 1
};

Object.defineProperty(obj, 'a', {
  get() {
    return this._a;
  },
  set(val) {
    this._a = val
  }
});

obj.a;