import { InvalidOperationError } from '../errors'
import type { TraceSummary } from './types'
import type { ExecutionStep } from './execution-step'

export class ExecutionTrace {
  private readonly steps: ExecutionStep[] = []

  recordStep(step: ExecutionStep): void {
    this.steps.push(step)
  }

  getStep(stepNumber: number): ExecutionStep {
    const step = this.steps.find((s) => s.stepNumber === stepNumber)
    if (step === undefined) {
      throw new InvalidOperationError(`No existe el paso ${stepNumber} en la traza.`)
    }
    return step
  }

  getLastStep(): ExecutionStep {
    const last = this.steps[this.steps.length - 1]
    if (last === undefined) {
      throw new InvalidOperationError(`La traza no tiene pasos registrados.`)
    }
    return last
  }

  getTotalSteps(): number {
    return this.steps.length
  }

  getSummary(): TraceSummary {
    const last = this.getLastStep()
    return Object.freeze({
      totalSteps: this.steps.length,
      lastMemoryState: last.getMemorySnapshot(),
    })
  }
}
