import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryScope } from '../../memory/memory-scope'
import { createBooleanValue, createIntegerValue } from '../../memory/runtime-value'
import { BinaryOpNode, LiteralNode, VariableRefNode } from '../expressions'
import { TypeMismatchError } from '../../errors/runtime-error'
import { ExecutionContext } from '../execution'
import { AssignmentNode, IfNode, ProgramNode, SequenceNode, WhileNode } from '../statements'

describe('Ejecución de sentencias (stepper)', () => {
  let scope: MemoryScope
  let context: ExecutionContext

  beforeEach(() => {
    scope = new MemoryScope('global')
    context = new ExecutionContext(scope)
  })

  function dest(identifier: string) {
    return { identifier }
  }

  function assignment(identifier: string, value: number): AssignmentNode {
    return new AssignmentNode(dest(identifier), new LiteralNode(createIntegerValue(value)))
  }

  describe('AssignmentNode', () => {
    it('declara implícitamente y pide ADVANCE', () => {
      const node = assignment('total', 10)
      const result = node.execute(context)

      expect(result.nextAction).toEqual({ type: 'ADVANCE' })
      expect(result.mutations).toHaveLength(1)
      expect(result.mutations[0]).toEqual({
        variableName: 'total',
        writerScopeName: 'global',
        ownerScopeName: 'global',
        previousValue: null,
        newValue: createIntegerValue(10),
      })
      expect(scope.getVariableValue('total')).toEqual(createIntegerValue(10))
    })
    it('reasigna y registra el valor anterior', () => {
      scope.setVariableValue('total', createIntegerValue(10))
      const result = assignment('total', 20).execute(context)

      expect(result.nextAction).toEqual({ type: 'ADVANCE' })
      expect(result.mutations[0]?.previousValue).toEqual(createIntegerValue(10))
      expect(result.mutations[0]?.newValue).toEqual(createIntegerValue(20))
      expect(scope.getVariableValue('total')).toEqual(createIntegerValue(20))
    })
    it('evalúa la expresión en el ámbito y asigna el resultado', () => {
      scope.setVariableValue('total', createIntegerValue(10))
      const expr = new BinaryOpNode(
        'ADD',
        new VariableRefNode('total'),
        new LiteralNode(createIntegerValue(5)),
      )
      const result = new AssignmentNode(dest('total'), expr).execute(context)

      expect(result.mutations[0]?.newValue).toEqual(createIntegerValue(15))
      expect(scope.getVariableValue('total')).toEqual(createIntegerValue(15))
    })
    it('propaga TypeMismatchError al reasignar un tipo incompatible', () => {
      scope.setVariableValue('contador', createIntegerValue(0))
      const node = new AssignmentNode(dest('contador'), new LiteralNode(createBooleanValue(true)))
      expect(() => node.execute(context)).toThrow(TypeMismatchError)
      expect(scope.getVariableValue('contador')).toEqual(createIntegerValue(0))
    })
  })
  describe('IfNode', () => {
    it('con condición verdadera emite PUSH_AND_ADVANCE de la rama then', () => {
      const thenAssign = assignment('x', 1)
      const elseAssign = assignment('y', 2)
      const thenBranch = new SequenceNode([thenAssign])
      const elseBranch = new SequenceNode([elseAssign])
      const node = new IfNode(new LiteralNode(createBooleanValue(true)), thenBranch, elseBranch)

      const result = node.execute(context)

      expect(result.mutations).toEqual([])
      expect(result.nextAction).toEqual({
        type: 'PUSH_AND_ADVANCE',
        statements: thenBranch.getStatements(),
      })
      expect(scope.hasVariable('x')).toBe(false)
      expect(scope.hasVariable('y')).toBe(false)
    })
    it('con condición falsa y else emite PUSH_AND_ADVANCE de la rama else', () => {
      const thenBranch = new SequenceNode([assignment('x', 1)])
      const elseBranch = new SequenceNode([assignment('y', 2)])
      const node = new IfNode(new LiteralNode(createBooleanValue(false)), thenBranch, elseBranch)

      const result = node.execute(context)

      expect(result.nextAction).toEqual({
        type: 'PUSH_AND_ADVANCE',
        statements: elseBranch.getStatements(),
      })
    })
    it('con condición falsa y sin else emite ADVANCE', () => {
      const thenBranch = new SequenceNode([assignment('x', 1)])
      const node = new IfNode(new LiteralNode(createBooleanValue(false)), thenBranch)
      const result = node.execute(context)
      expect(result.nextAction).toEqual({ type: 'ADVANCE' })
    })
    it('con else vacío no lo trata como ausencia de rama', () => {
      const thenBranch = new SequenceNode([assignment('x', 1)])
      const emptyElse = new SequenceNode([])
      const node = new IfNode(new LiteralNode(createBooleanValue(false)), thenBranch, emptyElse)

      const result = node.execute(context)

      expect(result.nextAction).toEqual({
        type: 'PUSH_AND_ADVANCE',
        statements: emptyElse.getStatements(),
      })
    })
    it('rechaza una condición no booleana', () => {
      const node = new IfNode(new LiteralNode(createIntegerValue(1)), new SequenceNode([]))
      expect(() => node.execute(context)).toThrow(TypeMismatchError)
    })
  })
  describe('WhileNode', () => {
    it('con condición verdadera emite PUSH_FRAME del cuerpo', () => {
      const body = new SequenceNode([assignment('n', 1)])
      const node = new WhileNode(new LiteralNode(createBooleanValue(true)), body)

      const result = node.execute(context)

      expect(result.mutations).toEqual([])
      expect(result.nextAction).toEqual({
        type: 'PUSH_FRAME',
        statements: body.getStatements(),
      })
      expect(scope.hasVariable('n')).toBe(false)
    })
    it('con condición falsa emite ADVANCE', () => {
      const body = new SequenceNode([assignment('n', 1)])
      const node = new WhileNode(new LiteralNode(createBooleanValue(false)), body)
      expect(node.execute(context).nextAction).toEqual({ type: 'ADVANCE' })
    })
    it('rechaza una condición no booleana', () => {
      const node = new WhileNode(new LiteralNode(createIntegerValue(1)), new SequenceNode([]))
      expect(() => node.execute(context)).toThrow(TypeMismatchError)
    })
  })
  describe('SequenceNode y ProgramNode', () => {
    it('SequenceNode expone una copia de las sentencias', () => {
      const first = assignment('a', 1)
      const source = [first]
      const sequence = new SequenceNode(source)
      source.push(assignment('b', 2))
      expect(sequence.getStatements()).toEqual([first])
      expect(sequence.getStatements()).toHaveLength(1)
    })
    it('ProgramNode expone el cuerpo como secuencia', () => {
      const body = new SequenceNode([assignment('inicio', 0)])
      const program = new ProgramNode('demo', body)
      expect(program.name).toBe('demo')
      expect(program.getBody()).toBe(body)
      expect(program.getBody().getStatements()).toEqual(body.getStatements())
    })
  })
})
