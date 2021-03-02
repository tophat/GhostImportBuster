import chalk from 'chalk'

import { Report } from './types'

export default function printReport(report: Report): void {
    for (const workspaceIdent of report.workspaces) {
        const unused = report.unusedDependencies.get(workspaceIdent)
        const undeclared = report.undeclaredDependencies.get(workspaceIdent)

        console.log(`📦 ${workspaceIdent}`)

        if (unused && unused.size > 0) {
            console.log(
                chalk.yellow(
                    'Unused dependencies (declared but not imported anywhere)',
                ),
            )
            unused.forEach((dependency) => {
                console.log(`→ ${dependency}`)
            })
        } else {
            console.log(chalk.green('No unused dependencies!'))
        }
        if (undeclared && undeclared.size > 0) {
            console.log(
                chalk.red(
                    'Undeclared dependencies (imported but not declared in package.json)',
                ),
            )
            undeclared.forEach((dependency) => {
                console.log(`→ ${dependency}`)
            })
        } else {
            console.log(chalk.green('No undeclared dependencies!'))
        }
    }
}
