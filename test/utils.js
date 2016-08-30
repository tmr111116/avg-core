
export function cost(fn) {
    let start = Date.now();
    try {
        fn && fn();
    } catch (e) {

    }
    return Date.now() - start;
}
