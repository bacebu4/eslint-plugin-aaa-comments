/** @import { TSESLint } from '@typescript-eslint/utils' */

const DEFAULT_IGNORED_OBJECTS = ['assert', 'expect', 'should', 'sinon', 'jest', 'test', 'chai'];

/** @type TSESLint.RuleModule<any> */
const rule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce an `it` section contains an interaction with `sut` object.',
      url: 'https://github.com/bacebu4/eslint-plugin-aaa-comments',
    },
    schema: [
      {
        type: 'object',
        properties: {
          /**
           * List of objects that should be ignored when counting object method calls
           * These are commonly used test utilities and don't represent the system under test
           */
          ignoredObjects: {
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
      },
    ],
  },

  create: function (context) {
    const ignoredObjects = context.options[0]
      ? new Set(context.options[0].ignoredObjects)
      : new Set(DEFAULT_IGNORED_OBJECTS);

    // Track whether we're inside an 'it' block
    let insideItBlock = false;

    // Track whether we've found any interaction with 'sut' in the current 'it' block
    let foundSutInteraction = false;

    // Track whether we've found any object method call in the current 'it' block
    let foundNonStaticObjectMethodCall = false;

    // Function to check if identifier is likely a class name (starts with capital letter)
    function isLikelyClassName(name) {
      return name && name.length > 0 && name[0] === name[0].toUpperCase();
    }

    return {
      // Check for 'it' function calls
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'it') {
          insideItBlock = true;
          foundSutInteraction = false;
          foundNonStaticObjectMethodCall = false;
        }
      },

      // Check for method calls within the 'it' block
      'CallExpression:exit'(node) {
        if (!insideItBlock) {
          return;
        }

        // Check if this is a method call (e.g., object.method())
        if (node.callee.type === 'MemberExpression' && node.callee.object.type === 'Identifier') {
          const objectName = node.callee.object.name;

          if (!ignoredObjects.has(objectName) && !isLikelyClassName(objectName)) {
            foundNonStaticObjectMethodCall = true;

            if (objectName === 'sut') {
              foundSutInteraction = true;
            }
          }
        }

        // If this is the end of the 'it' block
        if (node.callee.type === 'Identifier' && node.callee.name === 'it') {
          // Only report an error if there were object method calls but none on 'sut'
          if (foundNonStaticObjectMethodCall && !foundSutInteraction) {
            context.report({
              node,
              message: 'No interaction with `sut` found.',
            });
          }

          // Reset for the next 'it' block
          insideItBlock = false;
        }
      },

      // Also check for property access on 'sut' object (for getters)
      MemberExpression(node) {
        if (insideItBlock && node.object.type === 'Identifier' && node.object.name === 'sut') {
          foundSutInteraction = true;
        }
      },
    };
  },
};

module.exports = rule;
