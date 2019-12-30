# 相关问题
> 更新时间：2019.11.27

## 基础
> Node.js 为啥能运行js

答：`Node.js`内部安装了`V8`引擎（用于执行js代码），并且`Node.js`不是一门语言，只是一个执行环境。

> Node.js 中的全局变量？

答：`global`,`process`,`setTimeout`, `clearTimeout`, `setInterval`,`clearInterval`,`module`并不是全局对象，只是一个`JSON`格式的对象，用于区分模块。 

> 为什么需要模块化？
