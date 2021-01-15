import { useEffect, useContext, useReducer } from 'react';
import { Connection, QueryData } from '@usedb/core';
import { UseDBReactContext } from '../context';
import { refetchCallbacks } from '../utils';
import { fetchReducer } from './reducers';

type UseDBMap = Map<string, Array<Function>>;

export function useQuery(queryData: QueryData) {
  const {
    connection,
  }: {
    connection: Connection;
    useDBMap: UseDBMap;
  } = useContext(UseDBReactContext);

  const [state, dispatch] = useReducer(fetchReducer, {
    status: 'idle',
    data: undefined,
    error: undefined,
  });

  const fetchQuery = () => {
    connection
      .query(queryData)
      .then((data) => dispatch({ type: 'SUCCESS', payload: data }))
      .catch((error) => dispatch({ type: 'ERROR', payload: error }));
  };

  useEffect(() => {
    fetchQuery();
    refetchCallbacks.set(queryData.collection, fetchQuery);
    return () => {
      refetchCallbacks.delete(queryData.collection, fetchQuery);
    };
  }, []);

  return { ...state, refetch: fetchQuery };
}
