import * as React from 'react';
import { db } from '@usedb/core';
import { useDB } from '@usedb/react';

export const usePaginatedQuery = (action: any) => {
  const [data, setData] = React.useState([]);

  const { data: someData, status, ...rest } = useDB(action);

  React.useEffect(() => {
    if (status === 'success') {
      setData([...data, ...someData]);
    }
  }, [someData]);

  let newStatus: any = status;

  if (status === 'loading' && data.length !== 0) {
    newStatus = 'loadingMore';
  }

  return {
    ...rest,
    data,
    status: newStatus,
  };
};
