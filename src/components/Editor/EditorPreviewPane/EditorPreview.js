import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { map, filter } from 'lodash';

const style = {
  fontFamily: 'Roboto, "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
};

/**
 * Use a stateful component so that child components can effectively utilize
 * `shouldComponentUpdate`.
 */
export default class Preview extends React.Component {
  render() {
    return (
      <div style={style}>
        {map(filter(this.props.entry, ({ config }) => config.widget !== 'hidden'), field => {
          const Tag = field.config.tagname || 'div';
          return <Tag key={field.config.name} dangerouslySetInnerHTML={{ __html: field.preview }}/>
        })}
      </div>
    );
  }
}

Preview.propTypes = {
  collection: PropTypes.object.isRequired,
  entry: PropTypes.object.isRequired,
};
