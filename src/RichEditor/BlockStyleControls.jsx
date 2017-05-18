import React from 'react';
import StyleButton from './StyleButton';

const h6 = <svg><use xlinkHref='#format-annotation-minus' /></svg>
const h2 = <svg><use xlinkHref='#format-annotation-plus' /></svg>
const ul = <svg><use xlinkHref='#format-ul-list' /></svg>
const ol = <svg><use xlinkHref='#format-ol-list' /></svg>
const BLOCK_TYPES = [
  // { label: 'H1', style: 'header-one' },
  { label: h2, style: 'header-three' },
  // { label: 'H3', style: 'header-three' },
  // { label: 'H4', style: 'header-four' },
  // { label: 'H5', style: 'header-five' },
  { label: h6, style: 'header-five' },
  { label: ul, style: 'unordered-list-item' },
  { label: ol, style: 'ordered-list-item' },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className='RichEditor-controls'>
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          />
      )}
    </div>
  );
};

export default BlockStyleControls;
