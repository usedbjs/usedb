import { useContext, useReducer } from 'react';
import { Connection, QueryData } from '@usedb/core';
import { UseDBReactContext } from '../context';
import { fetchReducer } from './reducers';
// import { refetchQueries } from '../utils';
//Todo : onSuccess, onError callbacks?
// type ICallback= ({ refetch }: { refetch: () => any }) => any;

type IPromiseResolve = {
  data: any;
  refetch: any;
};

export function useDBMutation() {
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
    return new Promise<IPromiseResolve>((resolve, reject) => {
      dispatch({ type: 'LOADING' });
      connection
        .query(queryData)
        .then(data => {
          dispatch({ type: 'SUCCESS', payload: data });
          resolve(data);
        })
        .catch(error => {
          dispatch({ type: 'ERROR', payload: error });
          reject(error);
        });
    });
  };

  return { ...state, mutate };
}
