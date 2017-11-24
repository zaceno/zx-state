# zx-state
state management library

Basic counter example (using picodom for rendering)

([Live example](https://codepen.io/zaceno/pen/VrdzYB?editors=0010))

```jsx
import {h, patch} from 'picodom'
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
const {h, patch} = picodom
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
