// 通过原型工厂实现继承
function extendTest1 () {
  function Person(name) {
    this.name = name;
  }
  
  Person.prototype.show = function () {
    console.log(this.name);
  }
  
  // Admin 继承 Person
  function Admin(name) {
    Person.call(this, name);
  }
  
  // Admin.prototype = Object.create(Person.prototype);
  // Object.defineProperty(Admin.prototype, "constructor", {
  //   value: Admin,
  //   enumerable: false,  // 设置其不可遍历
  // });
  
  // 此时将 继承逻辑进行封装 
  function extend(sub, sup) {
    sub.prototype = Object.create(sup.prototype);
    Object.defineProperty(sub.prototype, "constructor", {
      value: sub,
      enumerable: false,  // 设置其不可遍历
    });
  }
  
  extend(Admin, Person);
  
  let xiaowu = new Admin("xiaowu");
  xiaowu.show();
}

// 通过工厂实现继承
function extendTest2() {
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
}

extendTest2();