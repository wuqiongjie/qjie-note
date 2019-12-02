# Module 相关
> 更新时间：2019.12.2

本文主要记录以下内容：
* `CommonJS`规范基本知识
* `module`的结构
* `module.exports` 与 `exports`的区别
* 模块出现循环依赖，会出现死循环吗？为什么？
* `require`支持导入哪几类文件？该函数执行的主要流程？加载模块时的加载路径？

## CommonJS 规范
* 概念：一个文件就是一个模块，每一个模块都是一个单独的作用域，模块中定义的变量、函数为私有，可通过`module.exports`对象向外部暴露属性和方法。
* 使用
  * `require`：通过该函数来引入模块
  * `module.exports`：通过该对象暴露属性以及方法。
* 特点：
  * `CommonJS`是运行时加载，并且模块输出的是一个值的拷贝。
  * 模块可以多次加载，但是只会在第一次加载时运行一次，然后缓存运行结果，以后加载该模块则直接读取缓存结果。若想再运行，则必须清除缓存。
  * 模块加载的顺序，按照其在代码中出现的顺序。（同步加载）

## 问题及回答
> `module`的结构？  

```js
// 断点调试可知
Module = {
  children: [],
  exports: {}, // 暴露的方法、属性集合对象
  filename: "c:\Users\Administrator\Desktop\mini-module\arr-dupe\test1.js",  // 文件路径
  id: ".",  // 模块id
  loaded: false, // 模块是否已经加载
  parent: null, 
  paths: []
}
```

> `module.exports` 与 `exports`的区别

```js
console.log(module.exports === exports);  // true
/* 注意：exports 和 module.exports 指向同一个地址;
        require导出的是 module.exports 的地址对应的内容;
        故给 exports重新赋值对象是不能被导出的。*/
```

> 模块出现循环依赖，会出现死循环吗？     

*  答：并不会，因为缓存了,模块缓存到 `Module._cache` 中。

> `require`支持导入哪几类文件？该函数执行的主要流程？加载模块时的加载路径？

* `require`支持导入`js | json | node`这三类文件

* `require`函数执行流程
  1. `require`
  2. `Module._load`
  3. `tryModuleLoad`
  4. `Module.load`
  5. `Module._extensions[.js]`
  6. `Module._compile`

## 源码注释
```js
// require 函数
Module.prototype.require = function(id) {
  if (typeof id !== 'string') {
    throw new ERR_INVALID_ARG_TYPE('id', 'string', id);
  }
  if (id === '') {
    throw new ERR_INVALID_ARG_VALUE('id', id,
                                    'must be a non-empty string');
  }
  return Module._load(id, this, /* isMain */ false);
};

// Module._load 函数：若缓存存在对应模块，则直接加载缓存中的，若没有，则重新加载并载入缓存
// Check the cache for the requested file.
// 1. If a module already exists in the cache: return its exports object.
// 2. If the module is native: call `NativeModule.require()` with the
//    filename and return the result.
// 3. Otherwise, create a new module for the file and save it to the cache.
//    Then have it load  the file contents before returning its exports
//    object.
Module._load = function(request, parent, isMain) {
  if (parent) {
    debug('Module._load REQUEST %s parent: %s', request, parent.id);
  }

  var filename = Module._resolveFilename(request, parent, isMain);
  // 这里判断是否缓存了该模块，若有，则使用缓存的模块(解决问题3)
  var cachedModule = Module._cache[filename];
  if (cachedModule) {
    updateChildren(parent, cachedModule, true);
    return cachedModule.exports;  // 从这里可以得知导出的是 module.exports（解决问题2）
  }

  if (NativeModule.nonInternalExists(filename)) {
    debug('load native module %s', request);
    return NativeModule.require(filename);
  }

  // Don't call updateChildren(), Module constructor already does.
  var module = new Module(filename, parent);

  if (isMain) {
    process.mainModule = module;
    module.id = '.';
  }

  Module._cache[filename] = module;

  tryModuleLoad(module, filename);

  return module.exports;  // 从这里可以得知导出的是 module.exports（解决问题2）
};


// tryModuleLoad 函数 --> 调用 module.load方法
function tryModuleLoad(module, filename) {
  var threw = true;
  try {
    module.load(filename);
    threw = false;
  } finally {
    if (threw) {
      delete Module._cache[filename];
    }
  }
}
// module.load 方法
// Given a file name, pass it to the proper extension handler.
Module.prototype.load = function(filename) {
  debug('load %j for module %j', filename, this.id);

  assert(!this.loaded);
  this.filename = filename;
  this.paths = Module._nodeModulePaths(path.dirname(filename));

  var extension = path.extname(filename) || '.js';
  if (!Module._extensions[extension]) extension = '.js';
  Module._extensions[extension](this, filename);  // 从这里获取模块内容
  this.loaded = true;

  ...
};

// 从下面三种方式可以看出 require 函数可以导入哪些文件
// Native extension for .js
  Module._extensions['.js'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    module._compile(stripBOM(content), filename);
  };


// Native extension for .json
Module._extensions['.json'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  try {
    module.exports = JSON.parse(stripBOM(content));
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};

// Native extension for .node
Module._extensions['.node'] = function(module, filename) {
  return process.dlopen(module, path.toNamespacedPath(filename));
};

// Run the file contents in the correct scope or sandbox. Expose
// the correct helper variables (require, module, exports) to
// the file.
// Returns exception, if any.
Module.prototype._compile = function(content, filename) {

  content = stripShebang(content);

  // create wrapper function
  var wrapper = Module.wrap(content);

  var compiledWrapper = vm.runInThisContext(wrapper, {
    filename: filename,
    lineOffset: 0,
    displayErrors: true
  });

  var inspectorWrapper = null;
  if (process._breakFirstLine && process._eval == null) {
    if (!resolvedArgv) {
      // we enter the repl if we're not given a filename argument.
      if (process.argv[1]) {
        resolvedArgv = Module._resolveFilename(process.argv[1], null, false);
      } else {
        resolvedArgv = 'repl';
      }
    }

    // Set breakpoint on module start
    if (filename === resolvedArgv) {
      delete process._breakFirstLine;
      inspectorWrapper = process.binding('inspector').callAndPauseOnStart;
    }
  }
  var dirname = path.dirname(filename);
  var require = makeRequireFunction(this);
  var depth = requireDepth;
  if (depth === 0) stat.cache = new Map();
  var result;
  if (inspectorWrapper) {
    result = inspectorWrapper(compiledWrapper, this.exports, this.exports,
                              require, this, filename, dirname);
  } else {
    result = compiledWrapper.call(this.exports, this.exports, require, this,
                                  filename, dirname);
  }
  if (depth === 0) stat.cache = null;
  return result;
};
```
## 参考
* [前端模块化](https://juejin.im/post/5aaa37c8f265da23945f365c)
* [CommonJS规范](https://juejin.im/entry/56cebad0c4c971c376dfd0fc)
* [Node之VSCode调试](https://www.bookstack.cn/read/node-in-debugging/4.3VisualStudioCode.md)