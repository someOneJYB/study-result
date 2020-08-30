function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fp = require('lodash/fp'); // 最基本的函子使用 map 返回新的实例链式调用， map 负责调用函数传递值


var Container = /*#__PURE__*/function () {
  _createClass(Container, null, [{
    key: "of",
    value: function of(value) {
      return new Container(value);
    }
  }]);

  function Container(value) {
    _classCallCheck(this, Container);

    this._value = value;
  }

  _createClass(Container, [{
    key: "map",
    value: function map(fn) {
      return Container.of(fn(this._value));
    }
  }]);

  return Container;
}(); // maybe 函子防止传入的value 是 null，防止函数执行发生意外


var Maybe = /*#__PURE__*/function () {
  _createClass(Maybe, null, [{
    key: "of",
    value: function of(value) {
      return new Maybe(value);
    }
  }]);

  function Maybe(value) {
    _classCallCheck(this, Maybe);

    this._value = value;
  }

  _createClass(Maybe, [{
    key: "isNothing",
    value: function isNothing() {
      return this._value === null || this._value === undefined;
    }
  }, {
    key: "map",
    value: function map(fn) {
      return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this._value));
    }
  }]);

  return Maybe;
}(); // 练习一 使用 fp.add 和 fp.map 创建一个 functor 值增加函数 ex1


var maybe = Maybe.of([5, 6, 1]);

var ex1 = function ex1(num) {
  return maybe.map(function (arr) {
    return fp.map(function (item) {
      return fp.add(item, num);
    }, arr);
  });
};

var f = ex1(10);
console.log(f); // 练习二  ex2 获取列表第一个元素

var xs = Container.of(['do', 'ray', 'me', 'fa', 'so']);

var ex2 = function ex2() {
  return xs.map(function (arr) {
    return fp.first(arr);
  });
};

console.log(ex2()); // 练习三  ex3 使用 safeProp 和 fp.first 找到 user 的名字的首字母

var safeProps = fp.curry(function (x, o) {
  return Maybe.of(o[x]);
});
var user = {
  id: 2,
  name: 'lili'
};

var ex3 = function ex3(obj, name) {
  return safeProps(name, user).map(fp.first)._value;
};

console.log(ex3(user, 'name')); // 练习四  ex4 不要有 if 语句

var ex4 = function ex4(n) {
  return Maybe.of(n).map(function (v) {
    return parseInt(v, 10);
  })._value;
};

console.log(ex4('1234'));