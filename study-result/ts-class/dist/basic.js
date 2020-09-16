"use strict";
var str = 'str';
var num = 123;
var v = undefined;
var n = null;
var bool = true;
// 在 tsconfig 中设置 target 为 es5 就不识别 es6 中的库，所以要在 lib 中配置环境。
var sym = Symbol('123');
var foo = { a: 1 };
var foo1 = { age: 1 };
// 对象使用 interface 修饰更多
var nums = [1, 2];
function add() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    args.reduce(function (a, b) {
        return a + b;
    });
}
// 元祖
var arrs = ['1', 1];
var c = 1 /* Green */;
// 默认 number 自动增加
var RequestMethod;
(function (RequestMethod) {
    RequestMethod[RequestMethod["Get"] = 0] = "Get";
    RequestMethod[RequestMethod["Post"] = 1] = "Post";
    RequestMethod[RequestMethod["Put"] = 2] = "Put";
    RequestMethod[RequestMethod["Delete"] = 3] = "Delete";
})(RequestMethod || (RequestMethod = {}));
var methods = [
    RequestMethod.Get,
    RequestMethod.Post
];
