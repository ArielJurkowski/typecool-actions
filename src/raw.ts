import {
  ActionCreator,
  ActionCreatorM,
  ActionCreatorP,
  ActionCreatorPM,
  ActionMapperM,
  ActionMapperP,
  ActionMapperPM,
} from './interfaces';
import {injectMappers, markAsCreator, markAsRaw, setTypeFlags} from './helpers';
import {error} from './errors';

function raw<M, AC>(payload: boolean, meta:boolean, mappers: M[]): AC {
  const rawError = () => { throw error.usingRaw };
  const raw: any = rawError;
  raw.toString = rawError;
  Object.defineProperty(raw, 'type', {get: rawError, set: rawError});
  injectMappers(raw, mappers);
  markAsCreator(raw);
  markAsRaw(raw);
  setTypeFlags(raw, payload, meta);
  return raw as AC;
}

export const action = raw<undefined, ActionCreator>(false, false, []);
action.payload = <P>() => rawP<P>();
action.meta = <M>() => rawM<M>();

function rawP<P>(mappers: ActionMapperP<P>[] = []): ActionCreatorP<P> {
  const creator = raw<ActionMapperP<P>, ActionCreatorP<P>>(true, false, mappers);
  creator.meta = <M>() => rawPM<P, M>([...mappers as any]);
  creator.map = (mapper: ActionMapperP<P>) => rawP<P>([...mappers, mapper]);
  return creator;
}

function rawM<M>(mappers: ActionMapperM<M>[] = []): ActionCreatorM<M> {
  const creator = raw<ActionMapperM<M>, ActionCreatorM<M>>(true, false, mappers);
  creator.payload = <P>() => rawPM<P, M>([...mappers as any]);
  creator.map = (mapper: ActionMapperM<M>) => rawM<M>([...mappers, mapper]);
  return creator;
}

function rawPM<P, M>(mappers: ActionMapperPM<P, M>[] = []): ActionCreatorPM<P, M> {
  const creator = raw<ActionMapperPM<P, M>, ActionCreatorPM<P, M>>(true, false, mappers);
  creator.map = (mapper: ActionMapperPM<P, M>) => rawPM<P, M>([...mappers, mapper]);
  return creator;
}
