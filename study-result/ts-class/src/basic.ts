const str: string = 'str';
const num: number = 123;
const v: void = undefined;
const n: null = null;
const bool: boolean = true;
// 在 tsconfig 中设置 target 为 es5 就不识别 es6 中的库，所以要在 lib 中配置环境。
const sym = Symbol('123');
const foo: object = {a: 1}
const foo1: { age: number } = {age: 1}
// 对象使用 interface 修饰更多
const nums: Array<number> = [1, 2];
function add(...args: number[]) {
    args.reduce(function(a, b){
        return a + b;
    })
}
// 元祖
const arrs: [string, number] = ['1', 1]
// 枚举类型可以键获得值 使用值可以获得键
const enum Color {Red, Green, Blue}
let c: Color = Color.Green;
// 默认 number 自动增加 js 中的代码是一个对应对象 { Get: 1, 1: Get}这种还是一个函数，但是 const 修饰的常量 enum 就直接赋值过去不会生成多余的映射
enum RequestMethod {
    Get,
    Post,
    Put,
    Delete
}

let methods = [
    RequestMethod.Get,
    RequestMethod.Post
]

// any 不存在类型检查
// ts 隐式类型推断
let s = '123';
// s = 5会报错，但是不赋值默认类型是 any
//s = 5
// ts 类型断言 as 或者尖括号但是在 jsx 语法中不支持，编译过后断言不存在
const f = [1, 2, 3];
const num1 = f.find(i => i > 0)
const numss = num1 as number;
const g = <number>num1
// 接口约束对象的结构，interface 仅仅进行类型约束，实际执行中并没有意义
interface Man {
    name: string
    age: number
    sex?: string
    readonly idCard: string
}
// 动态对象定义 props，但未知对象的 key 是啥
interface Interface {
    [props: string]: number
}
// ts 中的类
class Person {
    // 成员属性必须初始化
    public name:string
    private age:number
    protected sex:string
    constructor(age:number, name:string) {
        this.name = name;
        this.age = age;
        this.sex = 'man'
    }
    sayHi(msg:string):void {
        console.log(this.sex)
    }

}
// 接口的扩展，接口指责单一最好
interface Eat {
 eat(food:string):void
}
class Per implements Eat  {
    eat(food: string): void {
        console.log(food)
    }
}
// 抽象类
abstract class Animal {
  abstract run(dis:number) :void
}
class Man extends Animal {
    run(dis:number):void  {
        console.log(dis)
    }
}
// 范型 ts 中的array默认any,范型保证了只在调用的时候判断类型比较灵活,类型变成参数使用的时候采取判断，可以创建任意数组，保证定义时候类型不明确但是使用时候类型作为参数传递判断就很灵活，声明文件必需以 .d.ts 为后缀，一般来说，ts 会解析项目中所有的 *.ts 文件，当然也包含以 .d.ts 结尾的文件。所以当我们将 jQuery.d.ts 放到项目中时，其他所有 *.ts 文件就都可以获得 jQuery 的类型定义了。其他模块同理。
function createArray<T>(length:number, value:T) :T[] {
    const arr = Array<T>(length).fill(value);
    return arr
}
// npm 包的类型声明 declare 兼容模块，大部分 npm 包支持了 类型声明，就是 @type/npm 包，d.ts 就是类型声明文件，我们就可以直接导入和使用，因为 d.ts 支持了类型声明
// declare var jQuery: (selector: string) => any;
// 让 ts 识别，编译器知道 $ 或 jQuery 是什么东西，declare var 并没有真的定义一个变量，只是定义了全局变量 jQuery 的类型，仅仅会用于编译时的检查，在编译结果中会被删除。
// jQuery('#foo');