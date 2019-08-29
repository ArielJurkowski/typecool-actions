import {createActions} from '../src/createActions';
import {action} from '../src/raw';

test('should name the raw based on the key', () => {
  const actions = createActions({
    addTodo: action
  });
  expect(actions.addTodo().type).toBe('addTodo');
});

test('should add prefix to raw with dot notation', () => {
  const actions = createActions({
    addTodo: action
  }, 'prefix');
  expect(actions.addTodo().type).toBe('prefix.addTodo');
});

test('nested path should be using dot notation', () => {
  const actions = createActions({
    one: {
      two: {
        three: {
          addTodo: action
        }
      }
    }
  }, 'prefix');
  expect(actions.one.two.three.addTodo().type).toBe('prefix.one.two.three.addTodo');
});

test('raw type, raw creator type and toString() in raw creator should be equal', () => {
  const actions = createActions({
    one: {
      two: {
        three: {
          addTodo: action
        }
      }
    }
  }, 'prefix');
  expect(actions.one.two.three.addTodo.type).toBe(actions.one.two.three.addTodo().type);
  expect(actions.one.two.three.addTodo.type).toBe(actions.one.two.three.addTodo.toString());
});

test('composed actions should be using dot notation', () => {
  const promise = createActions({
    trigger: action,
    success: action,
    failure: action
  });
  const actions = createActions({
    addTodo: promise,
    removeTodo: promise,
    nested: {
      getTodo: promise
    }
  });
  expect(actions.addTodo.trigger().type).toBe('addTodo.trigger');
  expect(actions.addTodo.success().type).toBe('addTodo.success');
  expect(actions.addTodo.failure().type).toBe('addTodo.failure');
  expect(actions.removeTodo.trigger().type).toBe('removeTodo.trigger');
  expect(actions.removeTodo.success().type).toBe('removeTodo.success');
  expect(actions.removeTodo.failure().type).toBe('removeTodo.failure');
  expect(actions.nested.getTodo.trigger().type).toBe('nested.getTodo.trigger');
  expect(actions.nested.getTodo.success().type).toBe('nested.getTodo.success');
  expect(actions.nested.getTodo.failure().type).toBe('nested.getTodo.failure');
});

test('actions that are used for composition should not change type', () => {
  const timer = createActions({
    start: action,
    stop: action
  });
  const actions = createActions({
    race: timer
  });
  expect(timer.start().type).toBe('start');
  expect(timer.stop().type).toBe('stop');
});

test('all prefixes should remain for composed actions', () => {
  const timer = createActions({
    start: action,
    stop: action
  }, 'timer');
  const actions = createActions({
    race: timer
  }, 'actions');
  expect(actions.race.start().type).toBe('actions.race.timer.start');
  expect(actions.race.stop().type).toBe('actions.race.timer.stop');
});

test('raw used for composition should keep prefix', () => {
  const timer = createActions({
    start: action,
    stop: action
  }, 'timer');
  const actions = createActions({
    race: timer
  });
  expect(actions.race.start().type).toBe('race.timer.start');
  expect(actions.race.stop().type).toBe('race.timer.stop');
});
