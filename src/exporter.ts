import * as core from '@actions/core'

export type ExportFunc = (name: string, val: string) => void

export function getExporters(input: string, prefix = ''): ExportFunc[] {
  const targets = input.split(',')
  const exporters: ExportFunc[] = []
  for (const target of targets) {
    switch (target) {
      case 'log':
        exporters.push(withPrefix(exportLog, prefix))
        break
      case 'env':
        exporters.push(withPrefix(core.exportVariable, prefix))
        break
      case 'output':
        exporters.push(withPrefix(core.setOutput, prefix))
        break
      default:
        throw new Error(`Unexpected export type: ${target}`)
    }
  }
  return exporters
}

export function exportLog(name: string, val: string): void {
  core.info(`export ${name}: ${val}`)
}

function withPrefix(fn: ExportFunc, prefix: string): ExportFunc {
  if (!prefix) return fn
  return (name, val) => fn(`${prefix}${name}`, val)
}
