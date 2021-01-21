import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { db } from './dbConfig';
import { Connection } from '@usedb/core';
import { RuntimeBinding } from './RuntimeBinding';
import { PostList } from './src/components/PostList';
import { Provider } from '@usedb/react';
import { CreatePost } from './src/components/CreatePost';
import { UpdateProfile } from './src/components/UpdateProfile';

const connection = new Connection({ bind: new RuntimeBinding(), db });

const App = () => {
  return (
    <Provider connection={connection}>
      <UpdateProfile />
      <CreatePost />
      <PostList />
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
