const schema = {
  rules: [
    /**
     * Document
     */
    {
      match: [
        { object: 'document'},
      ],
      nodes: [{
        match: [
          { type: 'paragraph' },
          { type: 'heading-one' },
          { type: 'heading-two' },
          { type: 'heading-three' },
          { type: 'heading-four' },
          { type: 'heading-five' },
          { type: 'heading-six' },
          { type: 'quote' },
          { type: 'code-block' },
          { type: 'bulleted-list' },
          { type: 'numbered-list' },
          { type: 'break' },
          { type: 'thematicBreak' },
          { type: 'table' },
          { type: 'shortcode' },
        ],
        min: 1,
      }],
      normalize: (editor, error) => {
        switch (error.code) {
          case 'child_min_invalid': {
            const node = { object: 'block', type: 'paragraph' };
            editor.insertNodeByKey(error.node.key, 0, node);
            return;
          }
        }
      },
    },

    /**
     * Block Containers
     */
    {
      match: [
        { object: 'block', type: 'quote' },
        { object: 'block', type: 'list-item' },
        { object: 'block', type: 'table-cell' },
      ],
      nodes: [{
        match: [
          { type: 'paragraph' },
          { type: 'heading-one' },
          { type: 'heading-two' },
          { type: 'heading-three' },
          { type: 'heading-four' },
          { type: 'heading-five' },
          { type: 'heading-six' },
          { type: 'quote' },
          { type: 'code-block' },
          { type: 'bulleted-list' },
          { type: 'numbered-list' },
          { type: 'break' },
          { type: 'thematicBreak' },
          { type: 'table' },
        ],
      }],
    },

    /**
     * Blocks
     */
    {
      match: [
        { object: 'block', type: 'paragraph' },
        { object: 'block', type: 'heading-one' },
        { object: 'block', type: 'heading-two' },
        { object: 'block', type: 'heading-three' },
        { object: 'block', type: 'heading-four' },
        { object: 'block', type: 'heading-five' },
        { object: 'block', type: 'heading-six' },
        { object: 'inline', type: 'link' },
      ],
      nodes: [{
        match: [
          { object: 'text' },
          { type: 'link' },
          { type: 'image' },
        ],
      }],
    },

    /**
     * Bulleted List
     */
    {
      match: [
        { object: 'block', type: 'bulleted-list' },
      ],
      nodes: [
        {
          match: [
            { type: 'list-item' },
          ],
          min: 1,
        },
      ],
      next: [
        { type: 'paragraph' },
        { type: 'heading-one' },
        { type: 'heading-two' },
        { type: 'heading-three' },
        { type: 'heading-four' },
        { type: 'heading-five' },
        { type: 'heading-six' },
        { type: 'quote' },
        { type: 'code-block' },
        { type: 'numbered-list' },
        { type: 'break' },
        { type: 'thematicBreak' },
        { type: 'table' },
      ],
      normalize: (editor, error) => {
        switch (error.code) {
          case 'child_min_invalid':
            editor.removeNodeByKey(error.node.key);
            return;

          case 'next_sibling_type_invalid':
            if (error.next.type === 'bulleted-list') {
              editor.mergeNodeByKey(error.next.key);
            }
            return;
        }
      },
    },

    /**
     * Numbered List
     */
    {
      match: [
        { object: 'block', type: 'numbered-list' },
      ],
      nodes: [
        {
          match: [
            { type: 'list-item' },
          ],
          min: 1,
        },
      ],
      next: [
        { type: 'paragraph' },
        { type: 'heading-one' },
        { type: 'heading-two' },
        { type: 'heading-three' },
        { type: 'heading-four' },
        { type: 'heading-five' },
        { type: 'heading-six' },
        { type: 'quote' },
        { type: 'code-block' },
        { type: 'bulleted-list' },
        { type: 'break' },
        { type: 'thematicBreak' },
        { type: 'table' },
      ],
      normalize: (editor, error) => {
        switch (error.code) {
          case 'child_min_invalid':
            editor.removeNodeByKey(error.node.key);
            return;

          case 'next_sibling_type_invalid': {
            if (error.next.type === 'numbered-list') {
              editor.mergeNodeByKey(error.next.key);
            }
            return;
          }
        }
      },
    },

    /**
     * Voids
     */
    {
      match: [
        { object: 'inline', type: 'image' },
        { object: 'block', type: 'break' },
        { object: 'block', type: 'thematic-break' },
        { object: 'block', type: 'shortcode' },
        { object: 'block', type: 'code-block' },
      ],
      isVoid: true,
    },

    /**
     * Table
     */
    {
      match: [
        { object: 'block', type: 'table' },
      ],
      nodes: [{
        match: [
          { object: 'table-row' },
        ],
      }],
    },

    /**
     * Table Row
     */
    {
      match: [
        { object: 'block', type: 'table-row' },
      ],
      nodes: [{
        match: [
          { object: 'table-cell' },
        ],
      }],
    },

    /**
     * Marks
     */
    {
      match: [
        { object: 'mark', type: 'bold' },
        { object: 'mark', type: 'italic' },
        { object: 'mark', type: 'strikethrough' },
        { object: 'mark', type: 'code' },
      ],
    },
  ],
};

export default schema;
