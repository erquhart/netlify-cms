export default function compile(template, data) {
  return window.goTemplateParser.compile(data, template);
}
