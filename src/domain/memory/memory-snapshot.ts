import type { RuntimeValue } from './runtime-value'

export class ScopeSnapshot {
  readonly name: string
  readonly variables: ReadonlyMap<string, RuntimeValue>

  constructor(name: string, variables: Map<string, RuntimeValue>) {
    this.name = name
    this.variables = Object.freeze(new Map(variables))
    Object.freeze(this)
  }
}

export class MemorySnapshot {
  readonly scopes: readonly ScopeSnapshot[]

  constructor(scopes: ScopeSnapshot[]) {
    this.scopes = Object.freeze([...scopes])
    Object.freeze(this)
  }

  getScope(name: string): ScopeSnapshot | null {
    return this.scopes.find((s) => s.name === name) ?? null
  }
}
