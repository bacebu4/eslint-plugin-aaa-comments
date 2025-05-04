const rule = require('./enforce-aaa-comments');

const plugin = { rules: { 'enforce-aaa-comments': rule } };

plugin.configs = {
  recommended: {
    plugins: { 'aaa-comments': plugin },
    rules: {
      'aaa-comments/enforce-aaa-comments': 'error',
    },
  },
};

module.exports = plugin;
