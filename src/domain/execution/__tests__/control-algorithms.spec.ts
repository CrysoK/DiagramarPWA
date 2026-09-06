import { describe, it, expect } from 'vitest'
import { MemorySnapshot } from '../../memory/memory-snapshot'
import { createIntegerValue } from '../../memory/runtime-value'
import { BinaryOpNode, LiteralNode, VariableRefNode } from '../../ast/expressions'
import { AssignmentNode, IfNode, ProgramNode, SequenceNode, WhileNode } from '../../ast/statements'
import { AlgorithmInterpreter } from '../algorithm-interpreter'
import { ExecutionStep } from '../execution-step'

function dest(identifier: string) {
  return { identifier }
}

function assignment(identifier: string, value: number): AssignmentNode {
  return new AssignmentNode(dest(identifier), new LiteralNode(createIntegerValue(value)))
}

function int(snapshot: MemorySnapshot, name: string) {
  const scope = snapshot.getScope('global')
  expect(scope).not.toBeNull()
  return scope!.variables.get(name)
}

function stepUntilDone(interpreter: AlgorithmInterpreter, maxSteps = 40): ExecutionStep[] {
  const executed: ExecutionStep[] = []
  while (executed.length < maxSteps) {
    const step = interpreter.executeNextStep()
    executed.push(step)
    if (step.isFinished) return executed
  }
  throw new Error(`La simulación no terminó en ${maxSteps} pasos`)
}

function maximoDeDos(a: number, b: number) {
  const assignA = assignment('a', a)
  const assignB = assignment('b', b)
  const thenAssign = new AssignmentNode(dest('max'), new VariableRefNode('a'))
  const elseAssign = new AssignmentNode(dest('max'), new VariableRefNode('b'))
  const ifNode = new IfNode(
    new BinaryOpNode('GT', new VariableRefNode('a'), new VariableRefNode('b')),
    new SequenceNode([thenAssign]),
    new SequenceNode([elseAssign]),
  )
  return {
    assignA,
    assignB,
    thenAssign,
    elseAssign,
    ifNode,
    program: new ProgramNode('maximo', new SequenceNode([assignA, assignB, ifNode])),
  }
}

