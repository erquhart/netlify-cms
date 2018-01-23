import ReactDOMServer from 'react-dom/server';
import HtmlToReactParser from 'html-to-react';
import Handlebars from 'handlebars/dist/handlebars';

const htmlToReactParser = new HtmlToReactParser.Parser;

/*
export default class Handlebars {
  compile() {
    const html = Handlebars.compile(template)(data.entry.get('data').toJS());
    return htmlToReactParser.parse(html);
  }
};
*/

const parser = {
  init(template, data) {
    Handlebars.registerHelper('getAsset', image => {
      const assetProxy = getAsset(image);
      return assetProxy ? assetProxy.toString() : null;
    });
    Handlebars.registerHelper('widgetFor', fieldName => {
      const output = data.widgetFor(fieldName);
      const finalOutput = ReactDOMServer.renderToStaticMarkup(output)
      return new Handlebars.SafeString(finalOutput);
    });
    Handlebars.registerHelper('widgetsFor', data.widgetsFor);

    return function parse(template, data) {
      const html = Handlebars.compile(template)(data.entry.get('data').toJS());
      const component = htmlToReactParser.parse(html);
      return component;
    }
  }
}

export default parser;
