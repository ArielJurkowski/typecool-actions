import {error} from '../src/errors';
import {action} from '../src/raw';
test('using type, toString or creating raw from raw creators should throw error', () => {
  const rawActions = {
    addTodo: action,
    deleteTodo: action.payload<number>().meta<boolean>(),
    showTodo: action.payload<string>()
  };

  expect(() => rawActions.addTodo()).toThrow(error.usingRaw);
  expect(() => rawActions.addTodo.type).toThrow(error.usingRaw);
  expect(() => rawActions.addTodo.toString()).toThrow(error.usingRaw);
  expect(() => rawActions.deleteTodo(123)).toThrow(error.usingRaw);
  expect(() => rawActions.deleteTodo.type).toThrow(error.usingRaw);
  expect(() => rawActions.deleteTodo.toString()).toThrow(error.usingRaw);
  expect(() => rawActions.showTodo('Homework')).toThrow(error.usingRaw);
  expect(() => rawActions.showTodo.type).toThrow(error.usingRaw);
  expect(() => rawActions.showTodo.toString()).toThrow(error.usingRaw);
});
