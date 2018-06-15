import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
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

  /**
   * In case the `onChangeObject` function is frozen by a child widget implementation,
   * e.g. when debounced, always get the latest object value instead of using
   * `this.props.value` directly.
   */
  getObjectValue = () => this.props.value || Map();

  /**
   * Change handler for fields that are nested within another field.
   */
  onChangeObject = (fieldName, newValue, newMetadata) => {
    const newObjectValue = this.getObjectValue().set(fieldName, newValue);
    return this.props.onChange(newObjectValue, newMetadata);
  };

  renderWidget = (field, value) => {
    const {
      fieldsMetaData,
      fieldsErrors,
      mediaPaths,
      getAsset,
      onChange,
      onOpenMediaLibrary,
      onAddAsset,
      onRemoveInsertedMedia,
      onValidate,
      processControlRef,
    } = this.props;

    const fields = field.get('fields');
    const values = value || Map();

    return (
      <EditorControl
        field={field}
        value={value}
        fieldsMetaData={fieldsMetaData}
        fieldsErrors={fieldsErrors}
        mediaPaths={mediaPaths}
        getAsset={getAsset}
        onChange={!fields ? onChange : this.onChangeObject}
        onOpenMediaLibrary={onOpenMediaLibrary}
        onAddAsset={onAddAsset}
        onRemoveInsertedMedia={onRemoveInsertedMedia}
        onValidate={onValidate}
        processControlRef={this.processControlRef}
      >
        {!fields ? null : fields.map(f => this.renderWidget(f, values.get(f.get('name'))))}
      </EditorControl>
    );
  };


  render() {
    const { collection, fields, entry } = this.props;

    if (!collection || !fields || entry.size === 0 || entry.get('partial') === true) {
      return null;
    }

    return (
      <div className="nc-controlPane-root">
        {fields.map(field => field.get('widget') === 'hidden' ? null :
          this.renderWidget(field, entry.getIn(['data', field.get('name')]))
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