describe('Algoritmos de control', () => {
  describe('máximo de dos enteros', () => {
    it('si a > b asigna max ← a y no ejecuta el sino', () => {
      const ast = maximoDeDos(8, 3)
      const interpreter = new AlgorithmInterpreter()
      const step0 = interpreter.startSimulation(ast.program, 'STEP_BY_STEP')

      expect(step0.stepNumber).toBe(0)
      expect(step0.activeNode).toBeNull()
      expect(step0.getMemorySnapshot().getScope('global')?.variables.size).toBe(0)

      const steps = stepUntilDone(interpreter)
      expect(steps).toHaveLength(4)
      expect(steps.map((s) => s.activeNode)).toEqual([
        ast.assignA,
        ast.assignB,
        ast.ifNode,
        ast.thenAssign,
      ])
      expect(steps[2]?.mutations).toEqual([])
      expect(int(interpreter.getMemoryState(2), 'max')).toBeUndefined()
      expect(int(interpreter.getMemoryState(3), 'max')).toBeUndefined()
      expect(int(interpreter.getMemoryState(), 'max')).toEqual(createIntegerValue(8))
      expect(steps[3]?.isFinished).toBe(true)
    })

    it('si a <= b asigna max ← b y no ejecuta el entonces', () => {
      const ast = maximoDeDos(3, 7)
      const interpreter = new AlgorithmInterpreter()
      interpreter.startSimulation(ast.program, 'STEP_BY_STEP')

      const steps = stepUntilDone(interpreter)
      expect(steps.map((s) => s.activeNode)).toEqual([
        ast.assignA,
        ast.assignB,
        ast.ifNode,
        ast.elseAssign,
      ])
      expect(int(interpreter.getMemoryState(), 'a')).toEqual(createIntegerValue(3))
      expect(int(interpreter.getMemoryState(), 'b')).toEqual(createIntegerValue(7))
      expect(int(interpreter.getMemoryState(), 'max')).toEqual(createIntegerValue(7))
    })
  })
  describe('suma 1..n', () => {
    it('acumula y reevalúa el mientras hasta i > n', () => {
      const assignI = assignment('i', 1)
      const assignN = assignment('n', 3)
      const assignSuma = assignment('suma', 0)
      const add = new AssignmentNode(
        dest('suma'),
        new BinaryOpNode('ADD', new VariableRefNode('suma'), new VariableRefNode('i')),
      )
      const inc = new AssignmentNode(
        dest('i'),
        new BinaryOpNode('ADD', new VariableRefNode('i'), new LiteralNode(createIntegerValue(1))),
      )
      const loop = new WhileNode(
        new BinaryOpNode('LE', new VariableRefNode('i'), new VariableRefNode('n')),
        new SequenceNode([add, inc]),
      )
      const program = new ProgramNode(
        'suma',
        new SequenceNode([assignI, assignN, assignSuma, loop]),
      )

      const interpreter = new AlgorithmInterpreter()
      interpreter.startSimulation(program, 'STEP_BY_STEP')
      const steps = stepUntilDone(interpreter)

      expect(steps).toHaveLength(13)
      expect(steps[0]?.activeNode).toBe(assignI)
      expect(steps[3]?.activeNode).toBe(loop)
      expect(steps[3]?.mutations).toEqual([])
      expect(int(interpreter.getMemoryState(3), 'suma')).toEqual(createIntegerValue(0))
      expect(int(interpreter.getMemoryState(6), 'suma')).toEqual(createIntegerValue(1))
      expect(int(interpreter.getMemoryState(6), 'i')).toEqual(createIntegerValue(2))
      expect(int(interpreter.getMemoryState(9), 'suma')).toEqual(createIntegerValue(3))
      expect(int(interpreter.getMemoryState(12), 'suma')).toEqual(createIntegerValue(6))
      expect(int(interpreter.getMemoryState(12), 'i')).toEqual(createIntegerValue(4))

      const last = steps[12]
      expect(last?.activeNode).toBe(loop)
      expect(last?.isFinished).toBe(true)
      expect(int(interpreter.getMemoryState(), 'suma')).toEqual(createIntegerValue(6))
    })
  })
  describe('contar pares en un descenso', () => {
    it('el si dentro del mientras solo incrementa cuando n es par', () => {
      const assignN = assignment('n', 5)
      const assignPares = assignment('pares', 0)
      const incPares = new AssignmentNode(
        dest('pares'),
        new BinaryOpNode(
          'ADD',
          new VariableRefNode('pares'),
          new LiteralNode(createIntegerValue(1)),
        ),
      )
      const ifPar = new IfNode(
        new BinaryOpNode(
          'EQ',
          new BinaryOpNode('MOD', new VariableRefNode('n'), new LiteralNode(createIntegerValue(2))),
          new LiteralNode(createIntegerValue(0)),
        ),
        new SequenceNode([incPares]),
      )
      const decN = new AssignmentNode(
        dest('n'),
        new BinaryOpNode('SUB', new VariableRefNode('n'), new LiteralNode(createIntegerValue(1))),
      )
      const loop = new WhileNode(
        new BinaryOpNode('GT', new VariableRefNode('n'), new LiteralNode(createIntegerValue(0))),
        new SequenceNode([ifPar, decN]),
      )
      const program = new ProgramNode('pares', new SequenceNode([assignN, assignPares, loop]))

      const interpreter = new AlgorithmInterpreter()
      interpreter.startSimulation(program, 'STEP_BY_STEP')
      const steps = stepUntilDone(interpreter)

      expect(steps).toHaveLength(20)
      expect(steps.filter((s) => s.activeNode === incPares)).toHaveLength(2)
      expect(int(interpreter.getMemoryState(5), 'n')).toEqual(createIntegerValue(4))
      expect(int(interpreter.getMemoryState(5), 'pares')).toEqual(createIntegerValue(0))
      expect(int(interpreter.getMemoryState(9), 'n')).toEqual(createIntegerValue(3))
      expect(int(interpreter.getMemoryState(9), 'pares')).toEqual(createIntegerValue(1))
      expect(int(interpreter.getMemoryState(), 'n')).toEqual(createIntegerValue(0))
      expect(int(interpreter.getMemoryState(), 'pares')).toEqual(createIntegerValue(2))
      expect(steps[19]?.activeNode).toBe(loop)
      expect(steps[19]?.isFinished).toBe(true)
    })
  })
})
