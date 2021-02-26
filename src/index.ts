import { structUtils } from '@yarnpkg/core'

import {
    getContext,
    getDependenciesByWorkspaceMap,
    getImportsByWorkspaceMap,
    getUndeclaredDependencies,
    getUnusedDependencies,
} from './utils'
import { Arguments } from './types'

interface Report {
    unusedDependencies: Map<string, Set<string>>
    undeclaredDependencies: Map<string, Set<string>>
}

export default async function validateDependencies({
    cwd,
}: Arguments): Promise<Report> {
    if (!cwd) cwd = process.cwd()

    const context = await getContext(cwd)
    const dependenciesMap = await getDependenciesByWorkspaceMap(context)
    const importsMap = await getImportsByWorkspaceMap(context)

    const undeclaredDependenciesMap = new Map()
    const unusedDependenciesMap = new Map()
    for (const workspace of context.project.workspaces) {
        if (!workspace.manifest?.name) throw new Error('MISSING_IDENT')

        const workspaceIdent = structUtils.stringifyIdent(
            workspace.manifest.name,
        )
        const workspaceDependencies =
            dependenciesMap.get(workspace) ?? new Set()
        const workspaceImports = importsMap.get(workspace) ?? new Set()

        const undeclaredDependencies = getUndeclaredDependencies(
            workspaceDependencies,
            workspaceImports,
        )
        const unusedDependencies = getUnusedDependencies(
            workspaceDependencies,
            workspaceImports,
        )

        undeclaredDependenciesMap.set(workspaceIdent, undeclaredDependencies)
        unusedDependenciesMap.set(workspaceIdent, unusedDependencies)
    }

    for (const workspace of context.project.workspaces) {
        if (!workspace.manifest?.name) throw new Error('MISSING_IDENT')
        const ident = structUtils.stringifyIdent(workspace.manifest.name)
        const undeclared = undeclaredDependenciesMap.get(ident)

        console.log(ident)
        if (!undeclared.size) console.log('➝ No undeclared dependencies')
        else console.log([...undeclared].join('\n'))
    }

    return {
        undeclaredDependencies: undeclaredDependenciesMap,
        unusedDependencies: unusedDependenciesMap,
    }
}
