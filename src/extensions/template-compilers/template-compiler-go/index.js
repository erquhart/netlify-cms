import { goTemplateParser } from 'netlify-cms-template-parser-go';

export default function compile(template, data) {
  return goTemplateParser.compile(data, template);
}
