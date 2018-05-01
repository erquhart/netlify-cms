import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ThemeSidebarLink, ThemeSidebarSearchInput } from 'Theme';

export default class Sidebar extends Component {
  static propTypes = {
    collections: ImmutablePropTypes.orderedMap.isRequired,
    searchTerm: PropTypes.string,
    searchCollections: PropTypes.func.isRequired,
    NavLink: PropTypes.func.isRequired,
  };

  state = { query: this.props.searchTerm || '' };

  render() {
    const { collections, NavLink, searchCollections, } = this.props;
    const { query } = this.state;

    return (
      <div className="nc-collectionPage-sidebar">
        <h1 className="nc-collectionPage-sidebarHeading">Collections</h1>
        <ThemeSidebarSearchInput
          onChange={e => this.setState({ query: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && searchCollections(query)}
          value={query}
        />
        {collections.toList().map(collection =>
          <ThemeSidebarLink
            key={collection.get('name')}
            path={`/collections/${collection.get('name')}`}
            label={collection.get('label')}
            NavLink={NavLink}
          />
        )}
      </div>
    );
  }
}
