import type { BinaryOperator, UnaryOperator } from './tokens'
import type { RuntimeValue, NumberValue, IntegerValue, BooleanValue } from '../memory/runtime-value'
import {
  createIntegerValue,
  createRealValue,
  createBooleanValue,
  createStringValue,
  isIntegerValue,
  isNumberValue,
  isBooleanValue,
  isStringValue,
  isCharValue,
} from '../memory/runtime-value'
import {
  DivisionByZeroError,
  TypeMismatchError,
  InvalidOperationError,
} from '../errors/runtime-error'

export type UnaryOperation = (operand: RuntimeValue) => RuntimeValue
export type BinaryOperation = (left: RuntimeValue, right: RuntimeValue) => RuntimeValue

function numericResult(left: RuntimeValue, right: RuntimeValue, result: number): RuntimeValue {
  if (isIntegerValue(left) && isIntegerValue(right) && Number.isInteger(result)) {
    return createIntegerValue(result)
  }
  return createRealValue(result)
}

function assertNumberValue(val: RuntimeValue, context: string): asserts val is NumberValue {
  if (!isNumberValue(val)) {
    throw new TypeMismatchError('INTEGER o REAL', val.type.kind, context)
  }
}

function assertIntegerValue(val: RuntimeValue, context: string): asserts val is IntegerValue {
  if (!isIntegerValue(val)) {
    throw new TypeMismatchError('INTEGER', val.type.kind, context)
  }
}

function assertBoolean(val: RuntimeValue, context: string): asserts val is BooleanValue {
  if (!isBooleanValue(val)) {
    throw new TypeMismatchError('BOOLEAN', val.type.kind, context)
  }
}

export const UNARY_OPS: Record<UnaryOperator, UnaryOperation> = {
  NOT(operand) {
    assertBoolean(operand, "operador unario 'NOT'")
    return createBooleanValue(!operand.value)
  },
  PLUS(operand) {
    if (!isNumberValue(operand)) {
      throw new TypeMismatchError('INTEGER o REAL', operand.type.kind, "operador unario 'PLUS'")
    }
    return operand
  },
  MINUS(operand) {
    if (!isNumberValue(operand)) {
      throw new TypeMismatchError('INTEGER o REAL', operand.type.kind, "operador unario 'MINUS'")
    }
    const negated = -operand.value
    return isIntegerValue(operand) ? createIntegerValue(negated) : createRealValue(negated)
  },
}

export const BINARY_OPS: Record<Exclude<BinaryOperator, 'AND' | 'OR'>, BinaryOperation> = {
  ADD(left, right) {
    if (isNumberValue(left) && isNumberValue(right)) {
      return numericResult(left, right, left.value + right.value)
    }
    if (isStringValue(left) && isStringValue(right)) {
      return createStringValue(left.value + right.value)
    }
    throw new TypeMismatchError(
      'INTEGER/REAL o STRING/STRING',
      `${left.type.kind}, ${right.type.kind}`,
      "operador 'ADD'",
    )
  },

  SUB(left, right) {
    assertNumberValue(left, "operador 'SUB'")
    assertNumberValue(right, "operador 'SUB'")
    return numericResult(left, right, left.value - right.value)
  },

  MUL(left, right) {
    assertNumberValue(left, "operador 'MUL'")
    assertNumberValue(right, "operador 'MUL'")
    return numericResult(left, right, left.value * right.value)
  },

  DIV(left, right) {
    assertNumberValue(left, "operador 'DIV'")
    assertNumberValue(right, "operador 'DIV'")
    if (right.value === 0) {
      throw new DivisionByZeroError('DIV')
    }
    if (isIntegerValue(left) && isIntegerValue(right)) {
      return createIntegerValue(Math.trunc(left.value / right.value))
    }
    return createRealValue(left.value / right.value)
  },

  IDIV(left, right) {
    assertIntegerValue(left, "operador 'IDIV'")
    assertIntegerValue(right, "operador 'IDIV'")
    if (right.value === 0) {
      throw new DivisionByZeroError('IDIV')
    }
    return createIntegerValue(Math.trunc(left.value / right.value))
  },

  MOD(left, right) {
    assertIntegerValue(left, "operador 'MOD'")
    assertIntegerValue(right, "operador 'MOD'")
    if (right.value === 0) {
      throw new DivisionByZeroError('MOD')
    }
    return createIntegerValue(left.value % right.value)
  },

  POW(left, right) {
    assertNumberValue(left, "operador 'POW'")
    assertNumberValue(right, "operador 'POW'")
    const result = Math.pow(left.value, right.value)
    if (Number.isNaN(result)) {
      throw new InvalidOperationError('La potenciación produjo un resultado no numérico (NaN).')
    }
    if (
      isIntegerValue(left) &&
      isIntegerValue(right) &&
      right.value >= 0 &&
      Number.isInteger(result)
    ) {
      return createIntegerValue(result)
    }
    return createRealValue(result)
  },

  EQ(left, right) {
    return createBooleanValue(areOperandsEqual(left, right))
  },

  NE(left, right) {
    return createBooleanValue(!areOperandsEqual(left, right))
  },

  LT(left, right) {
    return createBooleanValue(compareOrdered(left, right, 'LT') < 0)
  },

  LE(left, right) {
    return createBooleanValue(compareOrdered(left, right, 'LE') <= 0)
  },

  GT(left, right) {
    return createBooleanValue(compareOrdered(left, right, 'GT') > 0)
  },

  GE(left, right) {
    return createBooleanValue(compareOrdered(left, right, 'GE') >= 0)
  },
}

function areOperandsEqual(left: RuntimeValue, right: RuntimeValue): boolean {
  if (isNumberValue(left) && isNumberValue(right)) {
    return left.value === right.value
  }
  if (left.type.kind !== right.type.kind) {
    throw new TypeMismatchError(left.type.kind, right.type.kind, "operador relacional 'EQ'/'NE'")
  }
  return left.value === right.value
}

function compareOrdered(left: RuntimeValue, right: RuntimeValue, operator: string): number {
  if (isNumberValue(left) && isNumberValue(right)) {
    return left.value === right.value ? 0 : left.value < right.value ? -1 : 1
  }
  if ((isStringValue(left) && isStringValue(right)) || (isCharValue(left) && isCharValue(right))) {
    return left.value < right.value ? -1 : left.value > right.value ? 1 : 0
  }
  throw new TypeMismatchError(
    'INTEGER, REAL, CHAR o STRING (pareja homogénea)',
    `${left.type.kind}, ${right.type.kind}`,
    `operador relacional '${operator}'`,
  )
}

export function applyUnary(operator: UnaryOperator, operand: RuntimeValue): RuntimeValue {
  return UNARY_OPS[operator](operand)
}

export function applyBinary(
  operator: Exclude<BinaryOperator, 'AND' | 'OR'>,
  left: RuntimeValue,
  right: RuntimeValue,
): RuntimeValue {
  return BINARY_OPS[operator](left, right)
}
