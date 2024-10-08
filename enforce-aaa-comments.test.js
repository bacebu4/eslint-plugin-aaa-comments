const { RuleTester } = require('eslint');
const rule = require('./enforce-aaa-comments');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2017 },
});

ruleTester.run('enforce-aaa-comments', rule, {
  valid: [
    {
      name: 'passes with act and assert',
      code: `
    it('works', async () => {
        const result = await client.invalidate({ userId: Random.int(1000000) });

        assert.strictEqual(result.isSuccess, true);
    });
    `,
    },
    {
      name: 'passes with arrange, act, assert',
      code: `
    it('works', async () => {
        const foo = 'bar';

        const result = await client.invalidate({ userId: Random.int(1000000) });

        assert.strictEqual(result.isSuccess, true);
    });
    `,
    },
    {
      name: 'passes with arrange, act and assert when multiline calls',
      code: `
    it('works', async () => {
        const foo = 'bar';

        const result = await client.invalidate({ 
          userId: Random.int(1000000) 
        });

        assert.strictEqual(result.isSuccess, true);
    });
    `,
    },
    {
      name: 'passes with random comments',
      code: `
it('works', async () => {
    // Some comment
    const foo = 'bar';

    // Act
    const result = await client.invalidate({ userId: Random.int(1000000) });

    // Assert
    assert.strictEqual(result.isSuccess, true);
});
`,
    },
    {
      name: 'passes with multiline comments',
      code: `
    it('works', async () => {
        // Some comment
        const foo = 'bar';

        // Act
        /**
         * Some long comment
         */
        const result = await client.invalidate({ userId: Random.int(1000000) });

        // Assert
        assert.strictEqual(result.isSuccess, true);
    });
    `,
    },
    {
      name: 'passes when AAA comments provided and any line breaks are present',
      code: `
    it('works', async () => {
        // Arrange
        const foo = 'bar';

        // Act
        const result = await client.invalidate({ userId: Random.int(1000000) });

        const result2 = await client.invalidate({ userId: Random.int(1000001) });

        // Assert
        assert.strictEqual(result.isSuccess, true);
    });
    `,
    },
    {
      name: 'passes when single statement',
      code: `
    it('works', async () => {
        assert.strictEqual(true, true);
    });
    `,
    },
  ],
  invalid: [
    {
      code: `
    it('works', async () => {
        const result = await client.invalidate({ userId: Random.int(1000000) });
        assert.strictEqual(result.isSuccess, true);
    });
    `,
      errors: 1,
    },
    {
      code: `
    it('works', async () => {
        const foo = 'bar';

        const result = await client.invalidate({ userId: Random.int(1000000) });

        const result2 = await client.invalidate({ userId: Random.int(1000001) });

        assert.strictEqual(result.isSuccess, true);
    });
    `,
      errors: 1,
    },
    {
      code: `
    it('works', async () => {
        // Arrange
        const foo = 'bar';

        // Act
        const result = await client.invalidate({ userId: Random.int(1000000) });

        const result2 = await client.invalidate({ userId: Random.int(1000001) });

        assert.strictEqual(result.isSuccess, true);
    });
    `,
      errors: 1,
    },
  ],
});

console.log('All tests passed!');
