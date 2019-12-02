# 垂直、水平居中
> 更新时间：2019.11.23

本文主要记录内容：
* 行内元素的水平垂直居中方式
* 块级元素的水平垂直居中方式

## 行内元素
> 方式一： text-align + line-height

* 水平居中：父容器设置`text-align: center`
* 垂直居中：父容器设置行高，并且行高高度等于盒子高度，即可让文本垂直居中。
  ```css
  .parent {
    height: 20px;
    line-height: 20px;
  }
  ```

> 方式二： text-align + 伪元素

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>text-align Text</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="description" content="Description">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <style>
	.father {
		text-align: center;
		width: 300px;
		height: 400px;
		border: 1px solid red;
	}
	.son {
		display: inline-block;
		width: 200px;
		height: 300px;
		vertical-align: middle;
		border: 1px solid black;
	}
	.father:after { // 使孩子元素垂直居中
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
  </style>
</head>
<body>
  <div class="father">
	<div class="son">孩子元素的内容</div>
  </div>
</body>
</html>
```

## 块级元素
> 方式一： margin + 绝对定位（需指定子元素的宽高）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>margin + 绝对定位</title>
    <style>
        .parent{
            position: relative;
            min-height: 500px;
            background: pink;
        }
        .son {
            position: absolute;
            width: 200px;
            height: 100px;
            background: red;
            top: 50%;
            left: 50%;
            margin-left: -100px;
            margin-right: -50px;
        }
    </style>
</head>
<body>
    <div class="parent">
        <div class="son">子元素的内容</div>
    </div>
</body>
</html>
```
* 不足：要求指定子元素的宽高

> 方式二：绝对定位 + translate

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绝对定位 + translate</title>
    <style>
        .parent{
            position: relative;
            min-height: 500px;
            background: pink;
        }
        .son {
            position: absolute;
            background: red;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    </style>
</head>
<body>
    <div class="parent">
        <div class="son">子元素的内容</div>
    </div>
</body>
</html>
```
> 方式三：flex -- 所有孩子节点水平垂直居中

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>flext</title>
    <style>
        .parent{
            display: flex;
            justify-content: center;  // 水平居中
            align-items: center;  // 垂直居中
            min-height: 100vh;
            background: pink;
        }
        .son {
            background: red;
        }
    </style>
</head>
<body>
    <div class="parent">
        <div class="son">子元素的内容</div>
    </div>
</body>
</html>

```
* 不足：给父容器设置属性`justify-content: center`和`align-items: center`之后，导致父容器里的所有子元素们都垂直居中了（如果父容器里有多个子元素的话）。

> 方式四：margin + flex -- 指定孩子元素水平垂直居中

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>margin + flex 指定元素水平垂直居中</title>
    <style>
        .father{
            display: flex;
            min-height: 100vh;
            background: pink;
        }
        .son {
            margin: auto;
            background: red;
        }
    </style>
</head>
<body>
    <div class="father">
        <div class="son">子元素的内容，想水平垂直居中</div>
        <div class="son2">这个元素不想水平垂直居中</div>
    </div>
    <script></script>
</body>
</html>

```
> 参考文章

* [探秘 flex 上下文中神奇的自动 margin](https://www.cnblogs.com/coco1s/p/10910588.html)