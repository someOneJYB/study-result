##### 模块2总结目录

- let const 对比 var
- 暂时性死区不允许变量提升，增加了块级作用域
- const 需要保证执行的内存区域不发生变化

- 对象解构

- 字符串模版
允许可以调用方法

- 默认参数值

- object.assign
返回一个新对象
- object.is 判断两个值是否相等，会认为 NaN === NaN -0 !== +0 所以这是 is 的区别
- proxy 代理器对比 defineProperty 含有 delete 的时候对象属性监听，对数组的操作监听，执行push的时候就可以在 set 中收听到
```
const p = { name: 'ww'}
const personName = new Proxy(p, {
    get(target, property) {
        console.log(target, property);
        return 100;
    },
    set(target, property, value) {
        if(property === 'age') {
            if(typeof value !== 'number') {
                throw Error('be a  number')
            } else {
                target[property] = value;
            }
        }
    },
})
```
- Reflect 对象
```js
const p = { name: 'ww'}
const personName = new Proxy(p, {
    get(target, property) {
       // 提供对象的统一操作方式
        return Reflect.get(target, property);
    },
    set(target, property, value) {
        if(property === 'age') {
            if(typeof value !== 'number') {
                throw Error('be a  number')
            } else {
                target[property] = value;
            }
        }
    },
})
// Reflect.has(target, property) => for in
// Reflect.ownerKeys(target) => Object.keys
```
- class 类
- set 成员不允许重复
add 方法允许链式调用
```js
let s = new Set();
s.add(1).add(2)
````
- map 键值对集合允许键可以用任何键做key但是对象只支持string作为字符串做键
- symbol 防止出现重复的key，因此使用为了扩展不重复的键，使用 symbol 修饰 key 就可以独一无二
数据类型： string number boolean null undefined object symbol
symbol 无法被 for in ,object.keys 和 json.stringify symbol 属性就是 undefined 。中无法识别，可以使用 hasOwnSymbolProperty
用来修饰私有变量
```js
const o = {
  [Symbol.toStringTag]:  'xobj'
}
const o = {
  [Symbol.toStringTag]:  'xobj'
}
// 修改了 toString 方法
o + ''
"[object xobj]"
```
- for of 处理可迭代对象，拿到的是元素
```js
let arr = [1, 2, 3];
//  属性
let s = arr[Symbol.iterator]();
//使用next也可以获得下一个
s.next()
// 实现迭代对象
const f = {
   [Symbol.iterator]: function(v) {
       let index = -1;
       return {
           next: function() {
               index++;
               return {
                   value: v[index],
                   done: index === v.length -1,
               }
           }
       }
   }
}
```
- generator 生成器函数利用可迭代属性惰性性质去处理,解决异步编程的问题
```js
```
- indexOf 无法查找 NaN includes，指数运算符 2**10 表示2的10次方 可以 在 2016 发布的 ecamscript
- es7 object 的 entries 方法，getOwnProperty 配合处理对象的描述，padEnd 填充，增加了数组中最后一位可以增加逗号[1,2,], async 和 await 处理异步编程