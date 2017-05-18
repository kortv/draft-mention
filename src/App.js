import React, { Component } from 'react';
import './RichEditor.css';
import _ from 'lodash';
import RichEditor from './RichEditor';
import 'draft-js-mention-plugin/lib/plugin.css'

const users = [
  {name: 'Adam', value: 'adam'},
  {name: 'bdam', value: 'bdam'},
  {name: 'cdam', value: 'cdam'},
  {name: 'ddam', value: 'ddam'},
  {name: 'vdam', value: 'vdam'},
  {name: 'zdam', value: 'zdam'},
  // {name: 'Бадам', value: 'Бадам'},
  // {name: 'Гадам', value: 'Гадам'},
  // {name: 'Вадам', value: 'Вадам'},
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: {},
      settings: {},
      assets: {},
    }
  }

  
  render() {
    return (
      <div className="App">
        <RichEditor users={users} />
      </div>
    );
  }
}

export default App;
