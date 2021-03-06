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
symbol 无法被 for in ,object.keys 和 json.stringify symbol 属性就是 undefined 。中无法识别，可以使用 Object.getOwnPropertySymbols
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
### ts 的类型处理
- 强类型和弱类型的区别
强类型会在编译的时候进行类型的检查，因为 js 没有所以就是弱类型的动态语言，但是随着 js 的规模增加需要类型的定义更加重要和规范化，弱类型只有在运行时候才确定。
- 使用 flow 增加类型的注解，但是实际运行时不可识别 flow 注解的，flow 在运行中需要去掉所以使用,所以在生成的时候需要去掉注解才能让js正常运行，使用 //@flow 时候 flow 就会检查
- 使用 remove-flow-types
- 使用 @babel/preset-flow 去掉 flow类型 注解
#### flow 开发插件工具
vscode 中使用 flow language support
#### flow 基本类型
number string boolean undefined = void null symbol
#### flow 中的引用类型
- 数组类型 let arr:Array<number> 或者 arr:number[],设置数组元素使用 const a: [string, number] 认为是元组
- 对象类型 let obj: {
    name: string,
    age？: number
}表示这个对象的元素 ？表示元素可有可无，但是动态添加键的对象需要限制 key 和 value
let obj: {
    [string]: string
}
- 函数类型注解
function log(cb: (string) => void) {

}
- 自变量类型只有这几种值的类型被允许否则就不被允许
const type: 'a' | 'b' = 'b'
const StringOrNumber = number|string
const a : StringOrNumber = 3
- mixed 类型 所有类型和 any 类型一样可接受任何类型, any 是弱类型运行时候才知道，mixed 针对不同类型必须要做处理，否则会报错
function log(value:mixed) {
    if(typeof value === 'string') {}
    if(typeof value === 'number') {}
}
- flow 需要的 api
- ts 使用typescript tsc 进行 compile ts 文件 yarn tsc --init生成 tsconfig
1、标记-清除:
这是垃圾收集算法中最基础的，根据名字就可以知道，它的思想就是标记哪些要被回收的对象，然后统一回收。这种方法很简单，但是会有两个主要问题：1.效率不高，标记和清除的效率都很低；2.会产生大量不连续的内存碎片，导致以后程序在分配较大的对象时，由于没有充足的连续内存而提前触发一次GC动作。
2、复制算法:
为了解决效率问题，复制算法将可用内存按容量划分为相等的两部分，然后每次只使用其中的一块，当一块内存用完时，就将还存活的对象复制到第二块内存上，然后一次性清楚完第一块内存，再将第二块上的对象复制到第一块。但是这种方式，内存的代价太高，每次基本上都要浪费一般的内存。
于是将该算法进行了改进，内存区域不再是按照1：1去划分，而是将内存划分为8:1:1三部分，较大那份内存交Eden区，其余是两块较小的内存区叫Survior区。每次都会优先使用Eden区，若Eden区满，就将对象复制到第二块内存区上，然后清除Eden区，如果此时存活的对象太多，以至于Survivor不够时，会将这些对象通过分配担保机制复制到老年代中。(java堆又分为新生代和老年代)
3、标记-整理
该算法主要是为了解决标记-清除，产生大量内存碎片的问题；当对象存活率较高时，也解决了复制算法的效率问题。它的不同之处就是在清除对象的时候现将可回收对象移动到一端，然后清除掉端边界以外的对象，这样就不会产生内存碎片了。
4、分代收集
现在的虚拟机垃圾收集大多采用这种方式，它根据对象的生存周期，将堆分为新生代和老年代。在新生代中，由于对象生存期短，每次回收都会有大量对象死去，那么这时就采用复制算法。老年代里的对象存活率较高，没有额外的空间进行分配担保，所以可以使用标记-整理 或者 标记-清除。