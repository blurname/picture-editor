export const throttle = (fn: (args?: unknown[]) => void, delay = 100) => {
    let valid = true
    return () => {
        if (!valid) {
            //休息时间 暂不接客
            return
        }
        // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}