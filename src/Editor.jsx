import React from 'react';
import "draft-js-mention-plugin/lib/plugin.css";
import { EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { fromJS } from 'immutable';
import createMentionPlugin, {defaultSuggestionsFilter} from 'draft-js-mention-plugin';
import './Editor.css';

export default class MentionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: fromJS(props.data || []),
    };
    this.mentionPlugin = createMentionPlugin({
      mentionPrefix: '@',
      entityMutability: 'IMMUTABLE',
      mentionTrigger: '@',
    })

    this.hashPlugin = createMentionPlugin({
      mentionPrefix: '#',
      entityMutability: 'IMMUTABLE',
      mentionTrigger: '#',
    });

    this.relationPlugin = createMentionPlugin({
      mentionPrefix: '<>',
      entityMutability: 'IMMUTABLE',
      mentionTrigger: '<>',
    });
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onHashSearch = ({ value }) => {
    console.log(value, this.props.data);
    const data = [{ value, name: value }, ...this.props.data]
    this.setState({
      suggestions: defaultSuggestionsFilter(value, fromJS(data), 99),
    });
  };

  onMentionChange = ({ value }) => {
    console.log(value, this.props.data);
    this.setState({
      suggestions: defaultSuggestionsFilter(value, fromJS(this.props.data), 99),
    });
  };

  onRelationSearch = ({ value }) => {
    console.log(value, this.props.data);
    const val = value.slice(1)
    this.setState({
      suggestions: fromJS(this.props.data.filter((obj) => {
        const regExp = new RegExp(val)
        return regExp.test(obj.name)
      })),
    });
  };

  focus = () => {
    this.editor.focus();
  };

  handleKeyCommand = (command) => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const HashSuggestions = this.hashPlugin.MentionSuggestions;
    const RelationSuggestions = this.relationPlugin.MentionSuggestions;
    const plugins = [this.mentionPlugin, this.hashPlugin, this.relationPlugin];

    const { editorState } = this.state;
    const { readOnly } = this.props

    return (
      <div className='root'>
        <div onClick={this.focus}>
          <Editor
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref={(e) => { this.editor = e}}
            spellCheck
            plugins={plugins}
          />
          <MentionSuggestions
            callbacks={(val) => { console.log(val) }}
            onSearchChange={this.onMentionChange}
            suggestions={this.state.suggestions}
          />
          <HashSuggestions
            callbacks={(val) => { console.log(val) }}
            onSearchChange={this.onHashSearch}
            suggestions={this.state.suggestions}
          />
          <RelationSuggestions
            callbacks={(val) => { console.log(val) }}
            onSearchChange={this.onRelationSearch}
            suggestions={this.state.suggestions}
          />
        </div>
      </div>
    );
  }
}
