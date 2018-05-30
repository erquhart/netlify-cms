import React from 'react';
import { isString } from 'lodash';
import {
  registerPreviewTemplateCompiler,
  getPreviewTemplateCompiler,
  getPreviewTemplate
} from 'Lib/registry';
import templateCompilerHandlebars from 'Extensions/template-compilers/template-compiler-handlebars';
import HtmlToReactParser from 'html-to-react';

const htmlToReactParser = new HtmlToReactParser.Parser;
const DEFAULT_COMPILER_NAME = 'handlebars';

registerPreviewTemplateCompiler('handlebars', templateCompilerHandlebars);

export const createTemplateCompiler = name => {
  const previewTemplate = getPreviewTemplate(name);

  if (!previewTemplate) {
    return;
  }

  const { template, compilerConfig = {}, compilerName } = previewTemplate;

  /**
   * Determining which compiler to use, in order of precedence:
   *
   * 1. Compiler named during template registration.
   * 2. Whatever compiler is registered, as long as there's only one.
   * 3. Default compiler if the raw template is a string.
   * 4. React.createElement if the raw template is not a string.
   *
   * Note that 1 & 2 are handled by the initial `getPreviewTemplateCompiler`
   * call, which will return the named compiler, or else the only registered
   * compiler, or else `undefined`.
   */
  const compilerFn = getPreviewTemplateCompiler(compilerName)
    || (isString(template) && getPreviewTemplateCompiler(DEFAULT_COMPILER_NAME))
    || React.createElement;

  const compile = context => {
    const compiledTemplate = compilerFn(name, template, context, compilerConfig);

    /**
     * If a the compiler returns a string, assume HTML and parse into a React
     * component. Otherwise assume the return value is a React component.
     */
    return isString(compiledTemplate) ? htmlToReactParser.parse(compiledTemplate) : compiledTemplate;
  }

  return compile;
}
