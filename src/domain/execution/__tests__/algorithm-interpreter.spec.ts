import { describe, it, expect } from 'vitest'
import { MemorySnapshot } from '../../memory/memory-snapshot'
import { createIntegerValue } from '../../memory/runtime-value'
import { InvalidOperationError } from '../../errors/runtime-error'
import { LiteralNode } from '../../ast/expressions'
import { AssignmentNode, ProgramNode, SequenceNode } from '../../ast/statements'
import { AlgorithmInterpreter } from '../algorithm-interpreter'

function assignment(identifier: string, value: number): AssignmentNode {
  return new AssignmentNode({ identifier }, new LiteralNode(createIntegerValue(value)))
}

function program(...statements: AssignmentNode[]): ProgramNode {
  return new ProgramNode('demo', new SequenceNode(statements))
}

function globalVars(snapshot: MemorySnapshot) {
  const scope = snapshot.getScope('global')
  expect(scope).not.toBeNull()
  return scope!.variables
}

describe('AlgorithmInterpreter', () => {
  it('CO1: startSimulation deja el paso 0 con memoria vacía y sin nodo activo', () => {
    const interpreter = new AlgorithmInterpreter()
    const first = assignment('a', 1)
    const step0 = interpreter.startSimulation(program(first, assignment('b', 2)), 'STEP_BY_STEP')

    expect(step0.stepNumber).toBe(0)
    expect(step0.activeNode).toBeNull()
    expect(step0.isFinished).toBe(false)
    expect(globalVars(step0.getMemorySnapshot()).size).toBe(0)
  })

  it('CO1: rechaza un segundo start mientras la simulación está en ejecución', () => {
    const interpreter = new AlgorithmInterpreter()
    interpreter.startSimulation(program(assignment('a', 1)), 'STEP_BY_STEP')

    expect(() => interpreter.startSimulation(program(assignment('b', 2)), 'STEP_BY_STEP')).toThrow(
      InvalidOperationError,
    )
  })

  it('CO1: permite start de una sesión nueva si la anterior finalizó', () => {
    const interpreter = new AlgorithmInterpreter()
    interpreter.startSimulation(program(assignment('a', 1)), 'STEP_BY_STEP')
    interpreter.executeNextStep()

    const step0 = interpreter.startSimulation(program(assignment('z', 9)), 'CONTINUOUS')
    expect(step0.stepNumber).toBe(0)
    expect(globalVars(step0.getMemorySnapshot()).size).toBe(0)
  })

  it('CO2: executeNextStep corre la sentencia activa y señala el fin', () => {
    const interpreter = new AlgorithmInterpreter()
    const first = assignment('a', 1)
    const second = assignment('b', 2)
    interpreter.startSimulation(program(first, second), 'STEP_BY_STEP')

    const step1 = interpreter.executeNextStep()
    expect(step1.activeNode).toBe(first)
    expect(step1.isFinished).toBe(false)
    expect(globalVars(step1.getMemorySnapshot()).get('a')).toEqual(createIntegerValue(1))

    const step2 = interpreter.executeNextStep()
    expect(step2.activeNode).toBe(second)
    expect(step2.isFinished).toBe(true)
    expect(globalVars(step2.getMemorySnapshot()).get('b')).toEqual(createIntegerValue(2))
  })

  it('CO3: getMemoryState no avanza el cursor (CQS)', () => {
    const interpreter = new AlgorithmInterpreter()
    interpreter.startSimulation(program(assignment('a', 1), assignment('b', 2)), 'STEP_BY_STEP')
    interpreter.executeNextStep()

    const current = interpreter.getMemoryState()
    const again = interpreter.getMemoryState()
    const initial = interpreter.getMemoryState(0)

    expect(globalVars(current).get('a')).toEqual(createIntegerValue(1))
    expect(globalVars(current).has('b')).toBe(false)
    expect(globalVars(again).get('a')).toEqual(createIntegerValue(1))
    expect(globalVars(initial).size).toBe(0)

    const step2 = interpreter.executeNextStep()
    expect(step2.activeNode).not.toBeNull()
    expect(globalVars(step2.getMemorySnapshot()).get('b')).toEqual(createIntegerValue(2))
  })

  it('CO4: stopSimulation preserva la traza e impide seguir', () => {
    const interpreter = new AlgorithmInterpreter()
    interpreter.startSimulation(program(assignment('a', 1), assignment('b', 2)), 'STEP_BY_STEP')
    interpreter.executeNextStep()

    const summary = interpreter.stopSimulation()
    expect(summary.totalSteps).toBe(2)
    expect(globalVars(summary.lastMemoryState).get('a')).toEqual(createIntegerValue(1))
    expect(() => interpreter.executeNextStep()).toThrow(InvalidOperationError)
  })

  it('sin start, las operaciones del sistema lanzan', () => {
    const interpreter = new AlgorithmInterpreter()

    expect(() => interpreter.executeNextStep()).toThrow(InvalidOperationError)
    expect(() => interpreter.getMemoryState()).toThrow(InvalidOperationError)
    expect(() => interpreter.stopSimulation()).toThrow(InvalidOperationError)
  })
})
