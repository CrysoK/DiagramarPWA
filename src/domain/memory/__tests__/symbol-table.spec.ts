import { describe, it, expect } from 'vitest'
import { SymbolTable } from '../symbol-table'
import { createIntegerValue, createRealValue, createStringValue } from '../runtime-value'
import { DuplicateSymbolError, TypeMismatchError } from '../../errors/runtime-error'

describe('SymbolTable', () => {
  it('define y busca símbolos en tiempo constante', () => {
    const table = new SymbolTable()
    const intVal = createIntegerValue(10)

    const sym = table.define('contador', { kind: 'INTEGER' }, intVal, 'global')
    expect(sym.name).toBe('contador')
    expect(sym.getValue()).toEqual(intVal)

    expect(table.has('contador')).toBe(true)
    expect(table.lookup('contador')).toBe(sym)
    expect(table.lookup('inexistente')).toBeNull()
  })

  it('permite mutar la celda física de un símbolo', () => {
    const table = new SymbolTable()
    const sym = table.define('x', { kind: 'INTEGER' }, createIntegerValue(5), 'global')

    sym.setValue(createIntegerValue(15))
    expect(sym.getValue()).toEqual(createIntegerValue(15))
  })

  it('recupera la lista de todos los símbolos definidos', () => {
    const table = new SymbolTable()
    table.define('a', { kind: 'INTEGER' }, createIntegerValue(1), 'global')
    table.define('b', { kind: 'INTEGER' }, createIntegerValue(2), 'global')

    const symbols = table.getAllSymbols()
    expect(symbols.length).toBe(2)
    expect(symbols.map((s) => s.name)).toEqual(['a', 'b'])
  })
  it('lanza TypeMismatchError si se intenta asignar un valor incompatible al símbolo', () => {
    const table = new SymbolTable()
    const sym = table.define('edad', { kind: 'INTEGER' }, createIntegerValue(20), 'global')
    // Intentar asignar un String a un Integer
    expect(() => sym.setValue(createStringValue('veinte'))).toThrow(TypeMismatchError)
  })
  it('promociona automáticamente INTEGER a REAL cuando la variable es de tipo REAL', () => {
    const table = new SymbolTable()
    const sym = table.define('promedio', { kind: 'REAL' }, createRealValue(8.5), 'global')
    sym.setValue(createIntegerValue(10))
    expect(sym.getValue()).toEqual(createRealValue(10))
    expect(sym.getValue().type.kind).toBe('REAL')
  })
  it('rechaza la re-declaración del mismo identificador', () => {
    const table = new SymbolTable()
    table.define('x', { kind: 'INTEGER' }, createIntegerValue(1), 'global')
    expect(() => {
      table.define('x', { kind: 'INTEGER' }, createIntegerValue(2), 'global')
    }).toThrow(DuplicateSymbolError)
  })
})
