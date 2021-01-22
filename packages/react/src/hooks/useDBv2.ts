//@ts-nocheck
import * as React from 'react';
import { QueryData, Connection, getHash, Query } from '@usedb/core';
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

export function useDBv2(queryData?: QueryData) {
  const {
    connection,
  }: {
    connection: Connection;
  } = useContext(UseDBReactContext);

  const [query, setQuery] = React.useState<Query<DATA> | undefined>(() => {
    if (!queryData) return undefined;
    return new Query(connection, queryData, {});
  });

  const setQueryHelper = React.useCallback(
    (newQuery: QueryLike<STORE, DATA>) => {
      setQuery(new Query(connection, newQuery, {}));
    },
    []
  );

  // if new query or variables are passed in, replace the query!
  React.useEffect(() => {
    if (!queryData || typeof queryData === 'function') return; // ignore changes to initializer func
    setQueryHelper(queryData);
  }, [queryData && JSON.stringify(queryData.payload)]); // TODO: use a decent deep equal

  return {
    status: query ? query.status : 'idle',
    error: query ? query.error : undefined,
    data: query ? query.data : undefined,
    query,
    setQuery: setQueryHelper,
  };
}
