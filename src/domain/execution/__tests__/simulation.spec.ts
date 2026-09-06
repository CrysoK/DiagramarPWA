import { describe, it, expect } from 'vitest'
import { MemorySnapshot } from '../../memory/memory-snapshot'
import { createBooleanValue, createIntegerValue } from '../../memory/runtime-value'
import { TypeMismatchError, InvalidOperationError } from '../../errors/runtime-error'
import { BinaryOpNode, LiteralNode, VariableRefNode } from '../../ast/expressions'
import { AssignmentNode, IfNode, ProgramNode, SequenceNode, WhileNode } from '../../ast/statements'
import { Simulation } from '../simulation'

function dest(identifier: string) {
  return { identifier }
}

function assignment(identifier: string, value: number): AssignmentNode {
  return new AssignmentNode(dest(identifier), new LiteralNode(createIntegerValue(value)))
}

function program(name: string, ...statements: AssignmentNode[]): ProgramNode {
  return new ProgramNode(name, new SequenceNode(statements))
}

function globalVars(snapshot: MemorySnapshot) {
  const scope = snapshot.getScope('global')
  expect(scope).not.toBeNull()
  return scope!.variables
}

describe('Simulation', () => {
  describe('inicialización', () => {
    it('programa vacío: paso 0 finalizado y estado FINISHED', () => {
      const sim = new Simulation(new ProgramNode('vacio', new SequenceNode([])), 'STEP_BY_STEP')
      const step0 = sim.getLastStep()

      expect(sim.getStatus()).toBe('FINISHED')
      expect(sim.getMode()).toBe('STEP_BY_STEP')
      expect(step0.stepNumber).toBe(0)
      expect(step0.activeNode).toBeNull()
      expect(step0.mutations).toEqual([])
      expect(step0.isFinished).toBe(true)
      expect(globalVars(step0.getMemorySnapshot()).size).toBe(0)
    })

    it('programa con cuerpo: paso 0 previo a la primera instrucción', () => {
      const first = assignment('a', 1)
      const sim = new Simulation(program('demo', first), 'STEP_BY_STEP')
      const step0 = sim.getLastStep()

      expect(sim.getStatus()).toBe('RUNNING')
      expect(step0.stepNumber).toBe(0)
      expect(step0.activeNode).toBeNull()
      expect(step0.isFinished).toBe(false)
      expect(globalVars(step0.getMemorySnapshot()).size).toBe(0)
    })
  })

  describe('step (CO2)', () => {
    it('una asignación muta memoria, registra el nodo y finaliza', () => {
      const assign = assignment('a', 10)
      const sim = new Simulation(program('uno', assign), 'STEP_BY_STEP')

      const step = sim.step()

      expect(step.stepNumber).toBe(1)
      expect(step.activeNode).toBe(assign)
      expect(step.mutations).toHaveLength(1)
      expect(step.mutations[0]?.variableName).toBe('a')
      expect(step.mutations[0]?.previousValue).toBeNull()
      expect(step.mutations[0]?.newValue).toEqual(createIntegerValue(10))
      expect(step.isFinished).toBe(true)
      expect(sim.getStatus()).toBe('FINISHED')
      expect(globalVars(step.getMemorySnapshot()).get('a')).toEqual(createIntegerValue(10))
    })

    it('dos asignaciones: el primer step no finaliza y el paso 0 sigue vacío', () => {
      const first = assignment('a', 1)
      const second = assignment('b', 2)
      const sim = new Simulation(program('dos', first, second), 'STEP_BY_STEP')

      const step1 = sim.step()
      expect(step1.activeNode).toBe(first)
      expect(step1.isFinished).toBe(false)
      expect(sim.getStatus()).toBe('RUNNING')
      expect(globalVars(step1.getMemorySnapshot()).get('a')).toEqual(createIntegerValue(1))
      expect(globalVars(step1.getMemorySnapshot()).has('b')).toBe(false)
      expect(globalVars(sim.getMemorySnapshot(0)).size).toBe(0)

      const step2 = sim.step()
      expect(step2.activeNode).toBe(second)
      expect(step2.isFinished).toBe(true)
      expect(sim.getStatus()).toBe('FINISHED')
      expect(globalVars(step2.getMemorySnapshot()).get('b')).toEqual(createIntegerValue(2))
    })

    it('if verdadero ejecuta el then y no el else', () => {
      const prelude = assignment('x', 0)
      const thenAssign = assignment('x', 1)
      const elseAssign = assignment('x', 2)
      const ifNode = new IfNode(
        new LiteralNode(createBooleanValue(true)),
        new SequenceNode([thenAssign]),
        new SequenceNode([elseAssign]),
      )
      const sim = new Simulation(
        new ProgramNode('cond', new SequenceNode([prelude, ifNode])),
        'STEP_BY_STEP',
      )

      expect(sim.step().activeNode).toBe(prelude)
      const ifStep = sim.step()
      expect(ifStep.activeNode).toBe(ifNode)
      expect(ifStep.mutations).toEqual([])
      expect(globalVars(ifStep.getMemorySnapshot()).get('x')).toEqual(createIntegerValue(0))

      const thenStep = sim.step()
      expect(thenStep.activeNode).toBe(thenAssign)
      expect(thenStep.isFinished).toBe(true)
      expect(globalVars(thenStep.getMemorySnapshot()).get('x')).toEqual(createIntegerValue(1))
    })

    it('if falso sin else solo avanza y no apila', () => {
      const ifNode = new IfNode(
        new LiteralNode(createBooleanValue(false)),
        new SequenceNode([assignment('x', 1)]),
      )
      const after = assignment('y', 3)
      const sim = new Simulation(
        new ProgramNode('sinElse', new SequenceNode([ifNode, after])),
        'STEP_BY_STEP',
      )

      const ifStep = sim.step()
      expect(ifStep.activeNode).toBe(ifNode)
      expect(ifStep.isFinished).toBe(false)

      const afterStep = sim.step()
      expect(afterStep.activeNode).toBe(after)
      expect(afterStep.isFinished).toBe(true)
      expect(globalVars(afterStep.getMemorySnapshot()).has('x')).toBe(false)
      expect(globalVars(afterStep.getMemorySnapshot()).get('y')).toEqual(createIntegerValue(3))
    })

    it('while pretest reevalúa la condición hasta que es falsa', () => {
      const init = assignment('n', 2)
      const decrement = new AssignmentNode(
        dest('n'),
        new BinaryOpNode('SUB', new VariableRefNode('n'), new LiteralNode(createIntegerValue(1))),
      )
      const loop = new WhileNode(
        new BinaryOpNode('GT', new VariableRefNode('n'), new LiteralNode(createIntegerValue(0))),
        new SequenceNode([decrement]),
      )
      const sim = new Simulation(
        new ProgramNode('cuenta', new SequenceNode([init, loop])),
        'STEP_BY_STEP',
      )

      expect(sim.step().activeNode).toBe(init)

      const while1 = sim.step()
      expect(while1.activeNode).toBe(loop)
      expect(globalVars(while1.getMemorySnapshot()).get('n')).toEqual(createIntegerValue(2))

      const body1 = sim.step()
      expect(body1.activeNode).toBe(decrement)
      expect(globalVars(body1.getMemorySnapshot()).get('n')).toEqual(createIntegerValue(1))

      const while2 = sim.step()
      expect(while2.activeNode).toBe(loop)

      const body2 = sim.step()
      expect(body2.activeNode).toBe(decrement)
      expect(globalVars(body2.getMemorySnapshot()).get('n')).toEqual(createIntegerValue(0))

      const while3 = sim.step()
      expect(while3.activeNode).toBe(loop)
      expect(while3.isFinished).toBe(true)
      expect(sim.getStatus()).toBe('FINISHED')
      expect(globalVars(while3.getMemorySnapshot()).get('n')).toEqual(createIntegerValue(0))
    })

    it('un error de tipos marca ERROR y no registra el paso fallido', () => {
      const first = assignment('contador', 0)
      const bad = new AssignmentNode(dest('contador'), new LiteralNode(createBooleanValue(true)))
      const sim = new Simulation(program('tipos', first, bad), 'STEP_BY_STEP')

      sim.step()
      expect(() => sim.step()).toThrow(TypeMismatchError)
      expect(sim.getStatus()).toBe('ERROR')
      expect(sim.getLastStep().stepNumber).toBe(1)
      expect(globalVars(sim.getMemorySnapshot()).get('contador')).toEqual(createIntegerValue(0))
    })

    it('step sobre una simulación finalizada lanza InvalidOperationError', () => {
      const sim = new Simulation(program('uno', assignment('a', 1)), 'STEP_BY_STEP')
      sim.step()

      expect(() => sim.step()).toThrow(InvalidOperationError)
    })
  })

  describe('consulta y detención', () => {
    it('getMemorySnapshot(0) no cambia después de ejecutar', () => {
      const sim = new Simulation(program('a', assignment('a', 5)), 'STEP_BY_STEP')
      sim.step()

      expect(globalVars(sim.getMemorySnapshot(0)).size).toBe(0)
      expect(globalVars(sim.getMemorySnapshot()).get('a')).toEqual(createIntegerValue(5))
    })

    it('stop pasa a STOPPED y step posterior lanza', () => {
      const sim = new Simulation(
        program('dos', assignment('a', 1), assignment('b', 2)),
        'STEP_BY_STEP',
      )
      sim.step()

      sim.stop()
      expect(sim.getStatus()).toBe('STOPPED')

      const summary = sim.getSummary()
      expect(summary.totalSteps).toBe(2)
      expect(globalVars(summary.lastMemoryState).get('a')).toEqual(createIntegerValue(1))
      expect(() => sim.step()).toThrow(InvalidOperationError)
    })
  })
})
