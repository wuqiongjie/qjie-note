## 原型和继承那些事
> 更新时间：2020.3.30

主要知识点：
* 原型
* 继承
* API
### 原型
* 原型
  * 每个实例对象都有`__proto__`属性，指向其构造函数的原型对象
  * 每个原型对象都是一个对象，由`Object`创建。
  * 每个函数都由`Function`实现，`Object`也是一个构造函数。
  * `Object.prototype.__proto__ = null`，为顶层天花板
* 原型检测方式
  * `a instanceof b`：a 的长辈是否是 b构造函数的原型对象
  * `a.isPrototypeOf(b)`：a 的长辈是否是 b
* 其他
  * `in` 与 `hasOwnProperty`的区别
    * `in`会检测本身和原型链
    * `hasOwnProperty`只是单纯的检测本身
  * `__proto__`：内部设置了`getter`、`setter`
    ```js
    var a = {};
    a.__proto__ = {}; // 生效
    a.__proto__ = 12; // 不生效，内部设置了getter, setter
    // __proto__ 并不是严格意义上的属性，只是getter, setter 属性
    /* 
     问：如果我想设置 __proto__ 不为对象，而为普通属性呢?
     思路：__proto__ 不是属性，那我设为属性就好了，怎么设为属性呢？可以通过 
     var b =  Object.create(null);  // 创建一个空原型对象，这样就不存在 __proto__ get、seter
     b.__proto__ = 18;  // 这样就可以直接设置了
    
    */
    ``` 
* 原型演进过程
  * `Object.create(xxx, options)`：以xxx为原型对象创建对象，options为创建新对象时的属性，可设置读写
  * `xx.__proto__`：可通过此方式设置其原型对象。（非标准，不同浏览器可能不一样）
  * `Object.setPrototypeOf(a,b)`：设置a的原型对象为b。（推荐，标准） 

### 继承
* 继承方式
  * 原型继承
    * 概念：原型的继承，不改变构造函数的原型
    * 实例
      ```js
        function Person() {}
        Person.prototype.show = function(){ console.log("show");}

        function Admin(){}
        // 方式一：通过 __proto__
        Admin.prototype.__proto__ = Person.prototype; // 原型对象继承 Person原型对象
        
        // 方式二：通过Object.create
        Admin.prototype = Object.create(Person.prototype);  // 以Person.prototype为原型创建一个新对象，并赋值给Admin.prototype,此时 Admin.prototype 的 construtor消失（指向了新对象）,打印有值（继承了父类的，故使用父类的构造函数）
        Admin.prototype.construtor = Admin; // 重新指回Admin
        
        // 方式三：错误继承方式
        Admin.prototype = Person.prototype; // 这样是直接把构造函数的原型指向 Person原型对象

        // 方式一、二：添加可正常使用
        // 方式三：Person的原型对象也会共享 role，方法，毕竟Admin的原型对象直接指向自己
        Admin.prototype.role = function(){console.log(role)}
       ```
  * 使用父类构造函数初始化属性
    * 原因：不用父类构造函数（用已有的方式）去初始化属性，可以减少子类大量相同的代码（初始化属性）
    * 实例
      ```js
      function Person(name, age) {
        this.name = name;
        this.age = age;
      }

      Person.prototype.show = function() {
        console.log(this.name, this.age);
      }

      function Admin(name, age) {
        Person.call(this, name, age); // 借用父类构造函数初始化属性
      }

      Admin.prototype.__proto__ = Person.prototype;
      let xiaowu = new Admin("xiaowu", 18);
      xiaowu.show();
      ``` 
  * 使用原型工厂封装继承
    * 原因：每个子类继承父类都会重复一些相同的业务代码，此时进行封装
    * 示例(demo/extend.js)
      ```js
      function Person(name) {
        this.name = name;
      }

      Person.prototype.show = function () {
        console.log(this.name);
      }

      // Admin 属性通过借用父类构造函数赋值
      function Admin(name) {
        User.call(this, name);
      }

      // 通过方法实现
      function extend(sub, sup) {
        sub.prototype = Object.create(sup.prototype);
        Object.defineProperty(sub.prototype, "constructor", {
          value: sub,
          enumerable: false,  // 设置其不可遍历
        });
      }

      extend(Admin, Person);

      let xiaowu = new Admin("xiaowu");
      ```
  * 通过对象工厂派生对象实现继承 
    * 概念：即在方法内进行继承
    * 实现
      ```js
      function Person(name) {
        this.name = name;
      }

      Person.prototype.show = function() {
        console.log(this.name);
      }

      function admin(name) {
        let instance = Object.create(Person.prototype);
        Person.call(instance, name);
        // 可以在这里为对象添加方法
        instance.role = function() {
          console.log("role");
        }
        return instance;
      }

      let xiaowu = admin("xiaowu");
      xiaowu.show();
      xiaowu.role();
      ```           


* 实现多继承
  * js只能单继承，如果要要实现多继承，只能一直在逐个继承，这样会造成一些不必要的方法出现在对象上。
  * 通过`Object.assign`实现类似多继承，即将其他对象的方法赋予到当前对象的原型上，这样就从表面上实现了多继承
  * 实现方式
    ```js
      Object.assign(a, b, c); // 将b,c的属性赋值到a上，并且返回a对象
    ```
### API
* `Object.setPrototypeOf(obj, parent)`：设置obj的原型对象
* `Object.getPrototypeOf(obj)`：获取obj的原型对象
* `Object.hasOwnProperty(xxx)`：判断xxx是否为Object的属性
* `Object.values()`：获取`Object`的所有属性值，并返回数组
* `Object.keys()`：获取`Object`的所有属性，并返回数组
* `Object.getOwnPropertyDescriptors`：获取对象属性的描述，例如是否可读写、遍历等。
* `Object.create(xxx, {})`：创建一个纯对象，以`xxx`为对象的原型，参数`{}`为定义对象的属性，其中可以设置值、遍历、读写相关。
* `Object.assign(a,b,c...)`：合并后面的参数到a，并且返回a
* `a.call(xxx, args1, args2)`：xxx借用a来执行，后面为多个参数
* `a.apply(xxx, [args])`：xxx借用a来执行，第二个参数为数组，调用方法后会将参数解析成多个参数传递