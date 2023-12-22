import { SetStateAction, useCallback, useEffect, useState } from 'react';

type Listener<S> = (newState: SetStateAction<S>) => void;

interface GlobalState<S> {
  /** Method to update the state */
  __updateState?: (nextState: any, forceUpdate?: boolean) => void;
  /** Method to subscribe to state changes */
  subscribe: (fn: Listener<S>) => void;
  /** Method to unsubscribe from state changes */
  unsubscribe: (fn: Listener<S>) => void;
  /** Set to store the listeners */
  listener: Set<Listener<S>>;
  /** The current state */
  state: S;
  /** Method to update the state with optional force update */
  updateState: (nextState: S | any, forceUpdate?: boolean) => void;
}

interface IStateUpdater<S> {
  /** Method to set the state with an optional callback */
  setState: (newState: SetStateAction<S>, callback?: (newState: S) => void) => void;
  /** The current state */
  state: S;
}

/**
 * Creates a global state with the provided initial state.
 *
 * @template S - The type of the state object.
 * @param {S} [initialState] - Optional initial state for the global state.
 * @returns {GlobalState<S>} - An object representing the global state with various methods for state management.
 */
export function createGlobalState<S extends object>(initialState?: S): GlobalState<S> {
  let state: S = initialState || ({} as any);
  const listener: Set<Listener<S>> = new Set();
  const subscribe = (fn: Listener<S>): void => {
    listener.add(fn);
  };
  const unsubscribe = (fn: Listener<S>): void => {
    listener.delete(fn);
  };
  const updateState = (nextState: S, forceUpdate = true): void => {
    state = { ...state, ...nextState };
    if (forceUpdate) {
      listener.forEach(fn => fn(nextState));
    }
  };
  const store = {
    subscribe,
    unsubscribe,
    listener,
    get state(): S {
      return state;
    },
    set state(nextState) {
      state = nextState;
    },
    updateState,
    useGlobalStateValue: (pick?: Array<keyof S>): IStateUpdater<S> => {
      return useGlobalState(store, pick);
    },
  };
  return store;
}

/**
 * Custom React hook to subscribe to and update a global state.
 *
 * @template S - The type of the state object.
 * @template P - The type of keys to pick from the state object (optional).
 * @param {GlobalState<S>} subscriber - The global state object to subscribe to.
 * @param {P} [pick] - Optional array of keys to pick from the state object.
 * @returns {IStateUpdater<S>} - An object containing the current state and a method to update the state.
 */
export const useGlobalState = <S extends object, P extends [keyof S] | Array<keyof S>>(
  subscriber: GlobalState<S>,
  pick?: P,
): IStateUpdater<S> => {
  const [_, setUpdate] = useState({});

  const forceRerender = useCallback(
    (nextState: SetStateAction<S>) => {
      if (subscriber && (!pick?.length || Object.keys(nextState).find(k => pick.some(item => item === k)))) {
        setUpdate({});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pick],
  );

  useEffect(() => {
    if (subscriber) {
      subscriber.subscribe(forceRerender);
      return () => subscriber.unsubscribe(forceRerender);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state: subscriber?.state,
    setState: useCallback(
      (newState: SetStateAction<S>, callback?: Function) => {
        if (!subscriber) {
          return;
        }
        if (typeof newState === 'object' && newState.constructor === Object) {
          subscriber.state = Object.assign({}, subscriber.state, newState);
        } else if (typeof newState === 'function') {
          const nextState = newState(subscriber.state);
          subscriber.state = Object.assign({}, subscriber.state, nextState);
        } else {
          subscriber.state = newState;
        }
        subscriber.listener.forEach(fn => fn(newState));
        callback && callback();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [subscriber.state, pick],
    ),
  };
};
