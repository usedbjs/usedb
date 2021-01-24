import * as React from 'react';
import { QueryData, Connection, Query, QueryOptions } from '@usedb/core';
import { UseDBReactContext } from '../context';
import { useContext } from 'react';
import { refetchCallbacks } from '../refetchCallbacks';

export function useDB(queryData?: QueryData, config?: QueryOptions) {
  const {
    connection,
  }: {
    connection: Connection;
  } = useContext(UseDBReactContext);

  const [query, setQuery] = React.useState<any>();

  const setQueryHelper = React.useCallback(
    (newQuery: QueryData, config?: QueryOptions) => {
      setQuery(new Query(connection, newQuery, config));
    },
    []
  );

  // if new query or variables are passed in, refetch!
  React.useEffect(() => {
    if (!queryData) return;
    setQueryHelper(queryData, config);
    const refetch = () => setQueryHelper(queryData, config);
    refetchCallbacks.set(queryData, refetch);
    return () => {
      refetchCallbacks.delete(queryData, refetch);
    };
  }, [queryData && JSON.stringify(queryData)]);

  return {
    status: query ? query.status : 'idle',
    error: query ? query.error : undefined,
    data: query ? query.data : undefined,
    query,
    setQuery: setQueryHelper,
  };
}
