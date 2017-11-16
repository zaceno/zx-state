function mapObj(orig, fn, onto) {
    return Object.keys((orig || {})).reduce((o, name) => {
        o[name] = fn(orig[name], name, o)
        return o
    }, (onto || {}))
} 

function bindFnCollection(binder, collection, ...more) {
    return mapObj(collection, (toBind, name, bound) => {
        if (typeof toBind === 'function') return binder(toBind, bound, ...more)
        return bindFnCollection(binder, toBind, ...more.map(x => x[name]))
    })
}

function collectSubs(opts, prop) {
    return mapObj(opts.sub, sub => Object.assign({}, collectSubs(sub, prop)), opts[prop])
}

function onceNextTick (fn) {
    var pending;
    return _ => {
        if (pending) return
        pending = !pending
        setTimeout(_ => {
        pending = !pending
        fn()
        }, 0)
    }
}

export default function (opts, notify) {
    
    const update = onceNextTick(notify || (_ => {})) 
    const state = collectSubs(opts, 'state')

    const actions = bindFnCollection(
        (fn, A, S) =>  (...args) => {
            var ret = fn(A, A, ...args)
            if (!ret) return
            Object.assign(state, ret)
            update()
        },
        collectSubs(opts, 'actions'),
        state
    )

    const views = bindFnCollection(
        (fn, V, S, A) => (...args) => fn(S, A, V, ...args),
        collectSubs(opts, 'views'),
        state,
        actions
    )

    update()
    return {actions, views}
}