import PropTypes from 'prop-types';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isString } from 'lodash';
import Frame from 'react-frame-component';
import { resolveWidget, getPreviewStyles } from 'Lib/registry';
import { createTemplateCompiler } from 'Extensions/template-compilers';
import { ErrorBoundary } from 'UI';
import { selectTemplateName, selectInferedField } from 'Reducers/collections';
import { INFERABLE_FIELDS } from 'Constants/fieldInference';
import EditorPreviewContent from './EditorPreviewContent.js';
import PreviewHOC from './PreviewHOC';
import EditorPreview from './EditorPreview';

export default class PreviewPane extends React.Component {
  inferedFields = {};

  inferFields() {
    const titleField = selectInferedField(this.props.collection, 'title');
    const shortTitleField = selectInferedField(this.props.collection, 'shortTitle');
    const authorField = selectInferedField(this.props.collection, 'author');

    this.inferedFields = {};
    if (titleField) this.inferedFields[titleField] = INFERABLE_FIELDS.title;
    if (shortTitleField) this.inferedFields[shortTitleField] = INFERABLE_FIELDS.shortTitle;
    if (authorField) this.inferedFields[authorField] = INFERABLE_FIELDS.author;
  }

  getFieldPreview = field => {
    const { entry, fieldsMetaData, getAsset } = this.props;
    const value = entry.getIn(['data', field.get('name')]);
    const widget = resolveWidget(field.get('widget'));
    const data = widget.getData({ value, getAsset });

    return {
      value,
      get data () {
        return data;
      },
      get preview () {
        return ReactDOMServer.renderToStaticMarkup(
          <PreviewHOC previewComponent={widget.preview} value={value} data={data}/>
        );
      },
    };
  };

  render() {
    const { entry, collection, fields } = this.props;

    if (!entry || !entry.get('data')) {
      return null;
    }

    this.inferFields();

    const templateData = {
      entry: {
        fields: fields.toMap().mapKeys((k, v) => v.get('name')).map(this.getFieldPreview).toJS(),
        collection: entry.get('collection'),
      },
    };

    const previewComponent = this.compileTemplate(templateData);

    const styleEls = getPreviewStyles()
      .map((style, i) => {
        if (style.raw) {
          return <style key={i}>{style.value}</style>
        }
        return <link key={i} href={style.value} type="text/css" rel="stylesheet" />;
      });

    if (!collection) {
      return <Frame className="nc-previewPane-frame" head={styleEls} />;
    }

    const initialContent = `
<!DOCTYPE html>
<html>
  <head><base target="_blank"/></head>
  <body><div></div></body>
</html>
`;

    return (
      <ErrorBoundary>
        <Frame className="nc-previewPane-frame" head={styleEls} initialContent={initialContent}>
          <EditorPreviewContent previewComponent={previewComponent}/>
        </Frame>
      </ErrorBoundary>
    );
  }
}

PreviewPane.propTypes = {
  collection: ImmutablePropTypes.map.isRequired,
  fields: ImmutablePropTypes.list.isRequired,
  entry: ImmutablePropTypes.map.isRequired,
  fieldsMetaData: ImmutablePropTypes.map.isRequired,
  getAsset: PropTypes.func.isRequired,
};
