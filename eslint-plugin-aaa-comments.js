const enforceAaaCommentRule = require('./enforce-aaa-comments');
const enforceSutInteractionRule = require('./enforce-sut-interaction');

const plugin = {
  rules: {
    'enforce-aaa-comments': enforceAaaCommentRule,
    'enforce-sut-interaction': enforceSutInteractionRule,
  },
};

plugin.configs = {
  recommended: {
    plugins: { 'aaa-comments': plugin },
    rules: {
      'aaa-comments/enforce-aaa-comments': 'error',
    },
  },
  strict: {
    plugins: { 'aaa-comments': plugin },
    rules: {
      'aaa-comments/enforce-aaa-comments': 'error',
      'aaa-comments/enforce-sut-interaction': 'error',
    },
  },
};

module.exports = plugin;
