const { RuleTester } = require('eslint');
const rule = require('./enforce-sut-interaction');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2017 },
});

ruleTester.run('require-sut-method-call', rule, {
  valid: [
    {
      name: 'finds `sut`',
      code: `
    it('works', async () => {
        const result = await sut.invalidate({ userId: Random.int(1000000) });
        assert.strictEqual(result.isSuccess, true);
    });
    `,
    },
    {
      name: 'passes if no object calls except for assert',
      code: `
    it('works', async () => {
        const result = sum(1, 2);
        assert.strictEqual(result, 3);
    });
    `,
    },
    {
      name: 'passes if static method calls',
      code: `
    it('works', async () => {
        const result = Random.int(1, 2);
        assert.strictEqual(result, 3);
    });
    `,
    },
    {
      name: 'passes if has `sut` getters',
      code: `
    it('works', async () => {
        const sut = new RetryConfig({ value: context.getDefault() })

        assert.strictEqual(sut.maxAttempts, 3);
    });
    `,
    },
  ],
  invalid: [
    {
      name: 'error when no `sut`',
      code: `
    it('works', async () => {
        const result = await client.invalidate({ userId: Random.int(1000000) });
        assert.strictEqual(result.isSuccess, true);
    });
    `,
      errors: 1,
    },
  ],
});

console.log('All tests passed!');
