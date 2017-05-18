import React from 'react';
import Editor from './Editor';

const data = [
  {name: 'adam', value: 'adam'},
  {name: 'bdam', value: 'bdam'},
  {name: 'cdam', value: 'cdam'},
  {name: 'ddam', value: 'ddam'},
  {name: 'vdam', value: 'vdam'},
  {name: 'zdam', value: 'zdam'},
]

const App = () => (
  <div className="App">
    <Editor data={data} />
    <Editor data={data} />
    <Editor data={data} />
  </div>
);

export default App;
