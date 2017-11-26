# zx-state

A minimalistic and unfancy state management library for building web apps with virtual dom. Very much in an exploration phase.

Traditional [TodoMVC Example](https://codepen.io/zaceno/pen/eejdjE?editors=0010) (feel free to improve it :) )

## Basic usage

Basic counter example (using picodom for rendering)

([Live example](https://codepen.io/zaceno/pen/VrdzYB?editors=0010))

```jsx
import {h, patch} from 'picodom'
import zxState from 'zx-state'
/** @jsx h */

//define the main app component
function counter (store) {
    store.set({ value: 0 })
    
    const increment = store.with(state => store.set({value: state.value + 1}))
    const decrement = store.with(state => store.set({value: state.value - 1}))
    
    //return a view-function bound to the state, that renders the counter
    return store.with(state => (
        <div>
            <button onclick={decrement}> - </button>
            {state.value}
            <button onclick={increment}> + </button>
        </div>
    ))    
}


//run the app:

var node
const view = zxState(counter, _ => patch(node, (node = view())))

```

and this works too:

([Live example](https://codepen.io/zaceno/pen/YEvEWQ?editors=0010))

```jsx
import {h, patch} from 'picodom'
import zxState from 'zx-state'
/** @jsx h */


function counter (store) {
    store.set({ value: 0 })
    const bound = store.with({
        increment: state => store.set({value: state.value + 1}),
        decrement: state => store.set({value: state.value -1 }),
        view: state => (
            <div>
                <button onclick={bound.decrement}> - </button>
                {state.value}
                <button onclick={bound.increment}> + </button>
            </div>
        )
    })
    return bound.view
}


//run the app:
var node
const view = zxState(counter, _ => patch(node, (node = view())))

```

## Multiple components

A more advanced example with multiple dynamic components, demonstrating the use of store.sync to instantiate synced stores (which call the same onupdate function as the parent store)

[Live example](https://codepen.io/zaceno/pen/ZaRayE?editors=0010)

```jsx
import {h, patch} from 'picodom'
import zxState from 'zx-state'
/** @jsx h */


function counter (store, value, onremove) {
    store.set({value})
    const actions = store.with({
        increment: state => store.set({value: state.value + 1}),
        decrement: state => store.set({value: state.value -1 }),
    })
    return store.with({
        value: state => state.value,
        view: state => (
            <div>
                <button onclick={actions.decrement}> - </button>
                {state.value}
                <button onclick={actions.increment}> + </button>
                <button onclick={onremove}> x </button>
            </div>
        )        
    })
}


function multiCounter (store) {
    store.set({list: []})

    const actions = store.with({
    
        remove: (state, cnt) => {
            const l = state.list.slice()
            l.splice(l.indexOf(cnt), 1)
            store.set({list: l})
        },
        
        add: state => {
            const cnt = store.sync(counter, 10, _ => actions.remove(cnt))
            store.set({list: [].concat(state.list, cnt)})
        }
    })

    const calc = store.with({
    
        total: state => state.list.reduce((tot, cnt) => tot + cnt.value(), 0),
        
        view: state => (
            <div>
                {state.list.map(cnt => cnt.view())}
                <p>Total: {calc.total()}</p>
                <p><button onclick={actions.add}>Add Counter</button></p>
            </div>
        )
    })

    return calc.view
}


function person (store, initialName) {
    store.set({name: initialName})

    const set = name => store.set({name})
    
    return store.with({
    
        greeting: state => (<h1>Hello, {state.name}!</h1>),
        
        entry: state => (
            <p>
                Please enter your name:
                <input type="text" value={state.name} oninput={ev => set(ev.currentTarget.value)} />
            </p>
        )
    })
}


function main (store) {
    const Person = store.sync(person, 'Barbaz Foo')
    const Counters = store.sync(multiCounter)
    return _ => (
        <main>
            <Person.greeting />
            <hr />
            <Counters />
            <hr />
            <Person.entry />
        </main>
    )
}

//run the app:
var node
const view = zxState(main, _ => patch(node, (node = view())))
```


