import { isEqual, isNumber } from 'lodash';
import Joi from 'joi-browser';
import listify from 'listify';
import { formatExtensions, frontmatterFormats, extensionFormatters } from 'Formats/formats';

const fieldSchema = Joi.object().label('field').keys({
  name: Joi.string(),
  label: Joi.string(),
  widget: Joi.string(),
  required: Joi.boolean(),
}).requiredKeys([
  'name',
]);

const identifierFieldSchema = fieldSchema.concat(Joi.object().label('identifier_field').keys({
  name: Joi.string().valid(IDENTIFIER_FIELDS),
}));


const collectionSchema = Joi.object().label('collection').keys({
  name: Joi.string(),
  label: Joi.string(),
  folder: Joi.string(),
  file: Joi.string(),
  fields: Joi.array().items(identifierFieldSchema.required(), fieldSchema),
}).requiredKeys([
  'name',
  'label',
  'fields',
]).xor([
  'folder',
  'file',
]);

const schema = Joi.object().keys({
  backend: Joi.object().keys({
    name: Joi.string(),
  }),
  media_folder: Joi.string(),
  media_library: Joi.object().keys({
    name: Joi.string(),
  }),
  collections: Joi.array().items(collectionSchema.required()),
}).requiredKeys([
  '',
  'backend',
  'backend.name',
  'media_library.name',
  'collections',
]).or([
  'media_folder',
  'media_library',
]);

function compoundSubject(subjects, useOr) {
  const quotedSubjects = subjects.map(subject => `'${subject}'`);
  return listify(quotedSubjects, { finalWord: useOr ? 'or' : 'and' });
}

function fromPath(path = []) {
  return path.map((segment, idx) => {
    if (idx === 0) {
      return segment;
    } else if (isNumber(segment)) {
      return `[${segment}]`;
    }
    return `.${segment}`;
  }).join('');
}

function errorMessage({ type, path, message, context, _object: value }) {
  const { peers, knownMisses } = context;
  switch(type) {
    case 'any.required': return `${fromPath(path)} is required`;
      //case 'any.allowOnly': return 
    case 'string.base': return `${fromPath(path)} must be a string`;
    case 'object.base': {
      return `${fromPath(path)} must be an object`;
    }
    case 'array.base': return `${fromPath(path)} must be an array`;
    case 'array.includesRequiredKnowns':
        /*
      if (context.knownMisses.includes('identifier_field') {
        return `
        */
      return `${fromPath(path)} cannot be empty`;
    case 'object.missing':
      return `${fromPath(path)} must have ${compoundSubject(peers, true)} defined`;
    case 'object.xor':
      return `${fromPath(path)} cannot have both ${compoundSubject(peers)} defined`;
    default: return message;
  }
}

export function validateConfig(config) {
  const { error } = Joi.validate(config, schema, { allowUnknown: true, abortEarly: false });
  if (error) {
    console.log(JSON.stringify(error, null, 2));
    const message = error.details.map(errorMessage).join('/n');
    throw Error(message);
  }
}
