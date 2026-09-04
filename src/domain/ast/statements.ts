import { TypeMismatchError } from '../errors'
import { isBooleanValue, type BooleanValue, type RuntimeValue } from '../memory'
import { generateNodeId, type ASTNode } from './ast-node'
import {
  actionAdvance,
  actionPushAndAdvance,
  actionPushFrame,
  buildResult,
  type ExecutionContext,
  type ExecutionResult,
  type MemoryDestination,
} from './execution'
import type { ExpressionNode } from './expressions'

export interface StatementNode extends ASTNode {
  execute(context: ExecutionContext): ExecutionResult
}

function assertBooleanCondition(
  value: RuntimeValue,
  context: string,
): asserts value is BooleanValue {
  if (!isBooleanValue(value)) {
    throw new TypeMismatchError('BOOLEAN', value.type.kind, context)
  }
}

export class SequenceNode implements ASTNode {
  readonly id: string
  readonly line: number | null
  private readonly statements: readonly StatementNode[]

  constructor(statements: readonly StatementNode[] = [], line: number | null = null, id?: string) {
    this.id = id ?? generateNodeId('seq')
    this.line = line
    this.statements = Object.freeze([...statements])
  }

  getStatements(): readonly StatementNode[] {
    return this.statements
  }
}

export class ProgramNode implements ASTNode {
  readonly id: string
  readonly line: number | null
  readonly name: string
  private readonly body: SequenceNode

  constructor(name: string, body: SequenceNode, line: number | null = null, id?: string) {
    this.id = id ?? generateNodeId('prog')
    this.line = line
    this.name = name
    this.body = body
  }

  getBody(): SequenceNode {
    return this.body
  }
}

export class AssignmentNode implements StatementNode {
  readonly id: string
  readonly line: number | null
  readonly target: MemoryDestination
  readonly expression: ExpressionNode

  constructor(
    target: MemoryDestination,
    expression: ExpressionNode,
    line: number | null = null,
    id?: string,
  ) {
    this.id = id ?? generateNodeId('assign')
    this.line = line
    this.target = target
    this.expression = expression
  }

  execute(context: ExecutionContext): ExecutionResult {
    const value = this.expression.evaluate(context.scope)
    const mutation = context.scope.setVariableValue(this.target.identifier, value)
    return buildResult([mutation], actionAdvance())
  }
}

export class IfNode implements StatementNode {
  readonly id: string
  readonly line: number | null
  readonly condition: ExpressionNode
  readonly trueBranch: SequenceNode
  readonly falseBranch: SequenceNode | null

  constructor(
    condition: ExpressionNode,
    trueBranch: SequenceNode,
    falseBranch: SequenceNode | null = null,
    line: number | null = null,
    id?: string,
  ) {
    this.id = id ?? generateNodeId('if')
    this.line = line
    this.condition = condition
    this.trueBranch = trueBranch
    this.falseBranch = falseBranch
  }

  execute(context: ExecutionContext): ExecutionResult {
    const result = this.condition.evaluate(context.scope)
    assertBooleanCondition(result, 'condición de If')

    if (result.value) {
      return buildResult([], actionPushAndAdvance(this.trueBranch.getStatements()))
    }
    if (this.falseBranch !== null) {
      return buildResult([], actionPushAndAdvance(this.falseBranch.getStatements()))
    }
    return buildResult([], actionAdvance())
  }
}

export class WhileNode implements StatementNode {
  readonly id: string
  readonly line: number | null
  readonly condition: ExpressionNode
  readonly body: SequenceNode

  constructor(
    condition: ExpressionNode,
    body: SequenceNode,
    line: number | null = null,
    id?: string,
  ) {
    this.id = id ?? generateNodeId('while')
    this.line = line
    this.condition = condition
    this.body = body
  }

  execute(context: ExecutionContext): ExecutionResult {
    const result = this.condition.evaluate(context.scope)
    assertBooleanCondition(result, 'condición de While')

    if (result.value) {
      return buildResult([], actionPushFrame(this.body.getStatements()))
    }
    return buildResult([], actionAdvance())
  }
}
