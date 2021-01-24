import { QueryData, Connection, getHash } from '@usedb/core';
import { refetchCallbacks } from '../utils';
import { UseDBReactContext } from '../context';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { fetchReducer } from './reducers';

type ISetQueryConfig = {
  optimistic: boolean;
};

export function useDB(queryData?: QueryData) {
  const {
    connection,
  }: {
    connection: Connection;
  } = useContext(UseDBReactContext);
  const queryHash = useMemo(() => {
    return getHash(queryData);
  }, [queryData]);
  const mounted = useRef(true);

  const [state, dispatch] = useReducer(fetchReducer, {
    status: 'idle',
    data: undefined,
    error: undefined,
  });

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const dispatchOnMounted = (...args: any) => {
    if (mounted.current) {
      dispatch(args[0]);
    }
  };

  useEffect(() => {
    if (queryData) {
      revalidate();
    }
  }, [queryData && queryHash]);

  // Used for getter queries
  const revalidate = useCallback(() => {
    if (queryData) {
      dispatchOnMounted({ type: 'LOADING' });
      connection
        .query(queryData)
        .then(data =>
          dispatchOnMounted({
            type: 'SUCCESS',
            payload: data,
          })
        )
        .catch(error => dispatchOnMounted({ type: 'ERROR', payload: error }));
    }
  }, [queryData && queryHash, state.data]);

  // Used for mutation queries
  const setQuery = (query: QueryData, config?: ISetQueryConfig) => {
    let undoOptimisticUpdate = () => {};
    if (config?.optimistic) {
      //@ts-ignore
      undoOptimisticUpdate = connection.cache[query.operation](
        query.collection,
        query.payload
      );
    }

    dispatchOnMounted({ type: 'LOADING' });
    connection
      .query(query)
      .then(data => {
        dispatchOnMounted({
          type: 'SUCCESS',
          payload: data,
        });
      })
      .catch(error => {
        dispatchOnMounted({ type: 'ERROR', payload: error });
        undoOptimisticUpdate();
      });
  };

  useEffect(() => {
    if (queryData) {
      refetchCallbacks.set(queryData, revalidate);
    }
    return () => {
      if (queryData) {
        refetchCallbacks.delete(queryData, revalidate);
      }
    };
  }, [revalidate]);

  if (queryData) {
    if (connection.cache.has(queryData)) {
      state.data = connection.cache.denormalize(queryData?.queryKey);
    }
  }

  return { setQuery, ...state };
}
