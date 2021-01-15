import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cacheDB } from './dbConfig';
import { Connection, RuntimeBinding } from '@usedb/core';
import { Test } from './src/components/Test';
import { Provider } from '@usedb/react';

const connection = new Connection({ bind: new RuntimeBinding(), db: cacheDB });

const App = () => {
  return (
    <Provider connection={connection}>
      <Test />
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
