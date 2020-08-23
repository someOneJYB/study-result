####### JS 异步编程
异步编程在于执行的时间是不可控的，在 js 中主要包含的异步操作有 DOM 的操作、 io 请求、定时器的回调。
####### js异步编程的形式
- 回调函数：
主要是通过执行执行操作结束后进行回调,比如下面的异步读取文件
```js
fs.readFile(filename, (err, data){
    // 在回调中执行操作
    cb()
})
```
典型的思想有 thunk 处理异步利用的就是 callback
```js
function thunkFy(asyncFn) {
    return function() {
        // 收集参数
        let ctx = this;
        let args = [].slice.call(arguments);
        return function(cb) {
            args.push(function() {
                cb.apply(null, arguments)
            });
            return asyncFn.call(ctx, ...args)
        }
    }
    
}
````
存在的缺点是callback依赖形成callback地狱
- 事件监听，就是我们说的 DOM 的点击事件等，主要是操作之后触发事件,大致实现如下
```js
function Event() {
    this.eventBus = {};
}
Event.prototype.on = function(type, fn) {
    this.eventBus[type] = this.eventBus[type] || [];
    this.eventBus[type].push(fn);
    let index = this.eventBus[type].length - 1;
    return function() {
        this.eventBus[type].splice(index, 1);
    }
}
Event.prototype.trigger = function(type) {
    (this.eventBus[type] || []).forEach(item => {
        item([].slice.call(arguments, 1))
    })
}
```
- promise 解决了 callback 的地狱回调问题，使用链式保证了执行的顺序，但是不利于调试
```js
new Promise(function(res, rej){
    let v = cb();
    res(v)
}).then(v => cb2(v))
```

目前主流使用 promise + generator 来做流程控制 = async + await 的版本
```js
function asyncFn(gen) {
    let g = gen();
    return new promise(function(res, rej) {
        function next(fn) {
                let v = null;
                try {
                    v = fn();
                    if(v.done) {
                        res(v.value)
                    } else {
                        Promise.resolve(v.value).then(v => next(() => g.next(v)))
                    }
                } catch(err) {
                    rej(err)
                }
        }
        next(() => g.next(undefined))
    })
}
````
####### EventLoop和宏任务Task、微任务MicroTask
在浏览器端主要分为宏任务Task和微任务MicroTask
首先浏览器是多线程的，每个 JS 脚本都在单线程中执行，每个线程都有自己的 Event Loop，同源的所有浏览器窗口共享一个 Event Loop 以便通信。
Event Loop 会持续循环的执行所有排队中的任务，浏览器会为这些任务划分优先级，按照优先级来执行，这就会导致 Tasks 与 Microtasks 执行顺序与调用顺序的不同
- 宏任务Task
Task 按顺序执行，浏览器可能在 Task 之间执行渲染。比如 setTimeout
- MicroTask
如果没有执行中的 js 堆栈，则在每个回调之后。比如 Promise
在每个 task 之后。
- 函数调用栈 EventLoop
这里主要是执行同步的代码，函数内同步逻辑执行优先级是最高的，如果遇到 Microtasks 或 Tasks 就会立即记录下来，当一次 Event Loop 执行完后立即调用 Microtasks，等 Microtasks 队列执行完毕后可能进行一些渲染行为，等这些浏览器操作完成后，再考虑执行 Tasks 队列。
- ps 我的理解
在我的理解中 Promise 的内部中 promise((res, rej)=> res(1))这样的我认为应该是在执行栈中的同步任务，但是查阅了相关资料显示，根据 promise A+ 规范其中也可以是 microtask，但是大部分认为是微任务