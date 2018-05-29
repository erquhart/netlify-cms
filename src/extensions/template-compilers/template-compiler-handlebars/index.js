import Handlebars from 'handlebars/dist/handlebars';

const templateCache = {};

export default function compile(templateName, template, context, { transformTemplate = t => t, transformContext = c => c }) {
  let cachedTemplateFn = templateCache[templateName];

  if (!cachedTemplateFn) {
    cachedTemplateFn = Handlebars.compile(transformTemplate(template));
  }

  const transformedContext = transformContext(context);
  return cachedTemplateFn(transformedContext);
};
