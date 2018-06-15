import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import { partial } from 'lodash';
import c from 'classnames';
import { resolveWidget } from 'Lib/registry';
import { Icon } from 'UI';

const TopBar = ({ collapsed, onCollapseToggle }) => (
  <div className="nc-objectControl-topBar">
    <div className="nc-objectControl-objectCollapseToggle">
      <button className="nc-listControl-listCollapseToggleButton" onClick={onCollapseToggle}>
        <Icon type="chevron" direction={collapsed ? 'right' : 'down'} size="small" />
      </button>
    </div>
  </div>
);

export default class ObjectControl extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.object,
      PropTypes.bool,
    ]),
    field: PropTypes.object,
    forID: PropTypes.string,
    classNameWrapper: PropTypes.string.isRequired,
    forList: PropTypes.bool,
  };

  static defaultProps = {
    value: Map(),
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  /*
   * Always update so that each nested widget has the option to update. This is
   * required because ControlHOC provides a default `shouldComponentUpdate`
   * which only updates if the value changes, but every widget must be allowed
   * to override this.
   */
  shouldComponentUpdate() {
    return true;
  }

  handleCollapseToggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const { field, forID, classNameWrapper, forList, children } = this.props;
    const { collapsed } = this.state;

    return (
      <div id={forID} className={c(classNameWrapper, 'nc-objectControl-root')}>
        { forList ? null : <TopBar collapsed={collapsed} onCollapseToggle={this.handleCollapseToggle} /> }
        { collapsed ? null : children }
      </div>
    );

    return <h3>No field(s) defined for this widget</h3>;
  }
}
