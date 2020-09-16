1、说出下列执行结果、并解释为什么

```js
var a = [];
for(var i = 0; i < 10; i++) {
    a[i] = function() {
        console.log(i)
    }
}
a[6]();
// 首先作用域分为全局作用域和函数作用域，因此 i 是认定为全局作用域，在定义的函数内部找不到 i 的值进行向上找找到的是已经被赋值为 10 的 i，所以打印出 10

```


2、请说出下列最终执行的结果,并解释原因
```js
var temp = 123;
if(true) {
    console.log(temp);
    let temp;
}
// let 形成块级作用域不会变量提升，所以因为暂时性死区会导致 console 的时候发现 temp 没有定义，所以就会报 referenceError 未定义的变量 temp
```


3、结合 ES6 新语法，用最简单的方式找出数组中的最小值。
```js
var arr = [12, 34, 32, 89, 4];
Math.min(arr)
```

4、请 详细说明 var let const 三种声明变量的方式之间的区别。
```js
var 存在的问题：
1、变量提升、允许在定义前使用，以为此时变量时 undefined 不会是有未定义的错误，在es6规范没有出之前就没有块级作用域，只有全局作用域和函数作用域。
2、let const 出现之后出现了块级作用域暂时性死区不允许变量提升，let 和 const 都是修饰变量，但是 const 修饰的变量的引用地址，不允许变量的地址发生变化
```


5、请说出下列代码的输出结果，并解释为什么。
```js
var a = 10;
var obj = {
    a: 20,
    fn() {
        setTimeout(()=>{
            console.log(this.a);
        }， 0)
    }
}
obj.fn()
```


// 最后输出的是对象下的a因为箭头函数中的 this 永远指向定义的位置，也就是说 setTimeout 的函数定义在 fn 函数中，所以沿着作用域找 this，fn 中的this在调用的时候是obj，就会找到 obj 这个对象。
6、简述symbol类型的应用
- 首先我们需要知道的是对象中的 key 都是会执行 toString 方法的，所以当我们使用 object 作为 key 的时候都会转化成 [Object object], 但是使用其他的对象就都会变成相同的 key，但是使用 symbol 就会让不同的对象使用就是不同的 key，同时 symbol 对象作为 key 不会让 for in 遍历出来，也不会让 object.keys 遍历出来


7、什么是浅拷贝、什么是深拷贝
- 浅拷贝比如 object.assign， 就是浅拷贝如果是简单的拷贝常量，但是引用类型就是复制地址，深拷贝主要是对于引用类型复制出一个不同的地址的完全相同的对象。
```js
let a = {d: 1}
let f = {g: { y: 123}}
let w = Object.assign(a, f)
f.g.y = 330
// 输出合成后的 y
console.log(w.g.y)
//w.g.y = 110
```


8、请简述 typescript 和 javascript 之间的关系
typescript 是 javascript 的
语言层面：JavaScript和TypeScript都是ECMAScript（ECMA-262）的具体实现。
执行环境层面：浏览器引擎和Node.js都能够直接运行JavaScript，但无法直接运行TypeScript。时序层面：TypeScript被真正执行前，会通过编译转换生成JavaScript，之后才能被解释执行。
TypeScript是ECMAScript 2015的语法超集，是JavaScript的语法糖。JavaScript 程序可以直接移植到 TypeScript，TypeScript 需要编译（语法转换）生成 JavaScript 才能被浏览器执行。


9、谈谈你认为的 typescript 的优缺点
-优点
1：搞面向对象方便
2：可选的强类型可以让你在程序运行之前多发现一些错误
3：智能提示
-缺点
1、需要引入对应库的d.ts文件用于类型定义
2、有一定的学习成本，增加开发成本
3、需要编译才能执行



10、描述引用计数的工作原理和缺点
从根节点找到可达的对象进行引用计数，进行累计，如果引用次数是 0，就会进行清除GC回收，引用计数会引起的是无法处理循环引用


11、描述标记整理算法的工作流程
标记活跃对象，同时整理到一起，不活跃的对象进行删除，解决了循环引用和内存碎片的问题。


12、描述 V8 在新生代垃圾回收的流程
新生代主要是分为 from 和 to 两个大小相同的内存区域，使用的是复制算法和标记整理，from存放的是活跃对象，to存放的是空闲，from 空间标记整理后活动对象复制到 to，二者进行交换位置，清除 to 区域。


13、描述增量标记算法在何时使用及工作原理
在 v8 GC中使用，主要是遍历对象标记可达对象和执行程序之间交替进行，防止一直阻塞程序的执行。