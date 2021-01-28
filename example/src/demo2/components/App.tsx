import * as React from 'react';
import { Connection } from '@usedb/core';
import { Provider } from '@usedb/react';
import { MyBinding } from '../binding';
import { db } from '../models';
import { CreatePost, PostList } from './Post';

const connection = new Connection({ bind: new MyBinding(), db });

export const App = () => {
  return (
    <Provider connection={connection}>
      <CreatePost />
      <PostList />
    </Provider>
  );
};
