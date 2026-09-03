import { describe, it, expect } from 'vitest'
import {
  createIntegerValue,
  createRealValue,
  createBooleanValue,
  createCharValue,
  createStringValue,
  areValuesEqual,
  stringifyRuntimeValue,
} from '../runtime-value'

describe('RuntimeValue (Tagged Unions)', () => {
  it('crea valores enteros inmutables y valida enteros puros', () => {
    const intVal = createIntegerValue(42)
    expect(intVal.type.kind).toBe('INTEGER')
    expect(intVal.value).toBe(42)
    expect(Object.isFrozen(intVal)).toBe(true)
    expect(Object.isFrozen(intVal.type)).toBe(true)

    expect(() => createIntegerValue(3.14)).toThrow(TypeError)
    expect(() => createIntegerValue(Infinity)).toThrow(TypeError)
  })

  it('crea valores reales inmutables', () => {
    const realVal = createRealValue(3.14159)
    expect(realVal.type.kind).toBe('REAL')
    expect(realVal.value).toBe(3.14159)
    expect(Object.isFrozen(realVal)).toBe(true)
    expect(Object.isFrozen(realVal.type)).toBe(true)

    expect(createRealValue(Infinity).value).toBe(Infinity)
    expect(createRealValue(-Infinity).value).toBe(-Infinity)
    expect(() => createRealValue(NaN)).toThrow(TypeError)
  })

  it('crea valores booleanos inmutables', () => {
    const boolVal = createBooleanValue(true)
    expect(boolVal.type.kind).toBe('BOOLEAN')
    expect(boolVal.value).toBe(true)
    expect(Object.isFrozen(boolVal)).toBe(true)
    expect(Object.isFrozen(boolVal.type)).toBe(true)
  })

  it('crea caracteres inmutables exigiendo longitud exacta de 1', () => {
    const charVal = createCharValue('A')
    expect(charVal.type.kind).toBe('CHAR')
    expect(charVal.value).toBe('A')
    expect(Object.isFrozen(charVal)).toBe(true)
    expect(Object.isFrozen(charVal.type)).toBe(true)

    expect(() => createCharValue('AB')).toThrow(TypeError)
    expect(() => createCharValue('')).toThrow(TypeError)
  })

  it('crea cadenas de texto inmutables', () => {
    const strVal = createStringValue('Hola Mundo')
    expect(strVal.type.kind).toBe('STRING')
    expect(strVal.value).toBe('Hola Mundo')
    expect(Object.isFrozen(strVal)).toBe(true)
    expect(Object.isFrozen(strVal.type)).toBe(true)
  })

  it('compara igualdad de valores considerando tipo y contenido', () => {
    const a = createIntegerValue(10)
    const b = createIntegerValue(10)
    const c = createIntegerValue(20)
    const d = createRealValue(10)

    expect(areValuesEqual(a, b)).toBe(true)
    expect(areValuesEqual(a, c)).toBe(false)
    expect(areValuesEqual(a, d)).toBe(false)
  })

  it('convierte valores a representación en cadena legible', () => {
    expect(stringifyRuntimeValue(createIntegerValue(100))).toBe('100')
    expect(stringifyRuntimeValue(createBooleanValue(false))).toBe('false')
    expect(stringifyRuntimeValue(createStringValue('Test'))).toBe('Test')
  })
})
