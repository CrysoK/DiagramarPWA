import { createIntegerValue, stringifyRuntimeValue } from '../src/domain/memory/runtime-value'
import type { MemorySnapshot } from '../src/domain/memory/memory-snapshot'
import type { MutationRecord } from '../src/domain/memory/mutation-record'
import { BinaryOpNode, LiteralNode, VariableRefNode } from '../src/domain/ast/expressions'
import {
  AssignmentNode,
  IfNode,
  ProgramNode,
  SequenceNode,
  WhileNode,
  type StatementNode,
} from '../src/domain/ast/statements'
import { AlgorithmInterpreter } from '../src/domain/execution/algorithm-interpreter'
import type { ExecutionStep } from '../src/domain/execution/execution-step'

const COUNTER_NAME = 'n'
const EVEN_COUNT_NAME = 'pares'
const INITIAL_COUNTER = 5
const INITIAL_EVEN_COUNT = 0
const EVEN_MODULUS = 2
const UNIT = 1
const ZERO = 0
const MAX_STEPS = 40
const PROGRAM_NAME = 'count-evens'

function dest(identifier: string) {
  return { identifier }
}

function assignment(identifier: string, value: number): AssignmentNode {
  return new AssignmentNode(dest(identifier), new LiteralNode(createIntegerValue(value)))
}

function literal(value: number): LiteralNode {
  return new LiteralNode(createIntegerValue(value))
}

function variable(name: string): VariableRefNode {
  return new VariableRefNode(name)
}

function buildEvenCountProgram(): ProgramNode {
  const incrementEvens = new AssignmentNode(
    dest(EVEN_COUNT_NAME),
    new BinaryOpNode('ADD', variable(EVEN_COUNT_NAME), literal(UNIT)),
  )
  const ifEven = new IfNode(
    new BinaryOpNode(
      'EQ',
      new BinaryOpNode('MOD', variable(COUNTER_NAME), literal(EVEN_MODULUS)),
      literal(ZERO),
    ),
    new SequenceNode([incrementEvens]),
  )
  const decrementCounter = new AssignmentNode(
    dest(COUNTER_NAME),
    new BinaryOpNode('SUB', variable(COUNTER_NAME), literal(UNIT)),
  )
  const loop = new WhileNode(
    new BinaryOpNode('GT', variable(COUNTER_NAME), literal(ZERO)),
    new SequenceNode([ifEven, decrementCounter]),
  )
  return new ProgramNode(
    PROGRAM_NAME,
    new SequenceNode([
      assignment(COUNTER_NAME, INITIAL_COUNTER),
      assignment(EVEN_COUNT_NAME, INITIAL_EVEN_COUNT),
      loop,
    ]),
  )
}

function nodeLabel(node: StatementNode | null): string {
  if (node === null) return '(inicio)'
  if (node instanceof AssignmentNode) return `${node.target.identifier} ←`
  if (node instanceof IfNode) return 'si'
  if (node instanceof WhileNode) return 'mientras'
  return node.id
}

function formatMemory(snapshot: MemorySnapshot): string {
  const scope = snapshot.getScope('global')
  if (scope === null || scope.variables.size === 0) return '{}'
  return [...scope.variables.entries()]
    .map(([name, value]) => `${name}=${stringifyRuntimeValue(value)}`)
    .join(', ')
}

function formatMutations(mutations: readonly MutationRecord[]): string {
  if (mutations.length === 0) return ''
  return mutations
    .map((m) => {
      const prev = m.previousValue === null ? '—' : stringifyRuntimeValue(m.previousValue)
      return `${m.variableName}: ${prev} → ${stringifyRuntimeValue(m.newValue)}`
    })
    .join('; ')
}

function printStep(step: ExecutionStep): void {
  const mut = formatMutations(step.mutations)
  const fin = step.isFinished ? '  [fin]' : ''
  const extra = mut === '' ? '' : `  (${mut})`
  console.log(
    `${String(step.stepNumber).padStart(2)}  ${nodeLabel(step.activeNode).padEnd(10)}  ${formatMemory(step.getMemorySnapshot())}${extra}${fin}`,
  )
}

const interpreter = new AlgorithmInterpreter()
const step0 = interpreter.startSimulation(buildEvenCountProgram(), 'STEP_BY_STEP')

console.log(`${COUNTER_NAME} ← ${INITIAL_COUNTER}; ${EVEN_COUNT_NAME} ← ${INITIAL_EVEN_COUNT}`)
console.log(`mientras ${COUNTER_NAME} > ${ZERO}`)
console.log(
  `  si ${COUNTER_NAME} MOD ${EVEN_MODULUS} = ${ZERO} entonces ${EVEN_COUNT_NAME} ← ${EVEN_COUNT_NAME} + ${UNIT}`,
)
console.log(`  ${COUNTER_NAME} ← ${COUNTER_NAME} - ${UNIT}`)
console.log('')

printStep(step0)

let finished = false
for (let i = 0; i < MAX_STEPS; i++) {
  const step = interpreter.executeNextStep()
  printStep(step)
  if (step.isFinished) {
    finished = true
    break
  }
}

if (!finished) {
  throw new Error(`La simulación no terminó en ${MAX_STEPS} pasos`)
}
