import { Block, Text } from 'slate';
import isHotkey from 'is-hotkey';

export default onKeyDown;

function onKeyDown(event, editor) {
  const createDefaultBlock = () => {
    return Block.create({
      type: 'paragraph',
      nodes: [Text.create('')],
    });
  };

  if (isHotkey('Enter', event)) {
    /**
     * If "Enter" is pressed while a single void block is selected, a new
     * paragraph should be added above or below it, and the current selection
     * (range) should be collapsed to the start of the new paragraph.
     *
     * If the selected block is the first block in the document, create the
     * new block above it. If not, create the new block below it.
     */
    const { document: doc, anchorBlock, focusBlock, schema } = editor.value;
    const singleBlockSelected = anchorBlock === focusBlock;
    if (!singleBlockSelected || !schema.isVoid(focusBlock)) {
      return;
    }

    event.preventDefault();

    const focusBlockParent = doc.getParent(focusBlock.key);
    const focusBlockIndex = focusBlockParent.nodes.indexOf(focusBlock);
    const focusBlockIsFirstChild = focusBlockIndex === 0;

    const newBlock = createDefaultBlock();
    const newBlockIndex = focusBlockIsFirstChild ? 0 : focusBlockIndex + 1;

    return editor
      .insertNodeByKey(focusBlockParent.key, newBlockIndex, newBlock)
      .moveToStartOfNode(newBlock);
  }

  const marks = [['b', 'bold'], ['i', 'italic'], ['s', 'strikethrough'], ['`', 'code']];

  const [, markName] = marks.find(([key]) => isHotkey(`mod+${key}`, event)) || [];

  if (markName) {
    event.preventDefault();
    return editor.toggleMark(markName);
  }
}
