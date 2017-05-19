import React from 'react';
import Editor from './Editor';

const persons = [
  {name: 'aName'},
  {name: 'bName'},
  {name: 'cName'},
  {name: 'dName'},
  {name: 'vName'},
  {name: 'zName'},
]
const hashes = [
  {name: 'aHash'},
  {name: 'bHash'},
  {name: 'cHash'},
  {name: 'dHash'},
  {name: 'vHash'},
  {name: 'zHash'},
]
const relations = [
  {name: 'aRelation'},
  {name: 'bRelation'},
  {name: 'cRelation'},
  {name: 'dRelation'},
  {name: 'vRelation'},
  {name: 'zRelation'},
]

const App = () => (
  <div className="App">
    <Editor persons={persons} hashes={hashes} relations={relations} />
  </div>
);

export default App;
