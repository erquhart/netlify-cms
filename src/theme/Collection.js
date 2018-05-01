import React from 'react';

const ThemeSidebar = getTheme('sidebar');
const ThemeCollectionTop = getTheme('collection_top');
const ThemeEntries = getTheme('entries');
const ThemeEntriesSearch = getTheme('entries_search');

const Collection = ({
  collection,
  isSearchResults,
  searchTerm,
  searchCollections,
  Link,
  NavLink,
  newEntryUrl,
  isListView,
  isGridView,
  toListView,
  toGridView,
}) =>
  <div className="nc-collectionPage-container">
    <ThemeSidebar
      collections={collections}
      searchTerm={searchTerm}
      searchCollections={searchCollections}
      NavLink={NavLink}
    />
    <div className="nc-collectionPage-main">
      {
        isSearchResults
          ? null
          : <ThemeCollectionTop
              collectionLabel={collection.get('label')}
              collectionLabelSingular={collection.get('label_singular')}
              collectionDescription={collection.get('description')}
              newEntryUrl={newEntryUrl}
              isListView={isListView}
              isGridView={isGridView}
              toListView={toListView}
              toGridView={toGridView}
              Link={Link}
            />
      }
      {
        isSearchResults
          ? <ThemeEntriesSearch collections={collections} searchTerm={searchTerm}/>
          : <ThemeEntries collection={collection} name={name} viewStyle={viewStyle}/>
      }
    </div>
  </div>
