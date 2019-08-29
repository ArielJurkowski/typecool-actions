import {createActions} from '../src/createActions';
import {action} from '../src/raw';

test('should allow to createAction a reusable base meta', () => {
  const actionWithMeta = action.meta<string>().map(a => ({...a, meta: 'Meta'}));

  const actions = createActions({
    addTodo: actionWithMeta.payload<string>(),
    removeTodo: actionWithMeta.payload<number>(),
  });
  const expectedAdd = { type: 'addTodo', meta: 'Meta', error: false, payload: 'Payload'};
  const expectedRemove = { type: 'removeTodo', meta: 'Meta', error: false, payload: 123};

  expect(actions.addTodo('Payload')).toEqual(expectedAdd);
  expect(actions.removeTodo(123)).toEqual(expectedRemove);
});

test('should allow to createAction a reusable base payload', () => {
  const actionWithPayload = action.payload<string>().map(a => ({...a, payload: 'Payload'}));

  const actions = createActions({
    addTodo: actionWithPayload.meta<number>().map(a => ({...a, meta: 1})),
    removeTodo: actionWithPayload.meta<number>().map(a => ({...a, meta: 2}))
  });

  const expectedAdd = { type: 'addTodo', meta: 1, error: false, payload: 'Payload'};
  const expectedRemove = { type: 'removeTodo', meta: 2, error: false, payload: 'Payload'};

  expect(actions.addTodo('Payload')).toEqual(expectedAdd);
  expect(actions.removeTodo('Payload')).toEqual(expectedRemove);
});

test('should allow to createAction a reusable typed set of actions', () => {
  function asyncActions<TriggerT, SuccessT>() {
    return {
      trigger: action.payload<TriggerT>(),
      success: action.payload<SuccessT>(),
      failure: action.payload<Error>()
    }
  }

  const actions = createActions({
    addTodo: asyncActions<number, string>(),
    removeTodo: asyncActions<string, number>()
  });

  const expectedAddSuccess = { type: 'addTodo.success', error: false, payload: 'Test'};
  const expectedRemoveSuccess = { type: 'removeTodo.success', error: false, payload: 123};

  expect(actions.addTodo.success('Test')).toEqual(expectedAddSuccess);
  expect(actions.removeTodo.success(123)).toEqual(expectedRemoveSuccess);
});
