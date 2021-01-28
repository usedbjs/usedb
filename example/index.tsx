import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App as Demo2App } from './src/demo2/components/App';

const App = () => {
  return <Demo2App />;
};

ReactDOM.render(<App />, document.getElementById('root'));
