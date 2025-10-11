import { execSync } from 'child_process'
import { expect, test } from 'vitest'

test('run a simple command', () => {
  const output = execSync('node index.js echo "hello world"').toString().trim()
  expect(output).toContain('hello world')
})
