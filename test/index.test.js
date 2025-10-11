import { exec, execSync } from 'child_process'
import { expect, it } from 'vitest'


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

it('should test for successful execution', () => {
})

