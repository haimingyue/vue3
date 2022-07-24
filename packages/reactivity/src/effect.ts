// import {ReactiveEffect} from "vue";

export let activeEffect = undefined;
class ReactiveEffect {
    // 父亲是哪个effect
    public parent = null;
    public deps = [];
    // 在实例上新增active
    public active = true; // 这个effect默认是激活状态
    constructor(public fn) {
        //加public, 表示用户传递的参数也放到this上面。this.fn
    }
    run () {
        // run就是创建effect
        if (!this.active) {
            // 这里表示如果是非激活状态，就只执行函数，不进行依赖收集
            return this.fn();
        }
        // 这里进行依赖收集：把effect变成一个全局变量
        // 取值的时候，把全局变量和属性关联起来
        try {
            this.parent = activeEffect;
            activeEffect = this;
            return this.fn(); // 当稍后取值的时候，就可以获取到activeEffect
        } finally {
            activeEffect = this.parent;
        }
    }
}

export function effect (fn) {
    // fn可以根据状态变化重新执行
    // effect可以嵌套着写
    const _effect = new ReactiveEffect(fn);
    _effect.run(); // 默认先执行一次
}

const targetMap = new WeakMap();
export function track (target, type, key) {
    if (!activeEffect) return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get('key');
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    let shouldTrack = !dep.has(activeEffect)
    if (shouldTrack) {
         dep.add(activeEffect)
        activeEffect.deps.push(dep);
    }
    // 对象的某个属性有多个effect
}


export function trigger (target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;

    const effects = depsMap.get(key); // 找到了属性对应的effect
    effects && effects.forEach(e => {
        if (e !== activeEffect) {
            e.run();
        }
    })
}
