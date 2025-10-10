#!/usr/bin/env node
import { resolveCommand } from 'package-manager-detector/commands'
import { detect } from 'package-manager-detector/detect'
import { spawnSync } from 'child_process'

const [, , ...args2] = process.argv;

if (args2.length === 0) {
  console.error("Usage: run-vite <command> [args...]");
  process.exit(1);
}

const pm = await detect()
if (!pm) throw new Error('Could not detect package manager')

const { command, args } = resolveCommand(
  pm.agent,
  'execute',
  [
    "vite-node",
    "--options.transformMode.ssr='/.*/'",
    ...args2]
  )

console.log(`Detected the ${pm.agent} package manager.\n\nrunning...${command} ${args.join(' ')}\n\n`)

execSync(`${command} ${args.join(" ")}`, { stdio: "inherit" })

process.exit(result.status);