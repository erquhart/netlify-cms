import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map, List } from 'immutable';
import EditorControl from './EditorControl';

export default class ControlPane extends React.Component {
  componentValidate = {};

  processControlRef = (fieldName, wrappedControl) => {
    if (!wrappedControl) return;
    this.componentValidate[fieldName] = wrappedControl.validate;
  };

  validate = () => {
    this.props.fields.forEach((field) => {
      if (field.get('widget') === 'hidden') return;
      this.componentValidate[field.get("name")]();
    });
  };

  renderWidget = (field, value, onChange) => {
    const {
      fieldsMetaData,
      fieldsErrors,
      mediaPaths,
      getAsset,
      onOpenMediaLibrary,
      onAddAsset,
      onRemoveInsertedMedia,
      onValidate,
      processControlRef,
    } = this.props;

    const fields = field.get('fields');

    /**
     * In case the `onChangeObject` function is frozen by a child widget implementation,
     * e.g. when debounced, always get the latest object value instead of using
     * `this.props.value` directly.
     */
    const getObjectValue = () => value || Map();

    /**
     * Change handler for fields that are nested within another field.
     */
    const onChangeObject = (fieldName, newValue, newMetadata) => {
      const newObjectValue = getObjectValue().set(fieldName, newValue);
      return onChange(field.get('name'), newObjectValue, newMetadata);
    };

    return (
      <EditorControl
        field={field}
        value={value}
        fieldsMetaData={fieldsMetaData}
        fieldsErrors={fieldsErrors}
        mediaPaths={mediaPaths}
        getAsset={getAsset}
        onChange={(newValue, newMetadata) => onChange(field.get('name'), newValue, newMetadata)}
        onOpenMediaLibrary={onOpenMediaLibrary}
        onAddAsset={onAddAsset}
        onRemoveInsertedMedia={onRemoveInsertedMedia}
        onValidate={onValidate}
        processControlRef={this.processControlRef}
      >
        {!fields ? null : this.renderChildren(fields, value, onChangeObject)}
      </EditorControl>
    );
  };

  renderChildren = (fields, value, onChange) => {
    if (List.isList(value)) {
      return value.map(v => this.renderChildren(fields, v, onChange));
    }
    if (Map.isMap(value)) {
      return fields.map(f => this.renderWidget(f, value.get(f.get('name')), onChange));
    }
    return fields.map(f => this.renderWidget(f, value, onChange));
  };

  render() {
    const { collection, fields, entry, onChange } = this.props;

    if (!collection || !fields || entry.size === 0 || entry.get('partial') === true) {
      return null;
    }

    return (
      <div className="nc-controlPane-root">
        {fields.map(field => field.get('widget') === 'hidden' ? null :
          this.renderWidget(field, entry.getIn(['data', field.get('name')]), onChange)
        )}
      </div>
    );
  }
}

ControlPane.propTypes = {
  collection: ImmutablePropTypes.map.isRequired,
  entry: ImmutablePropTypes.map.isRequired,
  fields: ImmutablePropTypes.list.isRequired,
  fieldsMetaData: ImmutablePropTypes.map.isRequired,
  fieldsErrors: ImmutablePropTypes.map.isRequired,
  mediaPaths: ImmutablePropTypes.map.isRequired,
  getAsset: PropTypes.func.isRequired,
  onOpenMediaLibrary: PropTypes.func.isRequired,
  onAddAsset: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onRemoveInsertedMedia: PropTypes.func.isRequired,
};
