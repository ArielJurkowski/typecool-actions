import {
  getForcedPrefix,
  getMappers,
  getOriginalRaw,
  hasMeta,
  hasPayload,
  isCreator,
  isPropertyForcedPrefix,
  isRaw,
  markAsCreator,
  markAsProcessed,
  setForcedPrefix
} from './helpers';
import {ActionCreator, ActionCreatorM, ActionCreatorP, ActionCreatorPM} from './interfaces';
import {action} from './raw';

type AnyActionCreator = ActionCreator | ActionCreatorP<any> | ActionCreatorM<any> | ActionCreatorPM<any, any>;

export function createAction<T = undefined>(type: string, definition?: T | AnyActionCreator): T extends undefined ? ActionCreator : T {
  return createActions((definition || action) as any, type);
}

export function createActions<T>(object: T, prefix:string = ''): T {
  const newObject = createActionsRec(object, prefix);
  setForcedPrefix(newObject, prefix);
  return newObject;
}

function createActionsRec<T extends any>(object: T, prefix:string = ''): T {
  const forcedPrefix = getForcedPrefix(object);
  prefix = forcedPrefix ? `${prefix}.${forcedPrefix}` : prefix;

  if (isCreator(object)) {
    const raw = isRaw(object) ? object : getOriginalRaw(object);
    const mappers = getMappers(raw);
    const combinedMapper = mappers.reduce(
      (prev, current) => (action) => current(prev(action)),
      (action) => action
    );
    const withPayload = hasPayload(raw);
    const withMeta = hasMeta(raw);
    const actionCreator: any = (payload: any) => {
      const action: any = {type: prefix};
      if (withPayload) {
        action.payload = payload;
        action.error = payload instanceof Error;
      }
      if (withMeta) action.meta = undefined;
      return combinedMapper(action);
    };
    actionCreator.type = prefix;
    actionCreator.meta = raw.meta;
    actionCreator.payload = raw.payload;
    actionCreator.map = raw.map;
    actionCreator.toString = () => prefix;
    markAsCreator(actionCreator);
    markAsProcessed(actionCreator, raw);
    return actionCreator as any as T;
  }

  prefix = `${prefix}${prefix.length === 0 ? '' : '.'}`;

  const newObject: any = {};
  Object.getOwnPropertyNames(object).forEach(name => {
    if (!isPropertyForcedPrefix(name)) {
      newObject[name] = createActionsRec(object[name], prefix + name);
    }
  });
  return newObject;
}
