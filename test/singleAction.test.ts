import {createAction, createActions} from '../src';
import {action} from '../src';

test('should allow to create a single action', () => {
  const single = createAction('addTodoPlease');

  expect(single().type).toEqual('addTodoPlease');
});

test('should allow to create a single action with meta and payload', () => {
  const single = createAction('addTodoPlease', action.payload<string>().meta<number>().map(a => ({...a, meta: 123})));

  const expected = {type: 'addTodoPlease', payload: 'Test', error: false, meta: 123};

  expect(single('Test')).toEqual(expected);
});

test('should allow to be also used in createActions', () => {
  const single = createAction('addTodoPlease', action.payload<string>());
  const actions = createActions({
    one: single,
    two: single
  });

  const expectedOne = { type: 'one.addTodoPlease', payload: 'One', error: false };
  const expectedTwo = { type: 'two.addTodoPlease', payload: 'Two', error: false };

  expect(actions.one('One')).toEqual(expectedOne);
  expect(actions.two('Two')).toEqual(expectedTwo);
});
