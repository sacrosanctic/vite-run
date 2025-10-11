#!/usr/bin/env node
import { resolveCommand } from 'package-manager-detector/commands'
import { detect } from 'package-manager-detector/detect'
import { execSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'

const runTempScript = (pm, args) => {
const {command, args:executeArgs} = resolveCommand(
  pm.agent,
  'execute',
  [...args]
)

	const scriptContent = `
import { execSync } from 'child_process'

try {
	console.log('> ${command} ${executeArgs.join(' ')}')
	execSync('${command} ${executeArgs.join(' ')}', { stdio: 'inherit' })
} catch (error) {
	console.error('Command execution failed:', error)
	process.exit(1)
}
`

	// Write the script to a temp file
	const tempFile = join('./', `.vite-run-${Date.now()}.tmp.js`)
	writeFileSync(tempFile, scriptContent)

	console.log(`Running in directory: ${process.cwd()}`)
	console.log(`Detecting package manager: ${pm.agent}`)
	console.log(`Command to run: ${args.join(' ')}`)
	console.log(`Executing via vite-node: ${tempFile}\n`)

	// Execute the temporary script with vite-node
const { command:viteNodeCommand, args:viteNodeArgs } = resolveCommand(
  pm.agent,
  'execute',
  [
    "vite-node",
    "--options.transformMode.ssr='/.*/'",
    tempFile]
  )

		try {
			execSync(`${viteNodeCommand} ${viteNodeArgs.join(' ')}`, { stdio: 'inherit' })
		} finally {
			// Clean up the temporary script file
			unlinkSync(tempFile)
		}
}

const main = async () => {
	const [, , ...args] = process.argv

	if (args.length === 0) {
		console.error('Usage: run-vite <command> [args...]')
		process.exit(1)
	}

	const pm = await detect()
	if (!pm) throw new Error('Could not detect package manager')

	runTempScript(pm, args)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})

