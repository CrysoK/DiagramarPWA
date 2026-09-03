import type { RuntimeValue } from './runtime-value'
import type { MutationRecord } from './mutation-record'
import { SymbolTable } from './symbol-table'
import { Symbol } from './symbol'
import { ScopeSnapshot } from './memory-snapshot'
import { UndefinedVariableError } from '../errors/runtime-error'

export class MemoryScope {
  readonly name: string
  private readonly _parentScope: MemoryScope | null
  private readonly _symbolTable: SymbolTable

  constructor(name: string, parentScope: MemoryScope | null = null) {
    this.name = name
    this._parentScope = parentScope
    this._symbolTable = new SymbolTable()
  }

  getParentScope(): MemoryScope | null {
    return this._parentScope
  }

  getSymbolTable(): SymbolTable {
    return this._symbolTable
  }

  resolveSymbol(identifier: string): Symbol | null {
    const local = this._symbolTable.lookup(identifier)
    if (local !== null) {
      return local
    }
    if (this._parentScope !== null) {
      return this._parentScope.resolveSymbol(identifier)
    }
    return null
  }

  hasVariable(identifier: string): boolean {
    return this.resolveSymbol(identifier) !== null
  }

  getVariableValue(identifier: string): RuntimeValue {
    const symbol = this.resolveSymbol(identifier)
    if (symbol === null) {
      throw new UndefinedVariableError(identifier, this.name)
    }
    return symbol.getValue()
  }

  setVariableValue(identifier: string, value: RuntimeValue): MutationRecord {
    const existing = this.resolveSymbol(identifier)

    if (existing !== null) {
      const previousValue = existing.getValue()
      existing.setValue(value)
      return Object.freeze({
        variableName: identifier,
        writerScopeName: this.name,
        ownerScopeName: existing.scopeName,
        previousValue,
        newValue: existing.getValue(),
      })
    }
    const created = this._symbolTable.define(identifier, value.type, value, this.name)
    return Object.freeze({
      variableName: identifier,
      writerScopeName: this.name,
      ownerScopeName: created.scopeName,
      previousValue: null,
      newValue: created.getValue(),
    })
  }

  getSnapshot(): ScopeSnapshot {
    const map = new Map<string, RuntimeValue>()
    for (const sym of this._symbolTable.getAllSymbols()) {
      map.set(sym.name, sym.getValue())
    }
    return new ScopeSnapshot(this.name, map)
  }
}
