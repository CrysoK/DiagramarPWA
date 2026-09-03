import type { SimpleType } from './data-type'

export interface BaseRuntimeValue<K extends SimpleType, V> {
  readonly type: { readonly kind: K }
  readonly value: V
}

export type IntegerValue = BaseRuntimeValue<'INTEGER', number>
export type RealValue = BaseRuntimeValue<'REAL', number>
export type BooleanValue = BaseRuntimeValue<'BOOLEAN', boolean>
export type CharValue = BaseRuntimeValue<'CHAR', string>
export type StringValue = BaseRuntimeValue<'STRING', string>

export type RuntimeValue = IntegerValue | RealValue | BooleanValue | CharValue | StringValue

export function createIntegerValue(value: number): IntegerValue {
  if (!Number.isInteger(value)) {
    throw new TypeError(`El valor entero debe ser un número entero, recibido: ${value}`)
  }
  return Object.freeze({
    type: Object.freeze({ kind: 'INTEGER' as const }),
    value,
  })
}

export function createRealValue(value: number): RealValue {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError(`El valor real debe ser un número válido, recibido: ${value}`)
  }
  return Object.freeze({
    type: Object.freeze({ kind: 'REAL' as const }),
    value,
  })
}

export function createBooleanValue(value: boolean): BooleanValue {
  if (typeof value !== 'boolean') {
    throw new TypeError(`El valor booleano debe ser true o false, recibido: ${value}`)
  }
  return Object.freeze({
    type: Object.freeze({ kind: 'BOOLEAN' as const }),
    value,
  })
}

export function createCharValue(value: string): CharValue {
  if (typeof value !== 'string' || value.length !== 1) {
    throw new TypeError(`El valor carácter debe ser una cadena de longitud 1, recibido: ${value}`)
  }
  return Object.freeze({
    type: Object.freeze({ kind: 'CHAR' as const }),
    value,
  })
}

export function createStringValue(value: string): StringValue {
  if (typeof value !== 'string') {
    throw new TypeError(`El valor de cadena debe ser un texto, recibido: ${value}`)
  }
  return Object.freeze({
    type: Object.freeze({ kind: 'STRING' as const }),
    value,
  })
}

export function areValuesEqual(a: RuntimeValue, b: RuntimeValue): boolean {
  if (a.type.kind !== b.type.kind) {
    return false
  }
  return a.value === b.value
}

export function stringifyRuntimeValue(val: RuntimeValue): string {
  return String(val.value)
}

export function isIntegerValue(val: RuntimeValue): val is IntegerValue {
  return val.type.kind === 'INTEGER'
}

export function isRealValue(val: RuntimeValue): val is RealValue {
  return val.type.kind === 'REAL'
}

export function isBooleanValue(val: RuntimeValue): val is BooleanValue {
  return val.type.kind === 'BOOLEAN'
}

export function isCharValue(val: RuntimeValue): val is CharValue {
  return val.type.kind === 'CHAR'
}

export function isStringValue(val: RuntimeValue): val is StringValue {
  return val.type.kind === 'STRING'
}

export type NumberValue = IntegerValue | RealValue

export function isNumberValue(val: RuntimeValue): val is NumberValue {
  return val.type.kind === 'INTEGER' || val.type.kind === 'REAL'
}
