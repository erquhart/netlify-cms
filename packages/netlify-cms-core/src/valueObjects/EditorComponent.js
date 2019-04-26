import { fromJS } from 'immutable';
import { isFunction } from 'lodash';

const catchesNothing = /.^/;
const bind = fn => isFunction(fn) && fn.bind(null);

export default function createEditorComponent(config) {
  const {
    id = null,
    label = 'unnamed component',
    icon = 'exclamation-triangle',
    widget = 'object',
    pattern = catchesNothing,
    fields = [],
    fromBlock,
    toBlock,
    toPreview,
    ...remainingConfig
  } = config;

  return {
    id: id || label.replace(/[^A-Z0-9]+/gi, '_'),
    label,
    icon,
    widget,
    pattern,
    fromBlock: bind(fromBlock) || (() => ({})),
    toBlock: bind(toBlock) || (() => 'Plugin'),
    toPreview: bind(toPreview) || bind(toBlock) || (() => 'Plugin'),
    fields: fromJS(fields),
    ...remainingConfig
  };
};
