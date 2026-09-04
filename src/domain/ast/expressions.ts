import type { UnaryOperator, BinaryOperator } from './tokens'
import type { RuntimeValue } from '../memory/runtime-value'
import { createBooleanValue, isBooleanValue } from '../memory/runtime-value'
import type { MemoryScope } from '../memory/memory-scope'
import { generateNodeId, type ASTNode } from './ast-node'
import { applyUnary, applyBinary } from './operators'
import { TypeMismatchError } from '../errors/runtime-error'

export type { UnaryOperator, BinaryOperator }

export interface ExpressionNode extends ASTNode {
  evaluate(scope: MemoryScope): RuntimeValue
}

export class LiteralNode implements ExpressionNode {
  readonly id: string
  readonly line: number | null
  readonly value: RuntimeValue

  constructor(value: RuntimeValue, line: number | null = null, id?: string) {
    this.id = id ?? generateNodeId('lit')
    this.line = line
    this.value = value
  }

  evaluate(_scope: MemoryScope): RuntimeValue {
    return this.value
  }
}

export class VariableRefNode implements ExpressionNode {
  readonly id: string
  readonly line: number | null
  readonly identifier: string

  constructor(identifier: string, line: number | null = null, id?: string) {
    this.id = id ?? generateNodeId('var')
    this.line = line
    this.identifier = identifier
  }

  evaluate(scope: MemoryScope): RuntimeValue {
    return scope.getVariableValue(this.identifier)
  }
}

export class UnaryOpNode implements ExpressionNode {
  readonly id: string
  readonly line: number | null
  readonly operator: UnaryOperator
  readonly expression: ExpressionNode

  constructor(
    operator: UnaryOperator,
    expression: ExpressionNode,
    line: number | null = null,
    id?: string,
  ) {
    this.id = id ?? generateNodeId('unop')
    this.line = line
    this.operator = operator
    this.expression = expression
  }

  evaluate(scope: MemoryScope): RuntimeValue {
    return applyUnary(this.operator, this.expression.evaluate(scope))
  }
}

export class BinaryOpNode implements ExpressionNode {
  readonly id: string
  readonly line: number | null
  readonly operator: BinaryOperator
  readonly left: ExpressionNode
  readonly right: ExpressionNode

  constructor(
    operator: BinaryOperator,
    left: ExpressionNode,
    right: ExpressionNode,
    line: number | null = null,
    id?: string,
  ) {
    this.id = id ?? generateNodeId('binop')
    this.line = line
    this.operator = operator
    this.left = left
    this.right = right
  }

  evaluate(scope: MemoryScope): RuntimeValue {
    if (this.operator === 'AND' || this.operator === 'OR') {
      return this.evaluateShortCircuit(scope)
    }

    const left = this.left.evaluate(scope)
    const right = this.right.evaluate(scope)
    return applyBinary(this.operator, left, right)
  }

  private evaluateShortCircuit(scope: MemoryScope): RuntimeValue {
    const left = this.left.evaluate(scope)
    if (!isBooleanValue(left)) {
      throw new TypeMismatchError('BOOLEAN', left.type.kind, `operador lógico '${this.operator}'`)
    }

    if (this.operator === 'AND' && !left.value) {
      return createBooleanValue(false)
    }
    if (this.operator === 'OR' && left.value) {
      return createBooleanValue(true)
    }

    const right = this.right.evaluate(scope)
    if (!isBooleanValue(right)) {
      throw new TypeMismatchError('BOOLEAN', right.type.kind, `operador lógico '${this.operator}'`)
    }
    return right
  }
}
