import * as React from 'react';
import { Connection, RuntimeBinding } from '@usedb/core';
import { Provider } from '@usedb/react';
import { db } from '../models';
import { CreatePost, PostDetail, PostList, PostListCursor } from './Post';
import { ServerBinding } from '../server-binding';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const connection = new Connection({ bind: new RuntimeBinding(), db });

export const App = () => {
  return (
    <Router>
      <Provider connection={connection}>
        <nav>
          <ul>
            <li>
              <Link to="/">Posts</Link>
            </li>
            <li>
              <Link to="/create">Create Post</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/posts/:id">
            <PostDetail />
          </Route>
          <Route path="/create">
            <CreatePost />
          </Route>
          <Route path="/">
            {/* <PostList /> */}
            <PostListCursor />
          </Route>
        </Switch>
      </Provider>
    </Router>
  );
};
