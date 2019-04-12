// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import rehype from 'rehype';
import visit from 'unist-util-visit';
import { oneLineTrim } from 'common-tags';

function runTimes(cyInstance, fn, count = 1) {
  let chain = cyInstance, i = count;
  while (i) {
    i -= 1;
    chain = fn(chain);
  }
  return chain;
}

[
  'enter',
  'backspace',
  ['selectAll', 'selectall'],
  ['up', 'upArrow'],
  ['down', 'downArrow'],
  ['left', 'leftArrow'],
  ['right', 'rightArrow'],
].forEach(key => {
  const [ cmd, keyName ] = typeof key === 'object' ? key : [key, key];
  Cypress.Commands.add(cmd, { prevSubject: true }, (subject, { shift, times = 1 } = {}) => {
    const fn = chain => chain.type(`{${keyName}}${shift ? '{shift}' : ''}`);
    return runTimes(cy.wrap(subject), fn, times);
  });
});

// Convert `tab` command from plugin to a child command with `times` support
Cypress.Commands.add('tabkey', { prevSubject: true }, (subject, { shift, times } = {}) => {
  const fn = chain => chain.tab({ shift });
  return runTimes(cy, fn, times).wrap(subject);
});

Cypress.Commands.add('selection', { prevSubject: true }, (subject, fn) => {
  cy.wrap(subject)
    .trigger('mousedown')
    .then(fn)
    .trigger('mouseup')

  cy.document().trigger('selectionchange');
  return cy.wrap(subject);
});

Cypress.Commands.add('print', { prevSubject: 'optional' }, (subject, str) => {
  cy.log(str);
  console.log(`cy.log: ${str}`);
  return cy.wrap(subject);
});

Cypress.Commands.add('setSelection', { prevSubject: true }, (subject, query, endQuery) => {
  return cy.wrap(subject)
    .selection($el => {
      if (typeof query === 'string') {
        const anchorNode = getTextNode($el[0], query);
        const focusNode = endQuery ? getTextNode($el[0], endQuery) : anchorNode;
        const anchorOffset = anchorNode.wholeText.indexOf(query);
        const focusOffset = endQuery ?
          focusNode.wholeText.indexOf(endQuery) + endQuery.length :
          anchorOffset + query.length;
        setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
      } else if (typeof query === 'object') {
        const el = $el[0];
        const anchorNode = getTextNode(el.querySelector(query.anchorQuery));
        const anchorOffset = query.anchorOffset || 0;
        const focusNode = query.focusQuery ? getTextNode(el.querySelector(query.focusQuery)) : anchorNode;
        const focusOffset = query.focusOffset || 0;
        setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
      }
    });
});

Cypress.Commands.add('setCursor', { prevSubject: true }, (subject, query, atStart) => {
  return cy.wrap(subject)
    .selection($el => {
      const node = getTextNode($el[0], query);
      const offset = node.wholeText.indexOf(query) + (atStart ? 0 : query.length);
      const document = node.ownerDocument;
      document.getSelection().removeAllRanges();
      document.getSelection().collapse(node, offset);
    })
    .click();
  // click chained at end to reactivate Slate, otherwise subsequent key presses
  // are processed by the contenteditable element without Slate's processing
});

Cypress.Commands.add('setCursorBefore', { prevSubject: true }, (subject, query) => {
  cy.wrap(subject).setCursor(query, true);
});

Cypress.Commands.add('setCursorAfter', { prevSubject: true }, (subject, query) => {
  cy.wrap(subject).setCursor(query);
});

Cypress.Commands.add('login', () => {
  cy.viewport(1200, 1200);
  cy.visit('/');
  cy.contains('button', 'Login').click();
});

Cypress.Commands.add('loginAndNewPost', () => {
  cy.login();
  cy.contains('a', 'New Post').click();
});

Cypress.Commands.add('drag', { prevSubject: true }, subject => {
  return cy.wrap(subject)
    .trigger('dragstart', {
      dataTransfer: {},
      force: true,
    });
});

Cypress.Commands.add('drop', { prevSubject: true }, subject => {
  return cy.wrap(subject)
    .trigger('drop', {
      dataTransfer: {},
      force: true,
    });
});

Cypress.Commands.add('clickToolbarButton', (title, { times } = {}) => {
    const instance = cy.get(`button[title="${title}"]`);
    const fn = chain => chain.click();
    return runTimes(instance, fn, times).focused();
});

Cypress.Commands.add('clickUnorderedListButton', opts => {
  return cy.clickToolbarButton('Bulleted List', opts);
});

Cypress.Commands.add('clickOrderedListButton', opts => {
  return cy.clickToolbarButton('Numbered List', opts);
});

Cypress.Commands.add('confirmEditorContent', expectedDomString => {
  return cy.get('[data-slate-editor]')
    .should(([element]) => {
      const actualDomString = toPlainTree(element.innerHTML);
      expect(actualDomString).toEqual(oneLineTrim(expectedDomString));
    });
});

function toPlainTree(domString) {
  return rehype()
    .use(removeSlateArtifacts)
    .data('settings', { fragment: true })
    .processSync(domString)
    .contents;
}

function removeSlateArtifacts() {
  return function transform(tree) {
    visit(tree, 'element', node => {
      // remove all element attributes
      delete node.properties;

      // all paragraphs are padded with three spans, remove them to simplify
      // snapshots
      if (node.tagName === 'p') {
        node.children = node.children[0].children[0].children[0].children;
      }
    });
  }
}

function walker(el) {
}

function getTextNode(el, match){
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  if (!match) {
    return walk.nextNode();
  }

  const nodes = [];
  let node;
  while(node = walk.nextNode()) {
    if (node.wholeText.includes(match)) {
      return node;
    }
  }
}

function setBaseAndExtent(...args) {
  const document = args[0].ownerDocument;
  document.getSelection().removeAllRanges();
  document.getSelection().setBaseAndExtent(...args);
}
