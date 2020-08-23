const fp = require('lodash/fp');

const cars = [
    {
        name: 'Ferrari FF',
        horsePower: 660,
        dollar_value: 700000,
        in_stock: true,
    },
    {
        name: 'Jaguar XKR-S',
        horsePower: 550,
        dollar_value: 132000,
        in_stock: false,
    },
    {
        name: 'Audi R8',
        horsePower: 550,
        dollar_value: 114200,
        in_stock: false,
    },
    {
        name: 'Aston  Martin One-77',
        horsePower: 750,
        dollar_value: 1850000,
        in_stock: true,
    },
    {
        name: 'Pagai Huaya',
        horsePower: 700,
        dollar_value: 1300000,
        in_stock: false,
    }
];


let lastInStock = function(cars) {
    let last = fp.last(cars);
    return last.in_stock
}
let result = lastInStock(cars);
console.log(result);
// 练习一：使用 fp.flowRight 替换
function getStockprops(v) {
    return v.in_stock
}

function getLast(arr) {
    return arr[arr.length - 1];
}

const res = fp.flowRight(getStockprops, getLast)(cars)
console.log(res)
// 练习二：使用 fp.flowRight  fp.props fp.first 获取第一个car的name
let res1 = fp.flowRight(fp.prop('name'), fp.first)(cars)
console.log(res1);
// 练习三：使用 average 重构 avaragDollarValue 使用函数组合的方式实现
function average(xs) {
    return fp.reduce((fp.add, 0, xs)) / xs.length
}
let res2 = fp.flowRight(average, fp.map(item => item.dollar_value))(cars);
// 练习四：使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串，把数组中的 name 转化成如下形式：Hello World 变成 hello_world
let replace = fp.replace(/\W/g, '_');
function sanitizeNames(str) {
    return str.split('_').map(item => {return item[0].toUpperCase() + item.slice(1) }).join('_')
}
let res3 = fp.flowRight(sanitizeNames, replace)('hello world');
console.log(res3)