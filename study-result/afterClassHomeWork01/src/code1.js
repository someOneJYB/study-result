function composePromise(f1, f2, f3) {
    let start = Promise.resolve(f1());
    for(let i = 1; i < arguments.length; i++) {
        start = start.then(v => arguments[i](v))
    }
    return start
}
function f1() {
    return 'hello';
}
function f2(v) {
    return v + ' ' + 'lagou';
}

function f3(v) {
    console.log(v + ' ' +'I love U');
}

composePromise(f1, f2, f3)