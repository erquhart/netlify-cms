import { Map } from 'immutable';
import { newEditorPlugin } from 'EditorWidgets/Markdown/MarkdownControl/plugins';

/**
 * Global Registry Object
 */
const registry = {
  backends: { },
  previewTemplates: {},
  previewTemplateCompilers: {},
  previewStyles: [],
  widgets: {},
  editorComponents: Map(),
  widgetValueSerializers: {},
};

export default {
  registerPreviewStyle,
  getPreviewStyles,
  registerPreviewTemplate,
  getPreviewTemplate,
  registerPreviewTemplateCompiler,
  getPreviewTemplateCompiler,
  registerWidget,
  getWidget,
  resolveWidget,
  registerEditorComponent,
  getEditorComponents,
  registerWidgetValueSerializer,
  getWidgetValueSerializer,
  registerBackend,
  getBackend,
};


/**
 * Preview Styles
 *
 * Valid options:
 *  - raw {boolean} if `true`, `style` value is expected to be a CSS string
 */
export function registerPreviewStyle(style, opts) {
  registry.previewStyles.push({ ...opts, value: style });
};
export function getPreviewStyles() {
  return registry.previewStyles;
};


/**
 * Preview Templates
 */
export function registerPreviewTemplate(name, template, compilerConfig, compilerName) {
  registry.previewTemplates[name] = { template, compilerConfig, compilerName };
};
export function getPreviewTemplate(name) {
  return registry.previewTemplates[name];
};


/**
 * Preview Template Compilers
 */
export function registerPreviewTemplateCompiler(name, compiler) {
  if (!name || !compiler) {
    console.error("registerPreviewTemplateCompiler parameters invalid. example: CMS.registerPreviewTemplateCompiler('myCompiler', compiler)");
  } else if (registry.previewTemplateCompilers[name]) {
      console.error(`Preview template compiler [${ name }] already registered. Please choose a different name.`);
  }
  registry.previewTemplateCompilers[name] = compiler;
};

export function getPreviewTemplateCompiler(name) {
  const compilerNames = Object.keys(registry.previewTemplateCompilers);

  /**
   * If the named compiler has not been registered, log an error.
   */
  if (name && !registry.previewTemplateCompilers[name]) {
    console.error(`
Preview template compiler [${name}] not registered.

Registered compilers include:

${compilerNames.join('\n')}
    `);
  }

  /**
   * If no name arg is passed and only one compiler is registered, return it by
   * default.
   */
  else if (!name && Object.keys(registry.previewTemplateCompilers) === 1) {
    return Object.values(registry.previewTemplateCompilers)[0];
  }

  return registry.previewTemplateCompilers[name];
};

/**
 * Editor Widgets
 */
export function registerWidget(name, control, preview) {
  // A registered widget control can be reused by a new widget, allowing
  // multiple copies with different previews.
  const newControl = typeof control === 'string' ? registry.widgets[control].control : control;
  registry.widgets[name] = { control: newControl, preview };
};
export function getWidget(name) {
  return registry.widgets[name];
};
export function resolveWidget(name) {
  return getWidget(name || 'string') || getWidget('unknown');
};


/**
 * Markdown Editor Custom Components
 */
export function registerEditorComponent(component) {
  const plugin = newEditorPlugin(component);
  registry.editorComponents = registry.editorComponents.set(plugin.get('id'), plugin);
};
export function getEditorComponents() {
  return registry.editorComponents;
};


/**
 * Widget Serializers
 */
export function registerWidgetValueSerializer(widgetName, serializer) {
  registry.widgetValueSerializers[widgetName] = serializer;
};
export function getWidgetValueSerializer(widgetName) {
  return registry.widgetValueSerializers[widgetName];
};

/**
 * Backend API
 */
export function registerBackend(name, BackendClass) {
  if (!name || !BackendClass) {
    console.error("Backend parameters invalid. example: CMS.registerBackend('myBackend', BackendClass)");
  } else if (registry.backends[name]) {
      console.error(`Backend [${ name }] already registered. Please choose a different name.`);
  } else {
    registry.backends[name] = {
      init: config => new BackendClass(config),
    };
  }
}

export function getBackend(name) {
  return registry.backends[name];
}

