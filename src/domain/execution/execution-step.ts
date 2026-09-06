import type { MemorySnapshot, MutationRecord } from '../memory'
import type { ExecutionResult } from '../ast'
import type { StatementNode } from '../ast'

export class ExecutionStep {
  readonly stepNumber: number
  readonly activeNode: StatementNode | null
  readonly mutations: readonly MutationRecord[]
  readonly isFinished: boolean
  private readonly memorySnapshot: MemorySnapshot

  constructor(
    stepNumber: number,
    activeNode: StatementNode | null,
    memorySnapshot: MemorySnapshot,
    result?: ExecutionResult,
    isFinished = false,
  ) {
    this.stepNumber = stepNumber
    this.activeNode = activeNode
    this.memorySnapshot = memorySnapshot
    this.mutations = Object.freeze([...(result?.mutations ?? [])])
    this.isFinished = isFinished
    Object.freeze(this)
  }

  getMemorySnapshot(): MemorySnapshot {
    return this.memorySnapshot
  }
}
