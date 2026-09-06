import type { MemorySnapshot } from '../memory'

export type ExecutionMode = 'STEP_BY_STEP' | 'CONTINUOUS'
export type SimulationStatus = 'READY' | 'RUNNING' | 'PAUSED' | 'FINISHED' | 'ERROR' | 'STOPPED'

export interface TraceSummary {
  readonly totalSteps: number
  readonly lastMemoryState: MemorySnapshot
}
