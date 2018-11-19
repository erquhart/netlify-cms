import { pick, without, castArray } from 'lodash';
import { validateConfig } from '../configSchema';

const mocks = {
  backend: {
    name: 'foo',
  },
  media_folder: 'bar',
  media_library: {
    name: 'baz',
  },
  collections: [
    {
      name: 'foo',
      label: 'Foo',
      folder: 'bar',
      fields: [{ name: 'title' }],
    },
  ],
};

function mockConfigWithout(keys) {
  const defaultKeys = ['backend', 'media_folder', 'collections'];
  return pick(mocks, without(defaultKeys, ...castArray(keys)));
}

function mockConfig() {
  return mockConfigWithout();
}

function validateConfigWithout(keys, config) {
  validateConfig({
    ...mockConfigWithout(keys),
    ...config,
  });
}

describe('config', () => {
  /**
   * Suppress error logging to reduce noise during testing. Jest will still
   * log test failures and associated errors as expected.
   */
  /*
  beforeEach(() => {
    jest.spyOn(console, 'error');
  });
  */

  describe('validateConfig', () => {
    it('should not throw if configuration is valid', () => {
      expect(() =>
        validateConfig({
          ...mockConfig(),
        }),
      ).not.toThrowError();
    });

    it('should not throw due to unknown properties', () => {
      expect(() =>
        validateConfigWithout('backend', {
          foo: 'bar',
          bar: {
            baz: 'baz',
          },
          backend: {
            ...mocks.backend,
            foo: 'bar',
          },
        }),
      ).not.toThrowError();
    });

    it('should throw if backend is not defined', () => {
      expect(() =>
        validateConfigWithout('backend', {
          // empty config object
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"backend is required"`);
    });

    it('should throw if backend.name is not defined', () => {
      expect(() =>
        validateConfigWithout('backend', {
          backend: {},
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"backend.name is required"`);
    });

    it('should throw if backend.name is not a string', () => {
      expect(() =>
        validateConfigWithout('backend', {
          backend: {
            name: {},
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"backend.name must be a string"`);
    });

    it('should throw if both media_folder and media_library are undefined', () => {
      expect(() =>
        validateConfigWithout('media_folder', {
          // empty config object
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `" must have 'media_folder' or 'media_library' defined"`,
      );
    });

    it('should throw if media_folder is not a string', () => {
      expect(() =>
        validateConfigWithout('media_folder', {
          media_folder: {},
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"media_folder must be a string"`);
    });

    it('should throw if media_library is not an object', () => {
      expect(() =>
        validateConfigWithout('media_folder', {
          media_library: 'bar',
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"media_library must be an object"`);
    });

    it('should throw if media_library.name is not defined', () => {
      expect(() =>
        validateConfigWithout('media_folder', {
          media_library: {},
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"media_library.name is required"`);
    });

    it('should not throw if media_library is valid', () => {
      expect(() =>
        validateConfigWithout('media_folder', {
          media_library: {
            name: 'foo',
          },
        }),
      ).not.toThrowError();
    });

    it('should throw if collections is not defined', () => {
      expect(() =>
        validateConfigWithout('collections', {
          // empty config object
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"collections is required"`);
    });

    it('should throw if collections is not an array', () => {
      expect(() =>
        validateConfigWithout('collections', {
          collections: {},
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"collections must be an array"`);
    });

    it('should throw if collections is an empty array', () => {
      expect(() =>
        validateConfigWithout('collections', {
          collections: [],
        }),
      ).toThrowErrorMatchingInlineSnapshot(`"collections cannot be empty"`);
    });

    describe('collection', () => {
      it('should throw if collection is not an object', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [null],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"collections[0] must be an object"`);
      });

      it('should throw if name is not defined', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                // empty collection
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"collections[0].name is required"`);
      });

      it('should throw if label is not defined', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"collections[0].label is required"`);
      });

      it('should throw if "folder" or "file" is not defined', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                fields: [{ name: 'title' }],
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(
          `"collections[0] must have 'folder' or 'file' defined"`,
        );
      });

      it('should throw if both "folder" and "file" are defined', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                folder: 'bar',
                file: 'baz',
                fields: [{ name: 'title' }],
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(
          `"collections[0] cannot have both 'folder' and 'file' defined"`,
        );
      });

      it('should throw if "folder" is not a string', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                folder: {},
                fields: [{ name: 'title' }],
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"collections[0].folder must be a string"`);
      });

      it('should throw if "file" is not a string', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                file: {},
                fields: [{ name: 'title' }],
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"collections[0].file must be a string"`);
      });

      it('should throw if "fields" is not defined', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                file: 'bar',
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"collections[0].fields is required"`);
      });

      it('should throw if "fields" is not an array', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                file: 'bar',
                fields: {},
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"collections[0].fields must be an array"`);
      });

      it('should throw if "fields" is an empty array', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                file: 'bar',
                fields: [],
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"collections[0].fields cannot be empty"`);
      });

      it('should throw if a valid identifier field is not defined', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                file: 'bar',
                fields: [
                  {
                    name: 'baz',
                  },
                ],
              },
            ],
          }),
        ).toThrowErrorMatchingInlineSnapshot(`"\\"name\\" must be one of [title, path]"`);
      });

      it('should throw if optional properties are of incorrect type', () => {
        [
          ['label', 'string', {}],
          ['widget', 'string', {}],
          ['required', 'boolean', {}],
        ].forEach(([fieldName, type, invalidValue]) => {
          expect(() =>
            validateConfigWithout('collections', {
              collections: [
                {
                  name: 'foo',
                  label: 'Foo',
                  file: 'bar',
                  fields: [
                    {
                      name: 'title',
                      [fieldName]: invalidValue,
                    },
                  ],
                },
              ],
            }),
          ).toThrow(new RegExp(`must be an? ${type}$`));
        });
      });

      it('should not throw', () => {
        expect(() =>
          validateConfigWithout('collections', {
            collections: [
              {
                name: 'foo',
                label: 'Foo',
                file: 'bar',
                fields: [
                  {
                    name: 'title',
                  },
                  {
                    name: 'test',
                  },
                ],
              },
            ],
          }),
        ).not.toThrow();
      });

      describe('field', () => {
        it('should throw if defined with non-object', () => {
          expect(() =>
            validateConfigWithout('collections', {
              collections: [
                {
                  name: 'foo',
                  label: 'Foo',
                  file: 'bar',
                  fields: [null],
                },
              ],
            }),
          ).toThrowErrorMatchingInlineSnapshot(`"collections[0].fields[0] must be an object"`);
        });

        it('should throw if name is not defined', () => {
          expect(() =>
            validateConfigWithout('collections', {
              collections: [
                {
                  name: 'foo',
                  label: 'Foo',
                  file: 'bar',
                  fields: [
                    {
                      // empty field
                    },
                  ],
                },
              ],
            }),
          ).toThrowErrorMatchingInlineSnapshot(`"collections[0].fields[0].name is required"`);
        });
      });
    });
  });
});
/*
        it('should not throw if a file collection does not have a title or path field', () => {
          expect(() =>
            validateConfigWithout('collections', {
              collections: [
                {
                  name: 'foo',
                  label: 'Foo',
                  file: 'bar',
                  fields: [{ name: 'baz' }],
                },
              ],
            }),
          ).toThrowErrorMatchingInlineSnapshot();
        });

        it('should throw if a folder collection does not have a title or path field', () => {
          expect(() =>
            validateConfigWithout('collections', {
              collections: [
                {
                  name: 'foo',
                  label: 'Foo',
                  folder: 'bar',
                  fields: [{ name: 'baz' }],
                },
              ],
            }),
          ).toThrowErrorMatchingInlineSnapshot();
        });
        */
/*


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
    "'collections[0].fields[0].name' should be equal to constant
    'collections[0].fields' should contain a valid item
    'collections[0]' should match \\"then\\" schema"
    `);
          });
        });
      });
    });
    */
