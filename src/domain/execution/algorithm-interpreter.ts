import type { ProgramNode } from '../ast'
import { InvalidOperationError } from '../errors'
import type { MemorySnapshot } from '../memory'
import type { ExecutionStep } from './execution-step'
import { Simulation } from './simulation'
import type { ExecutionMode, TraceSummary } from './types'

export class AlgorithmInterpreter {
  private currentSimulation: Simulation | null = null

  startSimulation(program: ProgramNode, mode: ExecutionMode): ExecutionStep {
    if (this.currentSimulation !== null) {
      const status = this.currentSimulation.getStatus()
      if (status === 'RUNNING' || status === 'PAUSED') {
        throw new InvalidOperationError('Ya existe una simulación activa en ejecución.')
      }
    }
    this.currentSimulation = new Simulation(program, mode)
    return this.currentSimulation.getLastStep()
  }

  executeNextStep(): ExecutionStep {
    return this.requireSimulation().step()
  }

  getMemoryState(stepNumber?: number): MemorySnapshot {
    return this.requireSimulation().getMemorySnapshot(stepNumber)
  }

  stopSimulation(): TraceSummary {
    const sim = this.requireSimulation()
    sim.stop()
    return sim.getSummary()
  }

  private requireSimulation(): Simulation {
    if (this.currentSimulation === null) {
      throw new InvalidOperationError('No hay una simulación inicializada.')
    }
    return this.currentSimulation
  }
}
