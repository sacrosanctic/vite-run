import { execSync } from 'child_process'
import { expect, it } from 'viit'

it('should exit with an error if no command is provided', () => {
    try {
        execSync('node ./index.js')
    } catch (error) {
        expect(error.stderr.toString()).toContain('Usage: run-vite <command> [args...]')
    }
})

it('should handle command not found', () => {
    try {
        execSync('node ./index.js non_existent_command')
    } catch (error) {
        expect(error.stderr.toString()).toContain('Command failed')
    }
})

it('should run a simple command', () => {
  const output = execSync('node ./index.js echo "hello world"').toString().trim()
  expect(output).toContain('hello world')
})

it('should run a simple command with vite api and fail', () => {
  const output = execSync('node ./vite-script.js').toString().trim()
})


it('should run a simple command that uses the vite api and pass', () => {
  const output = execSync('node ./index.js ./vite-script.js').toString().trim()})
