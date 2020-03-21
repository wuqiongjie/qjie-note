# Service Worker 浅析
## 目录
* 前言
* 特点
* 生命周期以及如何工作
* 拦截网络请求
* 缓存
* 总结
* 参考文献

## 前言
`Service Worker` 是一个独立的`worker`线程，独立于当前网页进程,它能够拦截网络请求、缓存以及推送其他消息等。目前该技术主要应用于`Progressive Web App`（简称 `PWA`）等。
## 特点
* 独立的 `worker` 线程
* 用到的时候可以直接唤醒，不用的时候自动睡眠
* 拦截代理请求和返回、缓存文件
* 能向客户端推送消息
* 必须在 `HTTPS` 环境下才能工作
* 异步实现，内部大都是通过 `Promise` 实现

## 生命周期以及如何工作
### 如何工作
* 页面主线程通过 `navigator.serviceWorker.register()` 注册, 在注册过程中浏览器会下载、解析并执行`Service worker`。
* `Service worker`成功执行，则进行安装事件。通常在安装的过程中需要缓存一些静态资源，如果所有的资源成功缓存则安装成功,否则失败。
* `Service worker`安装完成，则进行激活。通常在激活的过程中是清理旧版本的 `Service Worker` 脚本中使用资源。
* `Service worker`激活成功，则其可以控制当前页面了。

### 生命周期

* 安装中(`installing`): 在注册之后，表示开始安装,触发`install`事件。
* 安装后(`installed`)：已经完成安装，等待其他`Service Worker`线程关闭。
* 激活中(`activating`)：在这个状态下没有被其他的 `Service Worker` 控制的客户端，允许当前的 `worker` 完成安装，并且清除了其他的 `worker` 以及关联缓存的旧缓存资源，等待新的 `Service Worker` 线程被激活。
* 激活后(`activated`)：处理`activate`事件回调，期间可以更新缓存、处理请求、推送等。 
* 废弃状态(`redundant`)：表示该`Service Worker` 生命周期结束。
## 拦截网络请求
### 实现原理
 `Service Worker`可以拦截浏览器发出的任何`HTTP`请求，属于此`Service Worker`作用域内的每个`HTTP`请求都将触发`fetch`事件，如（`html`页面、`css`文件、脚本、图片等）。这样我们就可以控制浏览器，自主实现处理这些资源的获取方式（如图片进行`WebP`转换）
### 实现实例

  ```html
  <!-- main.html 主页面，这里主要注册 service worker -->
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>测试</title>
  </head>
  <body>
    <h1>测试</h1>
    <img src="./image/test.jpg" alt="测试图片"/>
    <script>
      if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then((registration) => {
          // 注册成功
          console.log('注册成功')
        }).catch((error) => {
          // 注册失败
          console.log('注册失败')
        })
      }
    </script>
  </body>
  </html>

  ```
  ```js
    // sw.js  service worker 文件
    self.addEventListener('fetch', (event) => {
      let regx = /\.jpg$|.png$/;
      if(regx.test(event.request.url)) {  // 检查请求是否为图片类型
        let supportWebP = false;
        let headers = event.request.headers;

        if(headers.has('accept')) { // 检查 accept 请求头是否 WebP
          supportWebP = headers.get('accept').includes('webp');
        }

        if(supportWebP) { // 浏览器是否支持 WebP
          let req = event.request.clone();    // 请求进行克隆
          let returnUrl = req.url.substr(0, req.url.lastIndexOf('.')) + '.webp';  // 重新设置 url
          event.respondWith(fetch(returnUrl, {  // 重新发送请求并且返回此次响应的请求
            mode: 'no-cors'
          }))
        } 
      }
    })
  ```

## 缓存
### 缓存方式
* 预缓存：即安装过程中缓存已知的文件。
* 动态缓存：通过拦截网络文件请求并将其缓存，适用于不知道哪些。
### 缓存实现
* 内部通过与 [`Cache API`](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)结合实现
### 实现缓存实例
* 预缓存实现
  ```js
  // sw.js  service worker 文件
  const cacheName = "testCache";  // 缓存名称

  self.addEventListener('install', event =>{
    event.waitUntil(
      caches.open(cacheName)
        .then(cache => {
          cache.addAll([
            './test.png'
          ])
        })
    )
  })
  ```

* 动态缓存  
  ```js
  // sw.js service worker 文件
  // 动态缓存：通过拦截该请求
  const cacheName = "testCache";
  self.addEventListener('fetch', event => { // fetch 进行拦截
    event.respondWith(
      caches.match(event.request)
        .then(response => { // 当前请求是否匹配缓存中存在的任何内容
          if(response) {
            return response;
          }

          let requestToCache = event.request.clone(); // 复制请求。请求是一个流，只能使用一次
          return fetch(requestToCache).then(
            function(response) {
              if(!response || response.status != 200) return response; // 请求失败则立即返回错误信息

              let responseToCache = response.clone();
              caches.open(cacheName)  // 打开上述备注的缓存
                .then(cache => {
                  cache.put(requestToCache, responseToCache); // 将响应添加到缓存中
                });
              
              return response;
            }
          )
        })
    )
  })
  ```

## 总结
对于不怎么变动的文件可以通过缓存起来，下次用户打开可直接读取缓存，以获取更好的用户体验。

## 参考文献
* [ServiceWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker)
* [LAVAS](https://lavas.baidu.com/pwa/offline-and-cache-loading/service-worker/how-to-use-service-worker)