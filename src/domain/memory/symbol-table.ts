import type { DataType } from './data-type'
import type { RuntimeValue } from './runtime-value'
import { MemoryCell } from './memory-cell'
import { Symbol } from './symbol'
import { DuplicateSymbolError } from '../errors'

export class SymbolTable {
  private readonly _symbols: Map<string, Symbol> = new Map()
  private _cellCounter = 0

  define(name: string, type: DataType, initialValue: RuntimeValue, scopeName: string): Symbol {
    if (this._symbols.has(name)) {
      throw new DuplicateSymbolError(name, scopeName)
    }
    const cell = new MemoryCell(`cell_${name}_${++this._cellCounter}`, initialValue)
    const symbol = new Symbol(name, type, cell, scopeName)
    this._symbols.set(name, symbol)
    return symbol
  }

  lookup(name: string): Symbol | null {
    return this._symbols.get(name) ?? null
  }

  has(name: string): boolean {
    return this._symbols.has(name)
  }

  getAllSymbols(): Symbol[] {
    return Array.from(this._symbols.values())
  }
}
