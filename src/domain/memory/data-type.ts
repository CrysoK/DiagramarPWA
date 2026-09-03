export type SimpleType = 'INTEGER' | 'REAL' | 'BOOLEAN' | 'CHAR' | 'STRING'

export interface DataType {
  readonly kind: SimpleType
}

export function createDataType(kind: SimpleType): DataType {
  return Object.freeze({ kind })
}

export function areTypesEqual(a: DataType, b: DataType): boolean {
  return a.kind === b.kind
}

export function isTypeAssignable(target: DataType, source: DataType): boolean {
  if (areTypesEqual(target, source)) {
    return true
  }

  if (target.kind === 'REAL' && source.kind === 'INTEGER') {
    return true
  }

  return false
}
