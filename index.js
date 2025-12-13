#!/usr/bin/env node
import { resolveCommand } from 'package-manager-detector/commands'
import { detect } from 'package-manager-detector/detect'
import { execSync } from 'child_process'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import which from 'which'

const runTempScript = (pm, args) => {
	const { command, args: executeArgs } = resolveCommand(
		//
		pm.agent,
		'run',
		[...args],
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
	const { command: viteNodeCommand, args: viteNodeArgs } = resolveCommand(
		//
		pm.agent,
		'execute',
		['vite-node', "--options.transformMode.ssr='/.*/'", tempFile],
	)

	try {
		execSync(`${viteNodeCommand} ${viteNodeArgs.join(' ')}`, {
			stdio: 'inherit',
		})
	} finally {
		// Clean up the temporary script file
		unlinkSync(tempFile)
	}
}

const runLocalScript = (pm, args) => {
	// TODO: Implement local script execution
	console.log('Running local script (not implemented yet)...')
	console.log('pm:', pm.agent)
	console.log('args:', args)

	// Execute the temporary script with vite-node
	const { command: viteNodeCommand, args: viteNodeArgs } = resolveCommand(
		//
		pm.agent,
		'execute',
		['vite-node', "--options.transformMode.ssr='/.*/'", [...args]],
	)

	try {
		console.log(`> ${viteNodeCommand} ${viteNodeArgs.join(' ')}`)
		execSync(`${viteNodeCommand} ${viteNodeArgs.join(' ')}`, {
			stdio: 'inherit',
		})
	} catch (e) {
		console.log('execution fail')
	}
}

const resolveScriptExecutable = async (script) => {
	// 1. Check if it's a direct path to a file
	if (existsSync(script)) {
		return script
	}

	// 2. Check in local node_modules/.bin
	const localBin = join(process.cwd(), 'node_modules', '.bin', script)
	if (existsSync(localBin)) {
		return localBin
	}

	// 3. Check in global path
	return which(script, { nothrow: true })
}

const main = async () => {
	const [, , ...args] = process.argv

	if (args.length === 0) {
		console.error('Usage: run-vite <command> [args...]')
		process.exit(1)
	}

	const pm = await detect()
	if (!pm) throw new Error('Could not detect package manager')

	// todo: there are essentially 3 scenarios
	// ./script.ts we can just call it directly (runlocalscript)
	// pnpm run local-cli  (runtempscript w run)
	// pnpm dlx remote-cli (runtempscript w dlx)
	console.log(existsSync(args[[0]]) ? '###local' : '###temp')
	const fn = existsSync(args[[0]]) ? runLocalScript : runTempScript
	fn(pm, args)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
