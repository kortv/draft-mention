import React from 'react';
import _ from 'lodash';
import {
  EditorState, RichUtils, convertToRaw, Modifier, Entity,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

import Editor from 'draft-js-plugins-editor';
import { fromJS } from 'immutable';

import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import createMentionPlugin, {defaultSuggestionsFilter} from 'draft-js-mention-plugin';
/*eslint react/no-string-refs:0*/

// const {
//   mentionPrefix = "",
//   theme = defaultTheme,
//   positionSuggestions = defaultPositionSuggestions,
//   mentionComponent,
//   entityMutability = "SEGMENTED",
//   mentionTrigger = "@",
//   mentionRegExp = defaultRegExp
// } = config;


const mentionPlugin = createMentionPlugin({
  mentionPrefix: '@',
  entityMutability: 'IMMUTABLE',
  mentionTrigger: '@',
  mentionRegExp: '[\\w\u4e00-\u9eff\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7A3\u3130-\u318FА-Яа-я]*'
});

const hashPlugin = createMentionPlugin({
  mentionPrefix: '<>',
  entityMutability: 'IMMUTABLE',
  mentionTrigger: '<>',
  mentionRegExp: '[\\w\u4e00-\u9eff\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7A3\u3130-\u318FА-Яа-я]*'
});

const { MentionSuggestions } = mentionPlugin;
const HashSuggestions = hashPlugin.MentionSuggestions;
const plugins = [mentionPlugin, hashPlugin];
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
  case 'blockquote': return 'RichEditor-blockquote';
  default: return null;
  }
}

export default class RichEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState:
        props.content ? EditorState.createWithContent(stateFromHTML(props.content))
        : EditorState.createEmpty(),
      suggestions: fromJS(props.users),
    };

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.noUpdate && nextProps.content != this.props.content) {
      console.log(nextProps.content);
      console.log(stateFromHTML(nextProps.content));
      this.setState({
        editorState:
          EditorState.push(this.state.editorState,
            stateFromHTML(nextProps.content)),
        suggestions: fromJS(nextProps.users),
      }, () => {
        const currentContent = this.state.editorState.getCurrentContent()
        this.props.setDraftRow(
          convertToRaw(currentContent).entityMap,
          stateToHTML(currentContent)
        )
      });
    } else if (nextProps.resetDraft && !this.props.resetDraft) {
      console.log(nextProps.resetDraft);
      this.setState({
        editorState: EditorState.createEmpty(),
      }, () => {
        const currentContent = this.state.editorState.getCurrentContent()
        this.props.setDraftRow(
          convertToRaw(currentContent).entityMap,
          stateToHTML(currentContent)
        )
      });
    }
  }

  onChange = (editorState) => {
    if (this.props.setDraftRow) {
      this.props.setDraftRow(
        convertToRaw(editorState.getCurrentContent()).entityMap,
        stateToHTML(editorState.getCurrentContent())
      );
    }
    this.setState({
      editorState,
    });
  };

  onSearchChange = ({ value }) => {
    console.log(value, this.props.users);
    const users = [{ value, name: value }, ...this.props.users]
    this.setState({
      // suggestions: fromJS(this.props.users.filter((obj) => {
      //   const regExp = new RegExp(value)
      //   return regExp.test(obj.name)
      // })),
      suggestions: defaultSuggestionsFilter(value, fromJS(users), 99),
    });
  };

  onRelationSearch = ({ value }) => {
    console.log(value, this.props.users);
    const val = value.slice(1)
    const users = [{ value: val, name: val }, ...this.props.users]
    this.setState({
      suggestions: fromJS(this.props.users.filter((obj) => {
        const regExp = new RegExp(val)
        return regExp.test(obj.name)
      })),
    });
  };

  focus = () => {
    this.refs.editor.focus();
  };

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  _onVariableClick = (e, variable) => {
    e.preventDefault();

    const { editorState } = this.state
    const { isValuedTemplate } = this.props

    if (isValuedTemplate && variable.id === 'JOB_LINK') {
      const { value } = variable;
      const link = value.match(/href="(.*)">(.*)<\//)

      const editor = EditorState.push(
        editorState,
        Modifier.insertText(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          link[2],
          null,
          Entity.create(
            'LINK',
            'MUTABLE',
            { url: link[1], target: '_blank' }
          ),
        ),
        ' '
      );
      this.setState({
        editorState: editor,
      }, this.focus);
    } else {
      this.setState({
        editorState:
        EditorState.push(
          editorState,
          Modifier.insertText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            !isValuedTemplate ? `%${variable.id}%` : variable.value,
          )
        ),
      }, this.focus);
    }
  }

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    const templatesVarsList = _.get(this.props, 'templatesVars', []).map((obj) => (
      this.props.isValuedTemplate ? (
        <div key={obj.id}>
          <a
            className='RichEditor_varsLink'
            onClick={(e) => {
              this._onVariableClick(e, obj)
            }}
          >
            {(obj.id === 'JOB_LINK' || !obj.value) ? obj.id : obj.value}
          </a> - {obj.name}
        </div>
      ) : (
        <div key={obj.id}>
          <a
            className='RichEditor_varsLink'
            onClick={(e) => {
              this._onVariableClick(e, obj)
            }}
          >
            %{obj.id}%
          </a> - {obj.name}
        </div>
      )
    ))

    return (
      <div className='RichEditor-root'>
        <div className={className} onClick={this.focus}>
          <Editor
            // placeholder={
            //   _.get(this.props, 'users.length', false)
            //   && 'Используйте @ для того, чтобы упомянуть коллегу'
            // }
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref='editor'
            spellCheck
            plugins={plugins}
          />
          <MentionSuggestions
            callbacks={(val) => { console.log(val) }}
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
          />

          <HashSuggestions
            callbacks={(val) => { console.log(val) }}
            onSearchChange={this.onRelationSearch}
            suggestions={this.state.suggestions}
          />
        </div>
        {this.props.templatesVars && <hr />}
        {templatesVarsList}
      </div>
    );
  }
}

RichEditor.propTypes = {
  users: React.PropTypes.array,
  content: React.PropTypes.string,
};

RichEditor.defaultProps = {
  users: [],
  content: '',
};