import React from 'react';
import StyleButton from './StyleButton';

const bold = <svg><use xlinkHref='#format-bold' /></svg>
const italic = <svg><use xlinkHref='#format-italic' /></svg>
const underline = <svg><use xlinkHref='#format-underline' /></svg>
const INLINE_STYLES = [
  { label: bold, style: 'BOLD' },
  { label: italic, style: 'ITALIC' },
  { label: underline, style: 'UNDERLINE' },
  // { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className='RichEditor-controls'>
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          />
      )}
    </div>
  );
};

export default InlineStyleControls
