import * as React from 'react';
import { QueryData, Connection, Query } from '@usedb/core';
import { UseDBReactContext } from '../context';
import { useContext } from 'react';

export function useDBv2(queryData?: QueryData) {
  const {
    connection,
  }: {
    connection: Connection;
  } = useContext(UseDBReactContext);

  const [query, setQuery] = React.useState(() => {
    if (!queryData) return undefined;
    return new Query(connection, queryData);
  });

  const setQueryHelper = React.useCallback((newQuery: QueryData) => {
    setQuery(new Query(connection, newQuery));
  }, []);

  // if new query or variables are passed in, refetch!
  React.useEffect(() => {
    if (!queryData) return;
    setQueryHelper(queryData);
  }, [queryData && queryData.queryKey]);

  return {
    status: query ? query.status : 'idle',
    error: query ? query.error : undefined,
    data: query ? query.data : undefined,
    query,
    setQuery: setQueryHelper,
  };
}
