import { describe, it, expect } from 'vitest'
import { MemorySnapshot, ScopeSnapshot } from '../../memory/memory-snapshot'
import { createIntegerValue } from '../../memory/runtime-value'
import { InvalidOperationError } from '../../errors/runtime-error'
import { ExecutionStep } from '../execution-step'
import { ExecutionTrace } from '../execution-trace'

function emptySnapshot(): MemorySnapshot {
  return new MemorySnapshot([new ScopeSnapshot('global', new Map())])
}

describe('ExecutionStep', () => {
  it('el paso sin result no registra mutaciones y no está finalizado', () => {
    const snapshot = emptySnapshot()
    const step = new ExecutionStep(0, null, snapshot)

    expect(step.stepNumber).toBe(0)
    expect(step.activeNode).toBeNull()
    expect(step.mutations).toEqual([])
    expect(step.isFinished).toBe(false)
    expect(step.getMemorySnapshot()).toBe(snapshot)
    expect(Object.isFrozen(step)).toBe(true)
  })
})

describe('ExecutionTrace', () => {
  it('registra pasos y los recupera por número, no por índice de inserción', () => {
    const trace = new ExecutionTrace()
    const step0 = new ExecutionStep(0, null, emptySnapshot())
    const step1 = new ExecutionStep(1, null, emptySnapshot(), undefined, true)

    trace.recordStep(step0)
    trace.recordStep(step1)

    expect(trace.getTotalSteps()).toBe(2)
    expect(trace.getStep(0)).toBe(step0)
    expect(trace.getStep(1)).toBe(step1)
    expect(trace.getLastStep()).toBe(step1)
    expect(trace.getLastStep().isFinished).toBe(true)
  })

  it('lanza InvalidOperationError al consultar un número de paso inexistente', () => {
    const trace = new ExecutionTrace()
    trace.recordStep(new ExecutionStep(0, null, emptySnapshot()))

    expect(() => trace.getStep(4)).toThrow(InvalidOperationError)
  })

  it('getLastStep y getSummary lanzan InvalidOperationError en una traza vacía', () => {
    const trace = new ExecutionTrace()

    expect(() => trace.getLastStep()).toThrow(InvalidOperationError)
    expect(() => trace.getSummary()).toThrow(InvalidOperationError)
  })

  it('el resumen apunta al snapshot del último paso', () => {
    const lastSnapshot = new MemorySnapshot([
      new ScopeSnapshot('global', new Map([['n', createIntegerValue(2)]])),
    ])
    const trace = new ExecutionTrace()
    trace.recordStep(new ExecutionStep(0, null, emptySnapshot()))
    trace.recordStep(new ExecutionStep(1, null, lastSnapshot))

    const summary = trace.getSummary()
    expect(summary.totalSteps).toBe(2)
    expect(summary.lastMemoryState).toBe(lastSnapshot)
    expect(summary.lastMemoryState.getScope('global')?.variables.get('n')).toEqual(
      createIntegerValue(2),
    )
  })
})
