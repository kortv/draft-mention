import React from 'react';
import Editor from './Editor';
const path = 'https://s3.amazonaws.com/uifaces/faces/twitter/'

const persons = [
  {name: 'aName', avatar: `${path}faulknermusic/128.jpg`},
  {name: 'bName', avatar: `${path}sauro/128.jpg`},
  {name: 'cName', avatar: `${path}zack415/128.jpg`},
  {name: 'dName', avatar: `${path}k/128.jpg`},
  {name: 'eName', avatar: `${path}calebogden/128.jpg`},
  {name: 'zName', avatar: `${path}ashleyford/128.jpg`},
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
