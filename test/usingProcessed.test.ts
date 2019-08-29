import {createActions} from '../src/createActions';
import {action} from '../src/raw';

test('should allow extending creators from already processed objects without side effects', () => {

  const actionsOne = createActions({
    one: action
  }, 'prefix');

  const actionsTwo = createActions({
    two: actionsOne.one.payload<string>()
  }, 'prefix');

  const actionsThree = createActions({
    three: actionsTwo.two.meta<number>().map(action => ({...action, meta: 111}))
  }, 'prefix');

  const actionsFour = createActions({
    four: actionsThree.three
      .map(action => ({...action, payload: action.payload.toUpperCase()}))
      .map(action => ({...action, meta: action.meta * 3}))
  });

  const expected = {type: 'four', payload: 'HELLO', error: false, meta: 333};

  expect(actionsFour.four('Hello')).toEqual(expected);
});

test('should allow extending creators from already processed objects without side effects', () => {

  const actionsOne = createActions({
    one: action
  }, 'prefix');

  const actionsTwo = createActions({
    two: actionsOne.one.payload<string>()
  }, 'prefix');

  const actionsThree = createActions({
    three: actionsTwo.two.meta<number>().map(action => ({...action, meta: 111}))
  }, 'prefix');

  const actionsFour = createActions({
    four: actionsThree.three
      .map(action => ({...action, payload: action.payload.toUpperCase()}))
      .map(action => ({...action, meta: action.meta * 3}))
  });

  const expected = {type: 'four', payload: 'HELLO', error: false, meta: 333};

  expect(actionsFour.four('Hello')).toEqual(expected);
});

test('should allow composing using processed objects', () => {
  const actionsOne = createActions({
    one: action.payload<string>()
      .map(action => ({...action, payload: action.payload.toUpperCase()}))
  }, 'prefixTwo');

  const actionTwo = createActions({
    two: actionsOne
  }, 'prefixOne');

  const expected = {type: 'prefixOne.two.prefixTwo.one', payload: 'HELLO', error: false};

  expect(actionTwo.two.one('Hello')).toEqual(expected);
});
