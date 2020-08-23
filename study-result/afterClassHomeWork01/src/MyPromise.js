// unhandleRejection 的处理
let catchFlag = false;
class MyPromise {
    constructor(fn) {
        this.value = null;
        this.fufillCallback = [];
        this.rejectedcallback = [];
        this.status = 'pending';
        let resolve = (value) => {
            this.status = 'fufilled';
            this.value = value;
            setTimeout(()=>{
                this.fufillCallback.forEach(item => item(this.value))
            }, 0)
        }
        let reject = (err) => {
            this.status = 'rejected';
            this.value = err;
            setTimeout(()=>{
                if(!catchFlag && !this.rejectedcallback.length) {
                    throw 'unhadlePromiserejection'
                }
                this.rejectedcallback.forEach(item => item(this.value));
                catchFlag = false;
            }, 0)
        }
        try {
            fn(resolve, reject);
        } catch(err) {
            reject(err)
        }
    }
    then(onFufilled, onRejected) {
        if(typeof onFufilled !== 'function') {
            onFufilled = (v) => v || this.value
        }
        if(typeof onRejected !== 'function') {
            onRejected = (v) => v || this.value
        }
        // 处理 thenable 对象
        let dealThenable = (thenable, resolve, reject) => {
            thenable.then(function(val){
                resolve(val)
            }, function(err){
                reject(err)
            })
        }
        let commonDeal = (value, resolve, reject) => {
            if(value instanceof MyPromise) {
                return value.then(resolve, reject);
            } else {
                if(typeof value === 'object' && typeof value.then === 'function') {
                    return dealThenable(value, resolve, reject)
                }
                resolve(value)
            }
        }
        return new MyPromise((resolve, reject) => {
            if(this.status === 'pending') {

                this.fufillCallback.push((v) => {
                    let value = onFufilled(v);
                    // 处理 promise 类型
                    commonDeal(value, resolve, reject)

                });
                this.rejectedcallback.push((v) => {
                    let value = onRejected(v);
                    // 处理 promise 类型
                    commonDeal(value, resolve, reject);
                })
            } else {
                if(this.status === 'fufilled') {
                    let value = onFufilled(this.value);
                    // 处理 promise 类型
                    commonDeal(value, resolve, reject)
                } else {
                    let value = onRejected(this.value);
                    // 处理 promise 类型
                    commonDeal(value, resolve, reject)
                }
            }
        })
    }
    catch(fn) {
        catchFlag = true;
        return this.then(null, fn)
    }
    // 无论如何执行cb投传数据
    finally(cb) {
        return this.then((v) => Promise.resolve(cb()).then(() => v), (err) => Promise.resolve(cb()).then(() => { throw err }))
    }
}
MyPromise.resolve = function(v) {
    return new MyPromise((res) =>{
        res(v)
    })
}
MyPromise.reject = function(v) {
    catchFlag = true;
    return new MyPromise((res, rej) =>{
        rej(v)
    })
}
MyPromise.all = function(arr) {
    let result = []
    if(!arr.length) MyPromise.resolve(result);
    let index = 0;
    for(let i = 0; i < arr.length; i++) {
        return new MyPromise((resolve, reject)=>{
            MyPromise.resolve(arr[i]).then(v => {
                if(index === arr.length) {
                    resolve(result)
                } else {
                    result[i] = v;
                    index++;
                }
            }).catch(err => {
                reject(err)
            })
        })

    }
}

MyPromise.race = function(arr) {
    for(let i = 0; i < arr.length; i++) {
        return new MyPromise((resolve)=>{
            MyPromise.resolve(arr[i]).then(v => {
                resolve(v)
            })
        })

    }
    return new MyPromise()
}