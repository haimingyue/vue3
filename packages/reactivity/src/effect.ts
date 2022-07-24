// import {ReactiveEffect} from "vue";

export let activeEffect = undefined;
class ReactiveEffect {
    // 在实例上新增active
    public active = true; // 这个effect默认是激活状态
    constructor(public fn) {
        //加public, 表示用户传递的参数也放到this上面。this.fn
    }
    run () {
        // run就是创建effect
        if (!this.active) {
            // 这里表示如果是非激活状态，就只执行函数，不进行依赖收集
            this.fn();
        }
        // 这里进行依赖收集：把effect变成一个全局变量
        // 取值的时候，把全局变量和属性关联起来
        try {
            activeEffect = this;
            return this.fn(); // 当稍后取值的时候，就可以获取到activeEffect
        } finally {
            activeEffect = undefined;
        }
    }
}

export function effect (fn) {
    // fn可以根据状态变化重新执行
    // effect可以嵌套着写
    const _effect = new ReactiveEffect(fn);
    _effect.run(); // 默认先执行一次
}
