import { useContext, useReducer } from 'react';
import { Connection, QueryData } from '@usedb/core';
import { UseDBReactContext } from '../context';
import { refetchCallbacks } from '../utils';
import { fetchReducer } from './reducers';

export function useMutation() {
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

  const mutate = (queryData: QueryData) => {
    connection
      .query(queryData)
      .then((data) => dispatch({ type: 'SUCCESS', payload: data }))
      .catch((error) => dispatch({ type: 'ERROR', payload: error }));
  };

  const refetch = (collectionName: string) => {
    const callbacks = refetchCallbacks.get(collectionName);
    callbacks.forEach((callback: any) => callback());
  };

  return { ...state, mutate, refetch };
}
