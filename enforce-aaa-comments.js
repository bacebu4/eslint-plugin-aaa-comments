/** @import { TSESLint, TSESTree } from '@typescript-eslint/utils' */

/** @type TSESLint.RuleModule<any> */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that an `it` section provides AAA comments or correct number of line breaks.',
      url: 'https://github.com/bacebu4/eslint-plugin-aaa-comments',
    },
    schema: [],
  },
  create(context) {
    /**
     * @param {TSESTree.Comment[]} comments
     * @param {TSESTree.CallExpression} node
     */
    function checkAaaComments(comments, node) {
      const aaaComments = new Set(['arrange', 'act', 'assert']);
      const collectedAaaComments = comments
        .map(c => c.value.trim().toLowerCase())
        .filter(c => aaaComments.has(c));

      const uniqueCollectedAaaComments = new Set(collectedAaaComments);

      const collectedAaaCommentsArePresentExactlyOnce =
        collectedAaaComments.length === uniqueCollectedAaaComments.size &&
        uniqueCollectedAaaComments.size === 3;

      if (!collectedAaaCommentsArePresentExactlyOnce) {
        context.report({
          node,
          message:
            'More than 2 line breaks were found. Provide all AAA comments for better readability or delete redundant line breaks.',
        });
      }
    }

    return {
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'it') {
          return;
        }

        const secondArgument = node.arguments.at(1);
        if (!secondArgument) {
          return;
        }

        const topLevelBlockStatement = getBlockStatement(secondArgument);
        if (!topLevelBlockStatement) {
          return;
        }

        const body = topLevelBlockStatement.body;
        const comments = context.sourceCode.getCommentsInside(topLevelBlockStatement);

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

        const haveOnlyOneStatement = body.length === 1;
        if (haveOnlyOneStatement && lineBreaksCount === 0) {
          return;
        }

        checkAaaComments(comments, node);
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

/**
 * @param {TSESTree.CallExpressionArgument} node
 */
function getBlockStatement(node) {
  if (node.type === 'ArrowFunctionExpression' && node.body.type === 'BlockStatement') {
    return node.body;
  }

  if (node.type === 'FunctionExpression') {
    return node.body;
  }
}

module.exports = rule;
