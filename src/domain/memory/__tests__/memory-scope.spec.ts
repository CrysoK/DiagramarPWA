import { describe, it, expect } from 'vitest'
import { MemoryScope } from '../memory-scope'
import { createBooleanValue, createIntegerValue, createRealValue } from '../runtime-value'
import { TypeMismatchError, UndefinedVariableError } from '../../errors/runtime-error'

describe('MemoryScope', () => {
  it('crea variables implícitamente y registra mutaciones', () => {
    const scope = new MemoryScope('global')
    const val10 = createIntegerValue(10)

    const mut1 = scope.setVariableValue('total', val10)
    expect(mut1.variableName).toBe('total')
    expect(mut1.writerScopeName).toBe('global')
    expect(mut1.ownerScopeName).toBe('global')
    expect(mut1.previousValue).toBeNull()
    expect(mut1.newValue).toEqual(val10)

    expect(scope.getVariableValue('total')).toEqual(val10)

    // Reasignación
    const val20 = createIntegerValue(20)
    const mut2 = scope.setVariableValue('total', val20)
    expect(mut2.previousValue).toEqual(val10)
    expect(mut2.newValue).toEqual(val20)
    expect(scope.getVariableValue('total')).toEqual(val20)
  })

  it('la asignación muta el símbolo resuelto y registra escritor y dueño', () => {
    const root = new MemoryScope('global')
    root.setVariableValue('x', createIntegerValue(100))

    const child = new MemoryScope('bloque1', root)
    const mut = child.setVariableValue('x', createIntegerValue(200))

    expect(mut.writerScopeName).toBe('bloque1')
    expect(mut.ownerScopeName).toBe('global')
    expect(root.getVariableValue('x')).toEqual(createIntegerValue(200))
  })

  it('lanza UndefinedVariableError al leer identificador no declarado', () => {
    const scope = new MemoryScope('global')
    expect(() => scope.getVariableValue('noExiste')).toThrow(UndefinedVariableError)
  })

  it('genera ScopeSnapshot inmutable y congelado', () => {
    const scope = new MemoryScope('global')
    scope.setVariableValue('a', createIntegerValue(1))
    scope.setVariableValue('b', createIntegerValue(2))

    const snapshot = scope.getSnapshot()
    scope.setVariableValue('a', createIntegerValue(99))
    expect(snapshot.name).toBe('global')
    expect(snapshot.variables.get('a')).toEqual(createIntegerValue(1))
    expect(snapshot.variables.get('b')).toEqual(createIntegerValue(2))
    expect(Object.isFrozen(snapshot)).toBe(true)
    expect(Object.isFrozen(snapshot.variables)).toBe(true)
  })

  it('impide reasignar un tipo incompatible a una variable existente en el ámbito', () => {
    const scope = new MemoryScope('global')
    scope.setVariableValue('contador', createIntegerValue(0))

    // Reasignar un booleano a una variable entera previa debe fallar
    expect(() => scope.setVariableValue('contador', createBooleanValue(true))).toThrow(
      TypeMismatchError,
    )
  })

  it('registra el valor almacenado tras promocionar INTEGER a REAL', () => {
    const scope = new MemoryScope('global')
    scope.setVariableValue('promedio', createRealValue(0))
    const mut = scope.setVariableValue('promedio', createIntegerValue(10))
    expect(mut.newValue).toEqual(createRealValue(10))
    expect(scope.getVariableValue('promedio')).toEqual(createRealValue(10))
  })
})
