const mapFunctionCollection = mapping => coll => {
    if (typeof coll == 'function') return mapping(coll)
    return Object.keys(coll).reduce((mapped, name) => {
        mapped[name] = mapping(coll[name])
        return mapped
    }, {})
}
const store = onupdate => {
    var state = {}
    const set = diff => {
        state = Object.assign({}, state, diff)
        onupdate()
    }
    return {
        init: set,
        getter: mapFunctionCollection(f => (...args) => f(state, ...args)),
        setter: mapFunctionCollection(f => (...args) => set(f(state, ...args))),
        component: mapFunctionCollection(f => f(store(onupdate))),
    }    
}

export default (main, onupdate) => {
    var pending = false
    return main(store(_ => {
        if (pending) return
        pending = !pending
        setTimeout(_ => {
            pending = !pending
            onupdate()
        })
    }))
}