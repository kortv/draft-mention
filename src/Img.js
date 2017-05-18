import React from 'react';

const Img = ({
  text,
  position,
  size,
  image: {masterAssetId},
  assets
}) => {
  const style = {
    left: `${position.left}%`,
    top: `${position.top}%`,
    ...size,
    ...text.style,
  }
  return masterAssetId ? <img style={style} src={assets[masterAssetId]} alt=""/> : null
}

Img.defaultProps = {
  text: {},
  position: {},
  size: {},
  image: {},
  assets: {}
};

export default Img
