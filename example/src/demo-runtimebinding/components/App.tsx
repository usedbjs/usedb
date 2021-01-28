import * as React from 'react';
import { Connection, RuntimeBinding } from '@usedb/core';
import { Provider } from '@usedb/react';
import { db } from '../models';
import { CreatePost, PostList, PostListCursor } from './Post';
import { ServerBinding } from '../server-binding';

const connection = new Connection({ bind: new RuntimeBinding(), db });

export const App = () => {
  return (
    <Provider connection={connection}>
      <CreatePost />
      <PostList />
      {/* <PostListCursor /> */}
    </Provider>
  );
};
