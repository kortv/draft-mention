import React from "react";

const Text = ({
  text,
  position,
  size,
}) => {
  const style = {
    left: `${position.left}%`,
    top: `${position.top}%`,
    ...size,
    ...text.style,
  }
  return <div style={style}>{text.text || ''}</div>
};

Text.defaultProps = {
  text: {},
  position: {},
  size: {},
};

export default Text;
