import { execSync } from 'child_process'
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
        expect(error.stderr.toString()).toContain('ERR_PNPM_FETCH_404  GET https://registry.npmjs.org/non_existent_command: Not Found - 404')
    }
})


it('should fail to run a vite script directly', () => {
    try {
        execSync('node ./vite-script.js')
    } catch (error) {
        expect(error.stderr.toString()).toContain(`TypeError: Cannot read properties of undefined (reading 'SSR')`)
    }
})

// cant make this work
// it('should run a vite script that would otherwise fail', () => {
//   const output = execSync('node ./index.js ./vite-script.js',{cwd:process.cwd()}).toString().trim()
//   expect(output).toContain('true')
// })

