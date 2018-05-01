import PropTypes from 'prop-types';
import React from 'react';
import c from 'classnames';
import { Icon } from 'UI';

const CollectionTop = ({
  collectionLabel,
  collectionLabelSingular,
  collectionDescription,
  isListView,
  isGridView,
  toListView,
  toGridView,
  newEntryUrl,
  Link,
}) => {
  return (
    <div className="nc-collectionPage-top">
      <div className="nc-collectionPage-top-row">
        <h1 className="nc-collectionPage-topHeading">{collectionLabel}</h1>
        {
          newEntryUrl
            ? <Link className="nc-collectionPage-topNewButton" to={newEntryUrl}>
                {`New ${collectionLabelSingular || collectionLabel}`}
              </Link>
            : null
        }
      </div>
      {
        collectionDescription
          ? <p className="nc-collectionPage-top-description">{collectionDescription}</p>
          : null
      }
      <div className={c('nc-collectionPage-top-viewControls', {
        'nc-collectionPage-top-viewControls-noDescription': !collectionDescription,
      })}>
        <span className="nc-collectionPage-top-viewControls-text">View as:</span>
        <button
          className={c('nc-collectionPage-top-viewControls-button', {
            'nc-collectionPage-top-viewControls-buttonActive': isListView(),
          })}
          onClick={() => toListView()}
        >
          <Icon type="list"/>
        </button>
        <button
          className={c('nc-collectionPage-top-viewControls-button', {
            'nc-collectionPage-top-viewControls-buttonActive': isGridView(),
          })}
          onClick={() => toGridView()}
        >
          <Icon type="grid"/>
        </button>
      </div>
    </div>
  );
};

CollectionTop.propTypes = {
  collectionLabel: PropTypes.string.isRequired,
  collectionDescription: PropTypes.string,
  newEntryUrl: PropTypes.string,
  isListView: PropTypes.func.isRequired,
  isGridView: PropTypes.func.isRequired,
  toListView: PropTypes.func.isRequired,
  toGridView: PropTypes.func.isRequired,
  Link: PropTypes.func.isRequired,
};

export default CollectionTop;
