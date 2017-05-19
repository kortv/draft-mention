import React from 'react';
import "draft-js-mention-plugin/lib/plugin.css";
import { EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { fromJS } from 'immutable';
import createMentionPlugin, {defaultSuggestionsFilter} from 'draft-js-mention-plugin';
import './Editor.css';

const entryComponent = (prefix) => (props) => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <span className={theme.mentionSuggestionsEntryText}>{prefix}{mention.get('name')}</span>
    </div>
  );
};

export default class MentionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: fromJS(props.persons || []),
      hashSuggestions: fromJS(props.hashes || []),
      relationSuggestions: fromJS(props.relations || []),
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
    const hashes = [{ name: value }, ...this.props.hashes]
    this.setState({
      hashSuggestions: defaultSuggestionsFilter(value, fromJS(hashes), 99),
    });
  };

  onPersonSearch = ({ value }) => {
    const persons = [{ name: value }, ...this.props.persons];
    this.setState({
      suggestions: defaultSuggestionsFilter(value, fromJS(persons), 99),
    });
  };

  onRelationSearch = ({ value }) => {
    const cuttedValue = value.slice(1)
    const relations = [{ name: cuttedValue }, ...this.props.relations];
    this.setState({
      relationSuggestions: defaultSuggestionsFilter(cuttedValue, fromJS(relations), 99),
    });
  };

  focus = () => {
    this.editor.focus();
  };

  handleKeyCommand = (command) => {
    console.log(command)
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
            onSearchChange={this.onPersonSearch}
            suggestions={this.state.suggestions}
            entryComponent={entryComponent('@')}
          />
          <HashSuggestions
            callbacks={(val) => { console.log(val) }}
            onSearchChange={this.onHashSearch}
            suggestions={this.state.hashSuggestions}
            entryComponent={entryComponent('#')}
          />
          <RelationSuggestions
            callbacks={(val) => { console.log(val) }}
            onSearchChange={this.onRelationSearch}
            suggestions={this.state.relationSuggestions}
            entryComponent={entryComponent('<>')}
          />
        </div>
      </div>
    );
  }
}
