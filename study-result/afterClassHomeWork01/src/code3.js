const fp = require('lodash/fp');

// 最基本的函子使用 map 返回新的实例链式调用， map 负责调用函数传递值
class Container {
    static of(value) {
        return new Container(value)
    }
    constructor(value) {
        this._value = value;
    }
    map(fn) {
        return Container.of(fn(this._value))
    }
}
// maybe 函子防止传入的value 是 null，防止函数执行发生意外
class Maybe {
    static of(value) {
        return new Maybe(value)
    }
    constructor(value) {
        this._value = value;
    }
    isNothing() {
        return this._value === null || this._value === undefined;
    }
    map(fn) {
        return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this._value));
    }
}
// 练习一 使用 fp.add 和 fp.map 创建一个 functor 值增加函数 ex1

let maybe = Maybe.of([5, 6, 1]);
let ex1 = (num) => {
    return maybe.map((arr)=>fp.map(item => fp.add(item, num), arr))
}
let f = ex1(10)
console.log(f)

// 练习二  ex2 获取列表第一个元素
let xs = Container.of(['do', 'ray', 'me', 'fa', 'so']);
let ex2 = () => {
    return xs.map((arr)=>fp.first(arr))
}
console.log(ex2())
// 练习三  ex3 使用 safeProp 和 fp.first 找到 user 的名字的首字母
let safeProps = fp.curry(function(x, o) {
    return Maybe.of((o[x]))
})
let user = { id: 2, name: 'lili' };
let ex3 = (obj, name) => {
    return safeProps(name, user).map(fp.first)._value
}
console.log(ex3(user, 'name'))
// 练习四  ex4 不要有 if 语句
let ex4 = function(n) {
    return Maybe.of(n).map((v) => parseInt(v, 10))._value
}
console.log(ex4('1234'));