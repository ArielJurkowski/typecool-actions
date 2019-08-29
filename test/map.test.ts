import {ActionP} from '../src/interfaces';
import {createActions} from '../src/createActions';
import {action} from '../src/raw';

test('should uppercase payload using map', () => {
  const actions = createActions({
    addTodo: action.payload<string>()
      .map((action: ActionP<string>) => ({...action, payload: action.payload.toUpperCase()})),
  });

  expect(actions.addTodo('Do homework').payload).toEqual('DO HOMEWORK');
});

test('should add text in order', () => {
  const actions = createActions({
    addTodo: action.payload<string>()
      .map(action => ({...action, payload: action.payload + ' two'}))
      .map(action => ({...action, payload: action.payload + ' three'}))
  });

  expect(actions.addTodo('one').payload).toEqual('one two three');
});

test('should trim, add text and then uppercase payload using map chaining', () => {
  const actions = createActions({
    addTodo: action.payload<string>()
      .map(action => ({...action, payload: action.payload.trim()}))
      .map(action => ({...action, payload: `${action.payload}, please!`}))
      .map(action => ({...action, payload: action.payload.toUpperCase()}))
  });

  expect(actions.addTodo('  Do homework  ').payload).toEqual('DO HOMEWORK, PLEASE!');
});

interface Meta {
  timestamp: number,
  logged: boolean
}

test('should allow for meta creator', () => {
  const actions = createActions({
    addTodo: action.meta<Meta>()
      .map(action => ({...action, meta: {logged: true, timestamp: 1234}}))
  });
  const expected = {logged: true, timestamp: 1234};

  expect(actions.addTodo().meta).toEqual(expected);
});

test('should allow for meta creator, then payload, then a payload mapper and finally a meta changer', () => {
  const actions = createActions({
    addTodo: action
      .meta<Meta>()
      .map(action => ({...action, meta: {logged: false, timestamp: 1234}}))
      .payload<string>()
      .map(action => ({...action, payload: action.payload.toUpperCase()}))
      .map(action => ({...action, meta: {...action.meta, logged: true}}))
  });
  const expectedMeta = {logged: true, timestamp: 1234};
  const expectedPayload = 'HELLO';

  expect(actions.addTodo('Hello').meta).toEqual(expectedMeta);
  expect(actions.addTodo('Hello').payload).toEqual(expectedPayload);
});

test('should allow reusable mappers', () => {
  const upperCaseMapper = (action: ActionP<string>) => ({...action, payload: action.payload.toUpperCase()});
  const actionsOne = createActions({
    addTodo: action.payload<string>().map(upperCaseMapper)
  });
  const actionsTwo = createActions({
    addTodo: action.payload<string>().map(upperCaseMapper)
  });

  expect(actionsOne.addTodo('Hello').payload).toEqual('HELLO');
  expect(actionsTwo.addTodo('Hello').payload).toEqual('HELLO');
});
