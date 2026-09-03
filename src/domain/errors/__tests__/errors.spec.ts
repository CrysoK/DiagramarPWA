import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryScope } from '../../memory/memory-scope'
import {
  createIntegerValue,
  createRealValue,
  createStringValue,
  createBooleanValue,
} from '../../memory/runtime-value'
import {
  LiteralNode,
  VariableRefNode,
  UnaryOpNode,
  BinaryOpNode,
  type ExpressionNode,
} from '../../ast/expressions'
import {
  DivisionByZeroError,
  TypeMismatchError,
  UndefinedVariableError,
  InvalidOperationError,
} from '../runtime-error'

describe('Errores semánticos en la evaluación de expresiones', () => {
  let scope: MemoryScope

  beforeEach(() => {
    scope = new MemoryScope('global')
  })

  function evaluate(node: ExpressionNode) {
    return node.evaluate(scope)
  }

  it('lanza DivisionByZeroError en DIV, IDIV y MOD por cero', () => {
    expect(() =>
      evaluate(
        new BinaryOpNode(
          'DIV',
          new LiteralNode(createIntegerValue(10)),
          new LiteralNode(createIntegerValue(0)),
        ),
      ),
    ).toThrow(DivisionByZeroError)

    expect(() =>
      evaluate(
        new BinaryOpNode(
          'MOD',
          new LiteralNode(createIntegerValue(10)),
          new LiteralNode(createIntegerValue(0)),
        ),
      ),
    ).toThrow(DivisionByZeroError)

    expect(() =>
      evaluate(
        new BinaryOpNode(
          'IDIV',
          new LiteralNode(createIntegerValue(10)),
          new LiteralNode(createIntegerValue(0)),
        ),
      ),
    ).toThrow(DivisionByZeroError)
  })

  it('evalúa el derecho de AND cuando el izquierdo es verdadero y propaga división por cero', () => {
    const boom = new BinaryOpNode(
      'DIV',
      new LiteralNode(createIntegerValue(10)),
      new LiteralNode(createIntegerValue(0)),
    )
    expect(() =>
      evaluate(new BinaryOpNode('AND', new LiteralNode(createBooleanValue(true)), boom)),
    ).toThrow(DivisionByZeroError)
  })

  it('lanza UndefinedVariableError al evaluar un identificador inexistente', () => {
    expect(() => evaluate(new VariableRefNode('variableInexistente'))).toThrow(
      UndefinedVariableError,
    )
  })

  it('lanza TypeMismatchError ante operandos incompatibles', () => {
    expect(() =>
      evaluate(
        new BinaryOpNode(
          'SUB',
          new LiteralNode(createStringValue('a')),
          new LiteralNode(createStringValue('b')),
        ),
      ),
    ).toThrow(TypeMismatchError)

    expect(() => evaluate(new UnaryOpNode('NOT', new LiteralNode(createIntegerValue(10))))).toThrow(
      TypeMismatchError,
    )

    expect(() =>
      evaluate(
        new BinaryOpNode(
          'AND',
          new LiteralNode(createIntegerValue(1)),
          new LiteralNode(createIntegerValue(0)),
        ),
      ),
    ).toThrow(TypeMismatchError)
  })

  it('lanza TypeMismatchError si IDIV o MOD reciben REAL', () => {
    expect(() =>
      evaluate(
        new BinaryOpNode(
          'MOD',
          new LiteralNode(createRealValue(7.5)),
          new LiteralNode(createIntegerValue(2)),
        ),
      ),
    ).toThrow(TypeMismatchError)

    expect(() =>
      evaluate(
        new BinaryOpNode(
          'IDIV',
          new LiteralNode(createIntegerValue(7)),
          new LiteralNode(createRealValue(2)),
        ),
      ),
    ).toThrow(TypeMismatchError)
  })

  it('lanza InvalidOperationError si la potenciación produce NaN', () => {
    expect(() =>
      evaluate(
        new BinaryOpNode(
          'POW',
          new LiteralNode(createIntegerValue(-1)),
          new LiteralNode(createRealValue(0.5)),
        ),
      ),
    ).toThrow(InvalidOperationError)
  })
})
