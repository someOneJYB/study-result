function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// unhandleRejection 的处理
var catchFlag = false;

var MyPromise = /*#__PURE__*/function () {
  function MyPromise(fn) {
    var _this = this;

    _classCallCheck(this, MyPromise);

    this.value = null;
    this.fufillCallback = [];
    this.rejectedcallback = [];
    this.status = 'pending';

    var resolve = function resolve(value) {
      _this.status = 'fufilled';
      _this.value = value;
      setTimeout(function () {
        _this.fufillCallback.forEach(function (item) {
          return item(_this.value);
        });
      }, 0);
    };

    var reject = function reject(err) {
      _this.status = 'rejected';
      _this.value = err;
      setTimeout(function () {
        if (!catchFlag && !_this.rejectedcallback.length) {
          throw 'unhadlePromiserejection';
        }

        _this.rejectedcallback.forEach(function (item) {
          return item(_this.value);
        });

        catchFlag = false;
      }, 0);
    };

    try {
      fn(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  _createClass(MyPromise, [{
    key: "then",
    value: function then(onFufilled, onRejected) {
      var _this2 = this;

      if (typeof onFufilled !== 'function') {
        onFufilled = function onFufilled(v) {
          return v || _this2.value;
        };
      }

      if (typeof onRejected !== 'function') {
        onRejected = function onRejected(v) {
          return v || _this2.value;
        };
      } // 处理 thenable 对象


      var dealThenable = function dealThenable(thenable, resolve, reject) {
        thenable.then(function (val) {
          resolve(val);
        }, function (err) {
          reject(err);
        });
      };

      var commonDeal = function commonDeal(value, resolve, reject) {
        if (value instanceof MyPromise) {
          return value.then(resolve, reject);
        } else {
          if (_typeof(value) === 'object' && typeof value.then === 'function') {
            return dealThenable(value, resolve, reject);
          }

          resolve(value);
        }
      };

      return new MyPromise(function (resolve, reject) {
        if (_this2.status === 'pending') {
          _this2.fufillCallback.push(function (v) {
            var value = onFufilled(v); // 处理 promise 类型

            commonDeal(value, resolve, reject);
          });

          _this2.rejectedcallback.push(function (v) {
            var value = onRejected(v); // 处理 promise 类型

            commonDeal(value, resolve, reject);
          });
        } else {
          if (_this2.status === 'fufilled') {
            var value = onFufilled(_this2.value); // 处理 promise 类型

            commonDeal(value, resolve, reject);
          } else {
            var _value = onRejected(_this2.value); // 处理 promise 类型


            commonDeal(_value, resolve, reject);
          }
        }
      });
    }
  }, {
    key: "catch",
    value: function _catch(fn) {
      catchFlag = true;
      return this.then(null, fn);
    } // 无论如何执行cb投传数据

  }, {
    key: "finally",
    value: function _finally(cb) {
      return this.then(function (v) {
        return Promise.resolve(cb()).then(function () {
          return v;
        });
      }, function (err) {
        return Promise.resolve(cb()).then(function () {
          throw err;
        });
      });
    }
  }]);

  return MyPromise;
}();

MyPromise.resolve = function (v) {
  return new MyPromise(function (res) {
    res(v);
  });
};

MyPromise.reject = function (v) {
  catchFlag = true;
  return new MyPromise(function (res, rej) {
    rej(v);
  });
};

MyPromise.all = function (arr) {
  var result = [];
  if (!arr.length) MyPromise.resolve(result);
  var index = 0;

  var _loop = function _loop(i) {
    return {
      v: new MyPromise(function (resolve, reject) {
        MyPromise.resolve(arr[i]).then(function (v) {
          if (index === arr.length) {
            resolve(result);
          } else {
            result[i] = v;
            index++;
          }
        }).catch(function (err) {
          reject(err);
        });
      })
    };
  };

  for (var i = 0; i < arr.length; i++) {
    var _ret = _loop(i);

    if (_typeof(_ret) === "object") return _ret.v;
  }
};

MyPromise.race = function (arr) {
  var _loop2 = function _loop2(i) {
    return {
      v: new MyPromise(function (resolve) {
        MyPromise.resolve(arr[i]).then(function (v) {
          resolve(v);
        });
      })
    };
  };

  for (var i = 0; i < arr.length; i++) {
    var _ret2 = _loop2(i);

    if (_typeof(_ret2) === "object") return _ret2.v;
  }

  return new MyPromise();
};