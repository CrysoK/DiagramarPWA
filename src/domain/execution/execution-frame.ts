import type { StatementNode } from '../ast'

export class ExecutionFrame {
  private readonly statements: readonly StatementNode[]
  private index: number

  constructor(statements: readonly StatementNode[]) {
    this.statements = Object.freeze([...statements])
    this.index = 0
  }

  getCurrentStatement(): StatementNode | null {
    return this.statements[this.index] ?? null
  }

  advance(): void {
    if (!this.isFinished()) {
      this.index += 1
    }
  }

  isFinished(): boolean {
    return this.index >= this.statements.length
  }

  getIndex(): number {
    return this.index
  }
}
