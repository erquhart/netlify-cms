import PropTypes from 'prop-types';
import React from 'react';

export default function ImagePreview({ value, data }) {
  return (<div className='nc-widgetPreview'>
    { value ?
      <img
        src={data.src}
        className='nc-imageWidget-image'
        role="presentation"
      />
      : null}
  </div>);
}

ImagePreview.propTypes = {
  getAsset: PropTypes.func.isRequired,
  value: PropTypes.node,
};
