import { useEffect, useContext, useReducer, useMemo, useCallback } from 'react';
import { Connection, md5, QueryData } from '@usedb/core';
import { UseDBReactContext } from '../context';
import { refetchCallbacks } from '../utils';
import { fetchReducer } from './reducers';

export function useDBQuery(queryData: QueryData) {
  const {
    connection,
  }: {
    connection: Connection;
  } = useContext(UseDBReactContext);

  const queryHash = useMemo(() => {
    return md5(JSON.stringify(queryData));
  }, [queryData]);

  const [state, dispatch] = useReducer(fetchReducer, {
    status: 'idle',
    data: undefined,
    error: undefined,
  });

  // Fetch queries get from cache if available
  const fetchQuery = () => {
    dispatch({ type: 'LOADING' });
    connection
      .query(queryData)
      .then(data => dispatch({ type: 'SUCCESS', payload: data }))
      .catch(error => dispatch({ type: 'ERROR', payload: error }));
  };

  // Refetch queries - avoid getting from cache
  const refetchCallback = useCallback(() => {
    state.data
      ? dispatch({ type: 'REVALIDATING' })
      : dispatch({ type: 'LOADING' });
    connection
      .query(queryData, true)
      .then(data => dispatch({ type: 'SUCCESS', payload: data }))
      .catch(error => dispatch({ type: 'ERROR', payload: error }));
  }, [state.data, queryHash]);

  useEffect(() => {
    fetchQuery();
  }, [queryHash]);

  useEffect(() => {
    refetchCallbacks.set(queryData.collection, refetchCallback);
    return () => {
      refetchCallbacks.delete(queryData.collection, refetchCallback);
    };
  }, [refetchCallback]);

  return { ...state, refetch: fetchQuery };
}
