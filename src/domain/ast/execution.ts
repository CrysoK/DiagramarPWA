import type { MemoryScope, MutationRecord } from '../memory'
import type { StatementNode } from './statements'

export interface MemoryDestination {
  readonly identifier: string
}

export class ExecutionContext {
  readonly scope: MemoryScope

  constructor(scope: MemoryScope) {
    this.scope = scope
  }
}

export type NextAction =
  | { readonly type: 'ADVANCE' }
  | { readonly type: 'PUSH_FRAME'; readonly statements: readonly StatementNode[] }
  | { readonly type: 'PUSH_AND_ADVANCE'; readonly statements: readonly StatementNode[] }

export function actionAdvance(): NextAction {
  return Object.freeze({ type: 'ADVANCE' as const })
}

export function actionPushFrame(statements: readonly StatementNode[]): NextAction {
  return Object.freeze({
    type: 'PUSH_FRAME' as const,
    statements: Object.freeze([...statements]),
  })
}
export function actionPushAndAdvance(statements: readonly StatementNode[]): NextAction {
  return Object.freeze({
    type: 'PUSH_AND_ADVANCE' as const,
    statements: Object.freeze([...statements]),
  })
}

export interface ExecutionResult {
  readonly mutations: readonly MutationRecord[]
  readonly nextAction: NextAction
}

export function buildResult(
  mutations: readonly MutationRecord[],
  nextAction: NextAction,
): ExecutionResult {
  return Object.freeze({
    mutations: Object.freeze([...mutations]),
    nextAction,
  })
}
