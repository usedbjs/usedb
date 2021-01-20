import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { db } from './dbConfig';
import { Connection } from '@usedb/core';
import { RuntimeBinding } from './RuntimeBinding';
import { Test } from './src/components/Test';
import { Provider } from '@usedb/react';

const connection = new Connection({ bind: new RuntimeBinding(), db });

const App = () => {
  return (
    <Provider connection={connection}>
      <Test />
      {/* <CustomActions /> */}
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
