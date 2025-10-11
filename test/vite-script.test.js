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

it('should fail to run a vite script', () => {
  const output = execSync('node ./vte-script').toString().trim()
})

it('should not output true', () => {
  const output = execSync('node ./index.js ./vite-script.js').toString().trim()
})
