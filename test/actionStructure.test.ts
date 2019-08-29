import {createActions} from '../src/createActions';
import {action} from '../src/raw';

test('should have only type field', () => {
  const actions = createActions({
    addTodo: action
  });
  const expected = { type: 'addTodo'};

  expect(actions.addTodo()).toEqual(expected);
});

test('should have type, payload and error fields', () => {
  const actions = createActions({
    addTodo: action.payload<string>()
  });
  const expected = { type: 'addTodo', payload: 'Add more tests', error: false};

  expect(actions.addTodo('Add more tests')).toEqual(expected);

  const direct = createActions(action.payload<string>(), 'test');
});

test('should have type, payload, meta and error fields', () => {
  const actions = createActions({
    addTodo: action.payload<string>().meta()
  });
  const expected = { type: 'addTodo', payload: 'Add more tests', error: false, meta: undefined};

  expect(actions.addTodo('Add more tests')).toEqual(expected);
});

test('should be error if payload is error', () => {
  const actions = createActions({
    failed: action.payload<Error>().meta()
  });

  expect(actions.failed(new Error('Oh my!')).error).toEqual(true);
});
