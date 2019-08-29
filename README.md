# typecool-actions

Typed, minimalistic, composable, FSA compliant Action Creators for Redux / Flux.

## Installation

```bash
npm install typecool-actions --save
```

## Imports

```typescript
import {action, createActions, createAction} from 'typecool-actions';

// soon: reducer-related functionality
```

## action - define actions

The 'action' 
keyword is a constant. With it you define your action creator.  
By itself it's in its raw form and it's meant to be used with createActions() and createAction().  
Use it define the type of your payload, type of your meta and your action mappers.
```typescript
action.payload<string>() // action with a payload of type string
action.meta<number>() // action with meta of type number
action.payload<string>().meta<number>() // string payload and number meta
action.meta<number>().payload<string>() // reverse order works too
action // no payload, no meta, just the generated type
action.payload().meta() // payload and meta are both any by default
```

You can also use the map function to transform your action object after invoking the action creator.  
You can use it to create a default meta object, change values in your payload or whatever you want.  
Examples of map can be seen further down.

## createActions() - simple example

```typescript
const todoListActions = createActions({
  addTodo: action.payload<string>(),
  removeTodo: action.payload<number>(),
  refreshTodoList: action
});

todoListActions.addTodo('Code review!');
// { type: 'addTodo', payload: 'Code review!', error: false }

todoListActions.removeTodo(1337);
// { type: 'removeTodo', payload: 1337, error: false }

todoListActions.refreshTodoList();
// { type: 'refreshTodoList' }
```

## createActions() - composing

You can reuse, chain and nest your actions however you want.

```typescript
// Lets say we have a single Meta interface for all actions
// I can simply do this and reuse my new constant anywhere I want
// I'll use this instead of the action consant now!
const actionWithMeta = action.meta<MyMetaType>();
// In a later section you'll see examples of how to set default meta using map

// Great, I also noticed that many of my actions share the same properies
// Lets say I want to reuse some timer actions
// Note that this just an object
const timer = {
  start: actionWithMeta,
  finish: actionWithMeta.payload<number>()
};

// Okay, lets use it a couple of times for different things
// Note that you can use nested objects
const timerActions = createActions({
  nascarRace: timer,
  training: {
    basketball: timer,
    soccer: timer
  }
});

timerActions.nascarRace.start();
// { type: 'nascarRace.start', meta: undefined }

timerActions.nascarRace.finish(60);
// { type: 'nascarRace.finish', payload: 60, error: false, meta: undefined }

timerActions.training.soccer.start();
// { type: 'training.soccer.start', meta: undefined }
```

## createActions() - composing with generics

Lets say you want to create set of actions for promises. Promises need a trigger, success and failure actions. Obviously we would like to reuse this routine, but with different types for success every time we use it. You can easly create your own generic sets... again - we're working with simple objects.

```typescript
// My own meta action
const actionWithMeta = action.meta<MyMetaType>();

// Generic function that returns an object with action definitions
function promiseActions<SuccessT>() {
  return {
    trigger: actionWithMeta,
    success: actionWithMeta.payload<SuccessT>(),
    failure: actionWithMeta.payload<Error>()
  };
}

// Create our actions
const actions = createActions({
  addTodo: promiseActions<string>(),
  getTodoDetails: promiseActions<TodoDetails>()
});

actions.addTodo.success('id123');
// { type: 'addTodo.success', payload: 'id123', error: false, meta: undefined }

actions.getTodoDetails.failure(new Error());
// { type: 'getTodoDetails.failure', payload: {error}, error: true, meta: undefined }
```

## map

You can attach a function to modify your action by using the map keyword. Lets use to create a base action with default meta values and to modify a todo action.

```typescript
interface MyMetaType {
  timestamp: number;
  log: boolean;
}

// Lets use map, we use the spread operator and then overwrite meta
// This will be my base action for all actions in the app
const actionWithMeta = action.meta<MyMetaType>()
  .map(action => ({...action, meta: { timestamp: 123, log: true }}));

// Lets make an todo action with formatting of the payload
const actions = createActions({
  addTodo: actionWithMeta.payload<string>()
    .map(action => ({...action, payload: action.payload.toUpperCase()}))
    .map(action => ({...action, payload: action.payload + '!!!!'}))
});

actions.addTodo('Homework');
// { 
//   type: 'addTodo',
//   payload: 'HOMEWORK!!!!',
//   error: false, 
//   meta: { timestamp: 123, log: true }
// }
```

## createAction() - create single action

This is just an adapter, it uses the same logic as createActions. If you're planning to use only this function, then reconsider using this library in the first place. Use this only if you actually have just one action in a file.

Since there isn't an object that the library can generate the type from, then you're forced to add it in the first parameter.

```typescript

const addTodo = createAction('addTodo', action.payload<string().map(...);
// { type: 'refreshTodoList', payload: 'Wash your teeth', error: false }

const refreshTodoList = createAction('refreshTodoList');
// { type: 'refreshTodoList' }
// If you don't add the 2nd parameter, then it'll default to the action const
```

## Type property notation
Since the meat of the library is defining and composing actions using simple objects, then it only makes sense to autogenerate the 'type' property according to those objects using the.object.dot.notation instead of THIS_SILLY_METHOD.

createAction() supports a second prefix parameter, it'll be also attached with a dot notation to the rest of the type string. Using THIS_NOTATION may be a good idea for prefixes.

## Contact
E-mail: [arieljurkowski@gmail.com](mailto:arieljurkowski@gmail.com)  
Send me a nice message if you're using this!

## License
[MIT](https://choosealicense.com/licenses/mit/)
