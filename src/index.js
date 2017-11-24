export default (main, onupdate) => {
    var pending = false
    const mapFunctionCollection = mapping => coll => {
        if (typeof coll == 'function') return mapping(coll)
        return Object.keys(coll).reduce((mapped, name) => {
            mapped[name] = mapping(coll[name])
            return mapped
        }, {})
    }
    const store = _ => {
        var state = {}
        return {
            set: diff => {
                state = Object.assign({}, state, diff)
                if (pending) return
                pending = !pending
                setTimeout(_ => {
                    pending = !pending
                    onupdate()
                })
            },
            with: mapFunctionCollection(f => (...args) => f(state, ...args)),
            sync: (f, ...args) => f(store(), ...args),
        }
    }
    return main(store())
}