import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App as DemoRuntimeBinding } from './src/demo-runtimebinding/components/App';

const App = () => {
  return <DemoRuntimeBinding />;
};

ReactDOM.render(<App />, document.getElementById('root'));
