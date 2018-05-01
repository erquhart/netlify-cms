import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { getNewEntryUrl } from 'Lib/urlHelper';
import { searchCollections } from 'Actions/collections';
import EntriesCollection from './Entries/EntriesCollection';
import EntriesSearch from './Entries/EntriesSearch';
import { VIEW_STYLE_LIST, VIEW_STYLE_GRID } from 'Constants/collectionViews';
import { ThemeCollectionTop, ThemeSidebar } from 'Theme';

class Collection extends React.Component {
  static propTypes = {
    collection: ImmutablePropTypes.map.isRequired,
    collections: ImmutablePropTypes.orderedMap.isRequired,
  };

  state = {
    viewStyle: VIEW_STYLE_LIST,
  };

  renderEntriesCollection = () => {
    const { name, collection } = this.props;
    return <EntriesCollection collection={collection} name={name} viewStyle={this.state.viewStyle}/>
  };

  renderEntriesSearch = () => {
    const { searchTerm, collections } = this.props;
    return <EntriesSearch collections={collections} searchTerm={searchTerm} />
  };

  handleChangeViewStyle = (viewStyle) => {
    if (this.state.viewStyle !== viewStyle) {
      this.setState({ viewStyle });
    }
  }

  render() {
    const { collection, collections, collectionName, isSearchResults, searchTerm } = this.props;
    const newEntryUrl = collection.get('create') ? getNewEntryUrl(collectionName) : '';
    return (
      <ThemeCollection
        collection={collection}
        collection={collections}
        isSearchResults={isSearchResults}
        searchTerm={searchTerm}
        searchCollections={searchCollections}
        Link={Link}
        NavLink={NavLink}
        newEntryUrl={newEntryUrl}
        isListView={() => this.state.viewStyle === VIEW_STYLE_LIST}
        isGridView={() => this.state.viewStyle === VIEW_STYLE_GRID}
        toListView={() => this.handleChangeViewStyle(VIEW_STYLE_LIST)}
        toGridView={() => this.handleChangeViewStyle(VIEW_STYLE_GRID)}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { collections } = state;
  const { isSearchResults, match } = ownProps;
  const { name, searchTerm } = match.params;
  const collection = name ? collections.get(name) : collections.first();
  return { collection, collections, collectionName: name, isSearchResults, searchTerm };
}

export default connect(mapStateToProps)(Collection);
