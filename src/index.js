function mapObj(orig, fn, onto) {
    return Object.keys((orig || {})).reduce((o, name) => {
        o[name] = fn(orig[name], name, o)
        return o
    }, (onto || {}))
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

function machine (opts, notify) {
    var pending;

    const update = _ => {
        if (pending) return
        pending = !pending
        setTimeout(_ => {
           pending = !pending
           notify && notify()
        }, 0)
    }
    
    const state = collectSubs(opts, 'state')

    const actions = bindFnCollection(
        (fn, actions, state) =>  (...args) => {
            var data = fn(state, actions, ...args)
            if (!data) return
            Object.assign(state, data)
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
