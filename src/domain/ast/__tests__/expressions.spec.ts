import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryScope } from '../../memory/memory-scope'
import {
  createIntegerValue,
  createRealValue,
  createBooleanValue,
  createStringValue,
  createCharValue,
} from '../../memory/runtime-value'
import {
  LiteralNode,
  VariableRefNode,
  UnaryOpNode,
  BinaryOpNode,
  type ExpressionNode,
} from '../expressions'
import { TypeMismatchError } from '../../errors/runtime-error'

describe('Evaluación de expresiones (Interpreter GoF)', () => {
  let scope: MemoryScope

  beforeEach(() => {
    scope = new MemoryScope('global')
  })

  function evaluate(node: ExpressionNode) {
    return node.evaluate(scope)
  }

  it('evalúa literales sin consultar el ámbito', () => {
    expect(evaluate(new LiteralNode(createIntegerValue(42)))).toEqual(createIntegerValue(42))
  })

  it('resuelve referencias leyendo el MemoryScope', () => {
    scope.setVariableValue('precio', createRealValue(199.99))
    expect(evaluate(new VariableRefNode('precio'))).toEqual(createRealValue(199.99))
  })

  it('evalúa unarios PLUS, MINUS y NOT', () => {
    expect(evaluate(new UnaryOpNode('PLUS', new LiteralNode(createIntegerValue(5))))).toEqual(
      createIntegerValue(5),
    )
    expect(evaluate(new UnaryOpNode('MINUS', new LiteralNode(createIntegerValue(5))))).toEqual(
      createIntegerValue(-5),
    )
    expect(evaluate(new UnaryOpNode('NOT', new LiteralNode(createBooleanValue(true))))).toEqual(
      createBooleanValue(false),
    )
  })

  it('evalúa aritmética entre enteros', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'ADD',
          new LiteralNode(createIntegerValue(10)),
          new LiteralNode(createIntegerValue(5)),
        ),
      ),
    ).toEqual(createIntegerValue(15))

    expect(
      evaluate(
        new BinaryOpNode(
          'SUB',
          new LiteralNode(createIntegerValue(10)),
          new LiteralNode(createIntegerValue(4)),
        ),
      ),
    ).toEqual(createIntegerValue(6))

    expect(
      evaluate(
        new BinaryOpNode(
          'MUL',
          new LiteralNode(createIntegerValue(6)),
          new LiteralNode(createIntegerValue(7)),
        ),
      ),
    ).toEqual(createIntegerValue(42))

    expect(
      evaluate(
        new BinaryOpNode(
          'MOD',
          new LiteralNode(createIntegerValue(7)),
          new LiteralNode(createIntegerValue(3)),
        ),
      ),
    ).toEqual(createIntegerValue(1))

    expect(
      evaluate(
        new BinaryOpNode(
          'POW',
          new LiteralNode(createIntegerValue(2)),
          new LiteralNode(createIntegerValue(3)),
        ),
      ),
    ).toEqual(createIntegerValue(8))
  })

  it('DIV entre enteros trunca hacia cero (semántica C)', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'DIV',
          new LiteralNode(createIntegerValue(7)),
          new LiteralNode(createIntegerValue(2)),
        ),
      ),
    ).toEqual(createIntegerValue(3))

    expect(
      evaluate(
        new BinaryOpNode(
          'DIV',
          new LiteralNode(createIntegerValue(-7)),
          new LiteralNode(createIntegerValue(2)),
        ),
      ),
    ).toEqual(createIntegerValue(-3))
  })

  it('DIV con un operando REAL produce división real', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'DIV',
          new LiteralNode(createIntegerValue(7)),
          new LiteralNode(createRealValue(2)),
        ),
      ),
    ).toEqual(createRealValue(3.5))
  })

  it('IDIV exige enteros y trunca hacia cero', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'IDIV',
          new LiteralNode(createIntegerValue(7)),
          new LiteralNode(createIntegerValue(2)),
        ),
      ),
    ).toEqual(createIntegerValue(3))
  })

  it('promociona INTEGER + REAL a REAL', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'ADD',
          new LiteralNode(createIntegerValue(10)),
          new LiteralNode(createRealValue(2.5)),
        ),
      ),
    ).toEqual(createRealValue(12.5))
  })

  it('concatena solo STRING con STRING', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'ADD',
          new LiteralNode(createStringValue('Hola')),
          new LiteralNode(createStringValue(' Mundo')),
        ),
      ),
    ).toEqual(createStringValue('Hola Mundo'))
  })

  it('rechaza STRING + INTEGER en el perfil Estándar', () => {
    expect(() =>
      evaluate(
        new BinaryOpNode(
          'ADD',
          new LiteralNode(createStringValue('Resultado: ')),
          new LiteralNode(createIntegerValue(42)),
        ),
      ),
    ).toThrow(TypeMismatchError)
  })

  it('compara números promocionando INTEGER y REAL', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'EQ',
          new LiteralNode(createIntegerValue(5)),
          new LiteralNode(createRealValue(5)),
        ),
      ),
    ).toEqual(createBooleanValue(true))

    expect(
      evaluate(
        new BinaryOpNode(
          'LE',
          new LiteralNode(createIntegerValue(5)),
          new LiteralNode(createRealValue(5)),
        ),
      ),
    ).toEqual(createBooleanValue(true))
  })

  it('compara CHAR y STRING de forma homogénea', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'LT',
          new LiteralNode(createCharValue('a')),
          new LiteralNode(createCharValue('b')),
        ),
      ),
    ).toEqual(createBooleanValue(true))

    expect(
      evaluate(
        new BinaryOpNode(
          'GT',
          new LiteralNode(createStringValue('beto')),
          new LiteralNode(createStringValue('ana')),
        ),
      ),
    ).toEqual(createBooleanValue(true))
  })

  it('evalúa conjunción y disyunción', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'AND',
          new LiteralNode(createBooleanValue(true)),
          new LiteralNode(createBooleanValue(false)),
        ),
      ),
    ).toEqual(createBooleanValue(false))

    expect(
      evaluate(
        new BinaryOpNode(
          'OR',
          new LiteralNode(createBooleanValue(true)),
          new LiteralNode(createBooleanValue(false)),
        ),
      ),
    ).toEqual(createBooleanValue(true))
  })

  it('no evalúa el derecho de AND si el izquierdo es falso', () => {
    const boom = new BinaryOpNode(
      'DIV',
      new LiteralNode(createIntegerValue(10)),
      new LiteralNode(createIntegerValue(0)),
    )
    expect(
      evaluate(new BinaryOpNode('AND', new LiteralNode(createBooleanValue(false)), boom)),
    ).toEqual(createBooleanValue(false))
  })

  it('no evalúa el derecho de OR si el izquierdo es verdadero', () => {
    const boom = new BinaryOpNode(
      'DIV',
      new LiteralNode(createIntegerValue(10)),
      new LiteralNode(createIntegerValue(0)),
    )
    expect(
      evaluate(new BinaryOpNode('OR', new LiteralNode(createBooleanValue(true)), boom)),
    ).toEqual(createBooleanValue(true))
  })

  it('evalúa el árbol compuesto (total + 5) * factor', () => {
    scope.setVariableValue('total', createIntegerValue(10))
    scope.setVariableValue('factor', createIntegerValue(2))

    const sum = new BinaryOpNode(
      'ADD',
      new VariableRefNode('total'),
      new LiteralNode(createIntegerValue(5)),
    )
    const product = new BinaryOpNode('MUL', sum, new VariableRefNode('factor'))

    expect(evaluate(product)).toEqual(createIntegerValue(30))
  })

  it('POW que desborda a infinito produce REAL infinito', () => {
    expect(
      evaluate(
        new BinaryOpNode(
          'POW',
          new LiteralNode(createIntegerValue(10)),
          new LiteralNode(createIntegerValue(400)),
        ),
      ),
    ).toEqual(createRealValue(Infinity))
  })
})
