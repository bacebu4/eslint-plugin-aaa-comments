[![npm version](https://img.shields.io/npm/v/eslint-plugin-aaa-comments)](https://www.npmjs.com/package/eslint-plugin-aaa-comments)

# eslint-plugin-aaa-comments

This plugin provide rule for enforcing AAA (Arrange Act Assert) comments **or** enforces you to organize your `it` cases into 3 sections without enforcing comments in unit tests.

For the motivation refer to [Making Better Unit Tests: part 1, the AAA pattern](https://freecontent.manning.com/making-better-unit-tests-part-1-the-aaa-pattern/).

## Installation

```sh
# inside your project's working tree
npm install eslint-plugin-aaa-comments --save-dev
```

### Config - Legacy (`.eslintrc`)

```jsonc
{
  // add "aaa-comments" to plugins array
  "plugins": ["aaa-comments"],
  "rules": {
    "aaa-comments/enforce-aaa-comments": "error",
    "aaa-comments/enforce-sut-interaction": "warn",
    // etc...
  },
},
```

### Config - Flat (`eslint.config.js`)

All rules are off by default. However, you may configure them manually in your `eslint.config.(js|cjs|mjs)`.

```js
import aaaCommentsPlugin from 'eslint-plugin-aaa-comments';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  aaaCommentsPlugin.configs.recommended,
  // etc...
]);
```

There are two configs:

- `aaaCommentsPlugin.configs.recommended`. It only has `enforce-aaa-comments` with error level
- `aaaCommentsPlugin.configs.strict`. It has `enforce-aaa-comments` and `enforce-sut-interaction` with error level

## Rules

The package consists of two rules: `enforce-aaa-comments` and `enforce-sut-interaction`

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

#### Examples

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

### aaa-comments/enforce-sut-interaction

Enforces you to interact with `sut` (System Under Test) object. How the rule works:

1. Find every `it` function
2. Find the second argument of the function which is usually a function
3. Within that function determines whether we interact with any objects, excluding assertion libraries and static method calls. If we do then it checks whether we have interacted with `sut` object

#### Examples

Here's passing examples:

```js
it('works', async () => {
  const result = await sut.invalidate({ userId: Random.int(1000000) });
  assert.strictEqual(result.isSuccess, true);
});

it('works', async () => {
  const result = sum(1, 2);
  assert.strictEqual(result, 3);
});

it('works', async () => {
  const result = Random.int(1, 2);
  assert.strictEqual(result, 3);
});
```

Here's examples which are not passing:

```js
it('works', async () => {
  const result = await client.invalidate({ userId: Random.int(1000000) });
  assert.strictEqual(result.isSuccess, true);
});
```
