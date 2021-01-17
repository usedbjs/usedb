import { QueryData, Connection } from '@usedb/core';
import { refetchCallbacks } from '../utils';
import { UseDBReactContext } from '../context';
import { useCallback, useContext, useEffect, useReducer } from 'react';
import { fetchReducer } from './reducers';

type ISetQueryConfig = {
  optimistic: boolean;
};

export function useDB(queryData: QueryData) {
  const {
    connection,
  }: {
    connection: Connection;
  } = useContext(UseDBReactContext);

  const [state, dispatch] = useReducer(fetchReducer, {
    status: 'idle',
    data: undefined,
    error: undefined,
  });

  useEffect(() => {
    if (queryData) {
      revalidate();
    }
  }, [queryData && queryData.getHash()]);

  // Used for getter queries
  const revalidate = useCallback(() => {
    state.data
      ? dispatch({ type: 'REVALIDATING' })
      : dispatch({ type: 'LOADING' });
    connection
      .query(queryData, true)
      .then(data => dispatch({ type: 'SUCCESS', payload: data }))
      .catch(error => dispatch({ type: 'ERROR', payload: error }));
  }, [state.data]);

  // Used for mutation queries
  const setQuery = (query: QueryData, config?: ISetQueryConfig) => {
    let reversePatch = () => {};
    if (config?.optimistic) {
      //@ts-ignore
      reversePatch = connection.cache._optimisticUpdate(
        query.collection,
        query.payload
      );
    }

    dispatch({ type: 'LOADING' });
    connection
      .query(query)
      .then(data => dispatch({ type: 'SUCCESS', payload: data }))
      .catch(error => {
        dispatch({ type: 'ERROR', payload: error });
        reversePatch();
      });
  };

  useEffect(() => {
    if (queryData) {
      refetchCallbacks.set(queryData.collection, revalidate);
      return () => {
        refetchCallbacks.delete(queryData.collection, revalidate);
      };
    }
    return;
  }, [queryData, revalidate]);

  return { setQuery, ...state };
}
