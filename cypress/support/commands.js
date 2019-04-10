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

import { times } from 'lodash';
import rehype from 'rehype';
import visit from 'unist-util-visit';
import { oneLineTrim } from 'common-tags';

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
  Cypress.Commands.add(cmd, { prevSubject: true }, (subject, { shift, times: t = 1 } = {}) => {
    times(t, () => {
      cy.wrap(subject).type(`{${keyName}}${shift ? '{shift}' : ''}`);
    });
  });
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

Cypress.Commands.add('clickToolbarButton', title => {
  cy.get(`button[title="${title}"]`).click();
  return cy.focused();
});

Cypress.Commands.add('clickUnorderedListButton', ({ times: t = 1 } = {}) => {
  times(t, () => {
    cy.clickToolbarButton('Bulleted List');
  });
  return cy.focused();
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
