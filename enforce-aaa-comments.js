/** @import { TSESLint, TSESTree } from '@typescript-eslint/utils' */

/** @type TSESLint.RuleModule<any> */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that an `it` section provides AAA comments or correct number of line breaks.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name !== 'it') {
          return;
        }

        const secondArgument = node.arguments.at(1);
        if (secondArgument.type !== 'ArrowFunctionExpression') {
          return;
        }

        /** @type TSESTree.ArrowFunctionExpression */
        const arrowFunctionExpression = secondArgument;
        if (arrowFunctionExpression.body.type !== 'BlockStatement') {
          return;
        }

        /** @type TSESTree.BlockStatement */
        const blockStatement = arrowFunctionExpression.body;

        const body = blockStatement.body;
        const comments = context.sourceCode.getCommentsInside(blockStatement);

        const allOccupiedLines = body.flatMap(bs => getAllLinesFromLocation(bs.loc));
        comments.forEach(c => allOccupiedLines.push(...getAllLinesFromLocation(c.loc)));

        const minLine = Math.min(...allOccupiedLines);
        const maxLine = Math.max(...allOccupiedLines);
        const allOccupiedLinesSet = new Set(allOccupiedLines);

        const emptyLines = [];
        for (let i = minLine + 1; i < maxLine; i++) {
          if (!allOccupiedLinesSet.has(i)) {
            emptyLines.push(i);
          }
        }

        // for now assume that line breaks cannot be more than one line
        const lineBreaksCount = emptyLines.length;

        if (lineBreaksCount === 1 || lineBreaksCount === 2) {
          return;
        }

        if (lineBreaksCount === 0) {
          const haveOnlyOneStatement = body.length === 1;

          if (haveOnlyOneStatement) {
            return;
          }

          context.report({
            node,
            message: 'No line breaks were found. Provide line breaks for better readability.',
          });
          return;
        }

        const aaaComments = new Set(['arrange', 'act', 'assert']);
        const allAaaComments = comments
          .map(c => c.value.trim().toLowerCase())
          .filter(c => aaaComments.has(c));

        const allUniqueAaaComments = new Set(allAaaComments);

        const allAaaCommentsArePresentExactlyOnce =
          allAaaComments.length === allUniqueAaaComments.size && allUniqueAaaComments.size === 3;

        if (!allAaaCommentsArePresentExactlyOnce) {
          context.report({
            node,
            message:
              'More than 2 line breaks were found. Provide all AAA comments for better readability or delete redundant line breaks.',
          });
        }
      },
    };
  },
};

/**
 * @param {TSESTree.SourceLocation} loc
 */
function getAllLinesFromLocation(loc) {
  const lines = [];
  for (let i = loc.start.line; i <= loc.end.line; i++) {
    lines.push(i);
  }
  return lines;
}

module.exports = rule;
