#!/usr/bin/env node

import yargs from 'yargs'

import validateDependencies from '.'

const argv = yargs(process.argv.slice(2))
    .usage('ghostimports [projectRootPath]')
    .option('cwd', {
        type: 'string',
        description: 'Project root',
    })
    .option('includeFiles', {
        type: 'array',
        description: 'Paths to include in the analysis',
    })
    .option('excludeFiles', {
        type: 'array',
        description: 'Paths to exclude from the analysis',
    })
    .option('excludePackages', {
        type: 'array',
        description: 'Package names to exclude from the analysis',
    })
    .option('devFiles', {
        type: 'array',
        description: 'Paths to mark as dev files',
    })
    .option('skipRoot', {
        type: 'boolean',
        description: 'Whether to skip over root workspace',
    })
    .option('fix', {
        type: 'boolean',
        description: 'Attempt to fix package.json based on analysis',
    }).argv

validateDependencies({
    cwd: argv.cwd,
    includeFiles: argv.includeFies as string[],
    excludeFiles: argv.excludeFiles as string[],
    devFiles: argv.devFiles as string[],
    excludePackages: argv.excludePackages as string[],
    fix: argv.fix,
    skipRoot: argv.skipRoot,
}).catch((e) => {
    console.log(e)
    process.exit(1)
})
