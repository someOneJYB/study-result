function composePromise(f1, f2, f3) {
  var _arguments = arguments;
  var start = Promise.resolve(f1());

  var _loop = function _loop(i) {
    start = start.then(function (v) {
      return _arguments[i](v);
    });
  };

  for (var i = 1; i < arguments.length; i++) {
    _loop(i);
  }

  return start;
}

function f1() {
  return 'hello';
}

function f2(v) {
  return v + ' ' + 'lagou';
}

function f3(v) {
  console.log(v + ' ' + 'I love U');
}

composePromise(f1, f2, f3);