# eslint-plugin-aaa-comments

This plugin provide rule for enforcing AAA (Arrange Act Assert) comments in unit tests. For the motivation refer to [Making Better Unit Tests: part 1, the AAA pattern](https://freecontent.manning.com/making-better-unit-tests-part-1-the-aaa-pattern/).

## Installation

```sh
# inside your project's working tree
npm install eslint-plugin-aaa-comments --save-dev
```

### Config - Legacy (`.eslintrc`)

All rules are off by default. Configuring manually:

```jsonc
{
  "rules": {
    "aaa-comments/enforce-aaa-comments": "error"
    // etc...
  },
},
```

### Config - Flat (`eslint.config.js`)

All rules are off by default. However, you may configure them manually in your `eslint.config.(js|cjs|mjs)`.

```js
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'aaa-comments/enforce-aaa-comments': 'error',
    },
  },
];
```

## Rules

The package consists of only one single rule

### aaa-comments/enforce-aaa-comments

Enforces you to write AAA (Arrange Act Assert) comments in unit tests. How the rule works:

1. Find every `it` function
2. Find the second argument of the function which is usually a function
3. Within that function calculates how many line breaks does it have

Based on the number of line breaks `it` callback have:

- If 0 and single statement – passes
- If 0 and more than one statements – fails
- If 1 or 2 line breaks – passes
- If 3 line breaks – requires you to have AAA comments

### Examples

Here's passing examples:

```js
it('works', async () => {
  const result = await client.invalidate({ userId: Random.int(1000000) });

  assert.strictEqual(result.isSuccess, true);
});

it('works', async () => {
  const foo = 'bar';

  const result = await client.invalidate({ userId: Random.int(1000000) });

  assert.strictEqual(result.isSuccess, true);
});

it('works', async () => {
  // Arrange
  const foo = 'bar';

  // Act
  const result = await client.invalidate({ userId: Random.int(1000000) });

  const result2 = await client.invalidate({ userId: Random.int(1000001) });

  // Assert
  assert.strictEqual(result.isSuccess, true);
});
```

Here's examples which are not passing:

```js
it('works', async () => {
  const result = await client.invalidate({ userId: Random.int(1000000) });
  assert.strictEqual(result.isSuccess, true);
});

it('works', async () => {
  const foo = 'bar';

  const result = await client.invalidate({ userId: Random.int(1000000) });

  const result2 = await client.invalidate({ userId: Random.int(1000001) });

  assert.strictEqual(result.isSuccess, true);
});
```
