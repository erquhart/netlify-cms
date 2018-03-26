import { goTemplateParser } from 'netlify-cms-template-parser-go';

const templateCache = {}

export default function compile(templateName, template, data, { transformTemplate, transformData }) {
  let cachedTemplate = templateCache[templateName];

  if (!cachedTemplate) {
    cachedTemplate = templateCache[templateName] = transformTemplate(template)
  }

  const transformedData = transformData(data);
  return goTemplateParser.compile(transformedData, cachedTemplate);
}
