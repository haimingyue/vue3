
import { track, trigger } from "./effect";
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
export const mutableHandlers = {
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
        track(target, 'get', key);
        return Reflect.get(target, key, receiver);
    },
    set (target, key, value, receiver) {
        // 去代理上设置值，走set
        // target[key] = value;
        let oldVal = target[key]
        // 这里可以监控到用户设置值
        let result = Reflect.set(target, key, value, receiver);
        if (oldVal !== result) {
             // 不一致需要更新
            trigger(target, 'set', key, value, oldVal)
        }
        return true;
    }
}
