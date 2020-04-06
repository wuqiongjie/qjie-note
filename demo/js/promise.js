/**
 * promise 初始
 */

let p1 = new Promise((resolve, reject) => {
  resolve('hhhhh');
});

let p2 = p1.then((res) => {
  console.log(res);
}, (reason) => {
  console.log(reason);
});

//console.log(p1, p2);  // 浏览器输出结果：Promise{<resolved>} Promise{<pending>}

setTimeout(() => {
  // console.log(p1, p2);  // 浏览器输出结果：Promise{<resolved>} Promise{<resolved>}
}, 0)

/**
 * 问：为什么第一个console中 p2 是 pending，而第二个console中 p2 是 resolved？
 * 答：(1)p2 = p1.then()创建了Promise元素，并赋值给p2, 状态是 pending。
 *     (2)执行第一个 console.log，打印出他们的状态
 *     (3)由于then执行会默认调用该Promise的resolve，即创建一个微任务，并放到微任务队列中
 *     (4)setTimeout则是创建一个宏任务并且放到宏任务队列中
 *     (5)由于微任务比宏任务先执行，故在setTimeout中p2状态已改变(pending -> resolved)
 *  */ 

/**
 * 链式调用传值 demo
 *  */ 

 let p3 = new Promise((resolve, reject) => {
   resolve('哈哈哈我来自p3')
 }).then(res => {
  //console.log(res);
  return '哈哈哈哈我来自 p3 的 return'; // 这个值会返回给下一个 then 处理，如果返回值为Promise，则需等待这个值完成
 }, reason => {

 }).then(res => {
   //console.log(res);
 }) 

/**
 * promise 的错误监测以及catch
 *  */
