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
    return mapObj(opts.sub, sub => ({...collectSubs(sub, prop)}), opts[prop])
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
  
  function curriedCaller (fn, bound, ...more) {
    return  function (...args) {
      var ret = fn(...more, bound)
      if (typeof ret === 'function') ret = ret(...args)
      return ret
    }
  }
  
  function actionCaller (update) {
    return function (action, actions, state) {
      var caller = curriedCaller(action, actions, state)
      return  function (...args) {
        var ret = caller(...args)
        if (!ret) return
        Object.assign(state, ret)
        update()
      }
    }
  }
  
  
  export default function (opts, notify) {
    const update = onceNextTick(notify || (_ => {})) 
    const state = collectSubs(opts, 'state')
    const actions = bindFnCollection(actionCaller(update), collectSubs(opts, 'actions'), state)
    const views = bindFnCollection(curriedCaller, collectSubs(opts, 'views'), state, actions)
    update()
    return {actions, views}
  }