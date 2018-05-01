import React from 'react';

const EntryCard = ({
  collection,
  entry,
  inferedFields,
  publicFolder,
  collectionLabel,
  isListView,
  isGridView,
}) => {
  const label = entry.get('label');
  const title = label || entry.getIn(['data', inferedFields.titleField]);
  const path = `/collections/${collection.get('name')}/entries/${entry.get('slug')}`;
  let image = entry.getIn(['data', inferedFields.imageField]);
  image = resolvePath(image, publicFolder);
  if(image) {
    image = encodeURI(image);
  }

  if (isListView()) {
    return (
      <ThemeEntryCardList
        Link={Link}
        path={path}
        collectionLabel={collectionLabel}
        title={title}
      />
    );
  }

  if (isGridView()) {
    return (
      <ThemeEntryCardGrid
        Link={Link}
        path={path}
        image={image}
        collectionLabel={collectionLabel}
        title={title}
      />
    );
  }
}

export default EntryCard;
