import { validateConfig } from '../configSchema';

describe('config', () => {
  /**
   * Suppress error logging to reduce noise during testing. Jest will still
   * log test failures and associated errors as expected.
   */
  beforeEach(() => {
    jest.spyOn(console, 'error');
  });

  describe('validateConfig', () => {
    describe('backend', () => {
      it('should throw if backend is not defined in config', () => {
        expect(() => {
          validateConfig({});
        }).toThrowErrorMatchingInlineSnapshot(`
"config should have required property 'backend'
config should have required property 'collections'
config should have required property 'media_folder'
config should have required property 'media_library'
config should match some schema in anyOf"
`);
      });

      it('should throw if backend name is not defined in config', () => {
        expect(() => {
          validateConfig({ backend: {} });
        }).toThrowErrorMatchingInlineSnapshot(`
"'backend' should have required property 'name'
config should have required property 'collections'
config should have required property 'media_folder'
config should have required property 'media_library'
config should match some schema in anyOf"
`);
      });

      it('should throw if backend name is not a string in config', () => {
        expect(() => {
          validateConfig({ backend: { name: {} } });
        }).toThrowErrorMatchingInlineSnapshot(`
"'backend.name' should be string
config should have required property 'collections'
config should have required property 'media_folder'
config should have required property 'media_library'
config should match some schema in anyOf"
`);
      });
    });

    describe('media_folder', () => {
      const config = { backend: { name: 'bar' } };
      it('should throw if media_folder is not defined in config', () => {
        expect(() => {
          validateConfig(config);
        }).toThrowErrorMatchingInlineSnapshot(`
"config should have required property 'collections'
config should have required property 'media_folder'
config should have required property 'media_library'
config should match some schema in anyOf"
`);
      });

      it('should throw if media_folder is not a string in config', () => {
        expect(() => {
          validateConfig({ ...config, media_folder: {} });
        }).toThrowErrorMatchingInlineSnapshot(`
"'media_folder' should be string
config should have required property 'collections'"
`);
      });
    });

    describe('collections', () => {
      const config = { backend: { name: 'bar' }, media_folder: 'baz' };
      it('should throw if collections is not defined in config', () => {
        expect(() => {
          validateConfig(config);
        }).toThrowErrorMatchingInlineSnapshot(
          `"config should have required property 'collections'"`,
        );
      });

      it('should throw if collections not an array in config', () => {
        expect(() => {
          validateConfig({ ...config, collections: {} });
        }).toThrowErrorMatchingInlineSnapshot(`"'collections' should be array"`);
      });

      it('should throw if collections is an empty array in config', () => {
        expect(() => {
          validateConfig({ ...config, collections: [] });
        }).toThrowErrorMatchingInlineSnapshot(`"'collections' should NOT have less than 1 items"`);
      });

      it('should throw if collections is an array with a single null element', () => {
        expect(() => {
          validateConfig({ ...config, collections: [null] });
        }).toThrowErrorMatchingInlineSnapshot(`
"'collections[0]' should be object
'collections[0]' should match exactly one schema in oneOf"
`);
      });

      it('should throw if collection does not have a "name" property', () => {
        expect(() => {
          validateConfig({
            ...config,
            collections: [
              {
                label: 'Foo',
                folder: 'bar',
                fields: [{ name: 'title' }],
              },
            ],
          });
        }).toThrowErrorMatchingInlineSnapshot(
          `"'collections[0]' should have required property 'name'"`,
        );
      });

      it('should throw if collection does not have a "label" property', () => {
        expect(() => {
          validateConfig({
            ...config,
            collections: [
              {
                name: 'foo',
                folder: 'bar',
                fields: [{ name: 'title' }],
              },
            ],
          });
        }).toThrowErrorMatchingInlineSnapshot(
          `"'collections[0]' should have required property 'label'"`,
        );
      });

      it('should throw if collection does not have a "folder" or "file" property', () => {
        expect(() => {
          validateConfig({
            ...config,
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                fields: [{ name: 'title' }],
              },
            ],
          });
        }).toThrowErrorMatchingInlineSnapshot(`
"'collections[0]' should have required property 'files'
'collections[0]' should have required property 'folder'
'collections[0]' should match exactly one schema in oneOf"
`);
      });

      it('should accept "title" or "path" as default identifier fields', () => {
        expect(() => {
          validateConfig({
            ...config,
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                folder: 'bar',
                fields: [{ name: 'title' }],
              },
            ],
          });
        }).not.toThrowError();

        expect(() => {
          validateConfig({
            ...config,
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                folder: 'bar',
                fields: [{ name: 'path' }],
              },
            ],
          });
        }).not.toThrowError();
      });

      it('should allow a custom identifier_field', () => {
        expect(() => {
          validateConfig({
            ...config,
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                folder: 'bar',
                identifier_field: 'baz',
                fields: [{ name: 'baz' }],
              },
            ],
          });
        }).not.toThrowError();
      });

      it('should throw if identifier_field does not match a field on the collection', () => {
        expect(() => {
          validateConfig({
            ...config,
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                folder: 'bar',
                identifier_field: 'baz',
                fields: [{ name: 'title' }],
              },
            ],
          });
        }).toThrowErrorMatchingInlineSnapshot(`
"'collections[0]' must have a field named \\"baz\\"
'collections[0]' should match \\"then\\" schema"
`);
      });
    });
  });
});
