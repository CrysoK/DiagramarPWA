import { describe, it, expect } from 'vitest'
import { createIntegerValue } from '../../memory/runtime-value'
import { LiteralNode } from '../../ast/expressions'
import { AssignmentNode } from '../../ast/statements'
import { ExecutionFrame } from '../execution-frame'

function dummy(name: string): AssignmentNode {
  return new AssignmentNode({ identifier: name }, new LiteralNode(createIntegerValue(0)))
}

describe('ExecutionFrame', () => {
  it('un marco vacío nace terminado y sin sentencia corriente', () => {
    const frame = new ExecutionFrame([])

    expect(frame.isFinished()).toBe(true)
    expect(frame.getCurrentStatement()).toBeNull()
    expect(frame.getIndex()).toBe(0)
  })

  it('recorre las sentencias en orden y termina al agotarlas', () => {
    const first = dummy('a')
    const second = dummy('b')
    const frame = new ExecutionFrame([first, second])

    expect(frame.getCurrentStatement()).toBe(first)
    expect(frame.getIndex()).toBe(0)
    expect(frame.isFinished()).toBe(false)

    frame.advance()
    expect(frame.getCurrentStatement()).toBe(second)
    expect(frame.getIndex()).toBe(1)

    frame.advance()
    expect(frame.getCurrentStatement()).toBeNull()
    expect(frame.isFinished()).toBe(true)
    expect(frame.getIndex()).toBe(2)
  })

  it('advance sobre un marco terminado no mueve el índice', () => {
    const frame = new ExecutionFrame([dummy('a')])
    frame.advance()
    frame.advance()
    frame.advance()

    expect(frame.getIndex()).toBe(1)
    expect(frame.isFinished()).toBe(true)
  })

  it('congela la secuencia: mutar el array original no altera el marco', () => {
    const first = dummy('a')
    const source = [first]
    const frame = new ExecutionFrame(source)

    source.push(dummy('b'))

    frame.advance()
    expect(frame.isFinished()).toBe(true)
    expect(frame.getCurrentStatement()).toBeNull()
  })
})
