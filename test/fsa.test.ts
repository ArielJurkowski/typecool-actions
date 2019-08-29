import {isFSA} from 'flux-standard-action';
import {createActions} from '../src/createActions';
import {action} from '../src/raw';

test('raw only should be FSA compliant', () => {
  const actions = createActions({
    addTodo: action
  });
  expect(isFSA(actions.addTodo())).toBeTruthy();
});

test('raw with payload should be FSA compliant', () => {
  const actions = createActions({
    addTodo: action.payload<string>()
  });
  expect(isFSA(actions.addTodo('Homework'))).toBeTruthy();
});

test('raw with payload and meta should be FSA compliant', () => {
  const actions = createActions({
    addTodo: action.payload<string>().meta()
  });
  expect(isFSA(actions.addTodo('Homework'))).toBeTruthy();
});

test('raw with error payload should be FSA compliant', () => {
  const actions = createActions({
    failed: action.payload<Error>()
  });
  expect(isFSA(actions.failed(new Error('Bzzt!')))).toBeTruthy();
});
