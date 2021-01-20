import * as React from 'react';
import { db } from '@usedb/core';
import { refetchQueries, useDB } from '@usedb/react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

export const Test = function Test() {
  const { status, data } = useDB(
    db.actions({ name: 'HomeFeedActionModel', params: {} })
  );
  console.log('actions ', data);

  return <div>hi</div>;
};
