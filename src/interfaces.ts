////////
//////// Actions
////////

export interface Action {
  type: string;
}

export interface ActionP<P> extends Action {
  payload: P;
  error: boolean;
}

export interface ActionM<M> extends Action {
  meta: M;
}

export interface ActionPM<P, M> extends ActionP<P>, ActionM<M> {}

////////
//////// Action Mappers
////////

interface ActionMapperBase<T> {
  (a: T): T;
}

export interface ActionMapperP<P> extends ActionMapperBase<ActionP<P>> {}
export interface ActionMapperM<M> extends ActionMapperBase<ActionM<M>> {}
export interface ActionMapperPM<P, M> extends ActionMapperBase<ActionPM<P, M>> {}

////////
//////// Action Creators
////////

interface ActionCreatorBase {
  type: string;
}

export interface ActionCreator extends ActionCreatorBase {
  (): Action;
  payload: <P = any>() => ActionCreatorP<P>;
  meta: <M = any>() => ActionCreatorM<M>;
}

export interface ActionCreatorP<P> extends ActionCreatorBase {
  (payload: P): ActionP<P>;
  meta: <M>() => ActionCreatorPM<P, M>;
  map: (mapper: ActionMapperP<P>) => ActionCreatorP<P>;
}

export interface ActionCreatorM<M> extends ActionCreatorBase {
  (): ActionM<M>;
  payload: <P>() => ActionCreatorPM<P, M>;
  map: (mapper: ActionMapperM<M>) => ActionCreatorM<M>;
}

export interface ActionCreatorPM<P, M> extends ActionCreatorBase {
  (payload: P): ActionPM<P, M>;
  map: (mapper: ActionMapperPM<P, M>) => ActionCreatorPM<P, M>;
}
