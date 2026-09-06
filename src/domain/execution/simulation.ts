import { ExecutionContext, type NextAction, type ProgramNode, type StatementNode } from '../ast'
import { InvalidOperationError } from '../errors'
import { MemoryScope, MemorySnapshot } from '../memory'
import { ExecutionFrame } from './execution-frame'
import { ExecutionStep } from './execution-step'
import { ExecutionTrace } from './execution-trace'
import type { ExecutionMode, SimulationStatus, TraceSummary } from './types'

export class Simulation {
  private status: SimulationStatus
  private readonly mode: ExecutionMode
  private readonly executionStack: ExecutionFrame[]
  private readonly rootScope: MemoryScope
  private readonly trace: ExecutionTrace

  constructor(program: ProgramNode, mode: ExecutionMode) {
    this.mode = mode
    this.status = 'RUNNING'
    this.executionStack = []
    this.rootScope = new MemoryScope('global')
    this.trace = new ExecutionTrace()
    this.initExecutionStack(program.getBody().getStatements())

    const snapshot = this.captureMemorySnapshot()
    const isFinished = this.executionStack.length === 0
    if (isFinished) {
      this.status = 'FINISHED'
    }
    this.trace.recordStep(new ExecutionStep(0, null, snapshot, undefined, isFinished))
  }

  getStatus(): SimulationStatus {
    return this.status
  }

  getMode(): ExecutionMode {
    return this.mode
  }

  getLastStep(): ExecutionStep {
    return this.trace.getLastStep()
  }

  step(): ExecutionStep {
    this.assertRunning()

    const currentStmt = this.peek().getCurrentStatement()
    if (currentStmt === null) {
      throw new InvalidOperationError('El marco activo no tiene sentencia actual.')
    }

    let execResult
    try {
      execResult = currentStmt.execute(new ExecutionContext(this.rootScope))
    } catch (error) {
      this.status = 'ERROR'
      throw error
    }

    this.handleNextAction(execResult.nextAction)

    const snapshot = this.captureMemorySnapshot()
    const isFinished = this.executionStack.length === 0
    if (isFinished) {
      this.status = 'FINISHED'
    }

    const next = new ExecutionStep(
      this.trace.getLastStep().stepNumber + 1,
      currentStmt,
      snapshot,
      execResult,
      isFinished,
    )

    this.trace.recordStep(next)
    return next
  }

  getMemorySnapshot(stepNumber?: number): MemorySnapshot {
    const step =
      stepNumber === undefined ? this.trace.getLastStep() : this.trace.getStep(stepNumber)
    return step.getMemorySnapshot()
  }

  stop(): void {
    if (this.status !== 'RUNNING' && this.status !== 'PAUSED') {
      throw new InvalidOperationError(
        `No se puede detener una simulación en estado '${this.status}'.`,
      )
    }
    this.status = 'STOPPED'
  }

  getSummary(): TraceSummary {
    return this.trace.getSummary()
  }

  private initExecutionStack(statements: readonly StatementNode[]): void {
    this.executionStack.push(new ExecutionFrame(statements))
    this.discardFinishedFrames()
  }

  private captureMemorySnapshot(): MemorySnapshot {
    return new MemorySnapshot([this.rootScope.getSnapshot()])
  }

  private handleNextAction(action: NextAction): void {
    const current = this.peek()
    switch (action.type) {
      case 'ADVANCE':
        current.advance()
        break
      case 'PUSH_FRAME':
        this.executionStack.push(new ExecutionFrame(action.statements))
        break
      case 'PUSH_AND_ADVANCE':
        current.advance()
        this.executionStack.push(new ExecutionFrame(action.statements))
    }
    this.discardFinishedFrames()
  }

  private discardFinishedFrames(): void {
    while (this.executionStack.length > 0 && this.peek().isFinished()) {
      this.executionStack.pop()
    }
  }

  private peek(): ExecutionFrame {
    const frame = this.executionStack[this.executionStack.length - 1]
    if (frame === undefined) {
      throw new InvalidOperationError('La pila de ejecución está vacía.')
    }
    return frame
  }

  private assertRunning(): void {
    if (this.status !== 'RUNNING') {
      throw new InvalidOperationError(
        `No se puede avanzar una simulación en estado '${this.status}'.`,
      )
    }
  }
}
