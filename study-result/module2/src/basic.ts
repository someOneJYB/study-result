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