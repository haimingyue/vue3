import { isObject } from '@vue/shared'

// 第一步：将数据转换成响应式数据
// 3. 做缓存，WeakMap不会导致内存泄露
const reactiveMap = new WeakMap()
// 第一次普通对象代理，可以同步new Proxy代理
// 下一次传递的是Proxy，看一下有没有代理过，如果访问这个Proxy，有get方法的时候，说明就访问过了
const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
// reactive 只能做对象的代理
// 1) 同一个对象多次代理，返回同一个代理
// 2) 代理对象被再次代理，可以直接返回
export function reactive (target) {
    // 1. 先判断传入的object是不是对象
    if (!isObject(target)) return;
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target;
    }
    // 2. 并没有重新定义属性，只是代理，在取值的时候，调用get，在赋值的时候，调用set
    let existingProxy = reactiveMap.get(target);
    console.log('existingProxy', existingProxy)
    if (existingProxy) {
        console.log('执行')
        return existingProxy;
    }
    const proxy = new Proxy(target, {
        get (target, key, receiver) {
            console.log(target)
            console.log(key)
            if (key === ReactiveFlags.IS_REACTIVE) {
                return true;
            }
            // target:
            // key:
            // receiver: 当前的代理对象，保证this的指向
            // 去代理对象上取值，走get
            // return target[key];
            // 这里可以监控到用户取值
            return Reflect.get(target, key, receiver);
        },
        set (target, key, value, receiver) {
            // 去代理上设置值，走set
            // target[key] = value;
            // 这里可以监控到用户设置值
            Reflect.set(target, key, value, receiver);
            return true;
        }
    })
    reactiveMap.set(target, proxy);
    return proxy;
}
