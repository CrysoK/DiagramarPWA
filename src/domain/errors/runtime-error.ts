import { DomainError } from './domain-error'

export class RuntimeError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}

export class UndefinedVariableError extends RuntimeError {
  readonly variableName: string
  readonly scopeName: string

  constructor(variableName: string, scopeName: string) {
    super(`Variable '${variableName}' no definida en el ámbito '${scopeName}'.`)
    this.variableName = variableName
    this.scopeName = scopeName
  }
}

export class DivisionByZeroError extends RuntimeError {
  constructor(operator: 'DIV' | 'IDIV' | 'MOD' = 'DIV') {
    super(`Error de ejecución: División o módulo por cero mediante operador '${operator}'.`)
  }
}

export class TypeMismatchError extends RuntimeError {
  constructor(expected: string, received: string, context?: string) {
    const ctx = context ? ` en ${context}` : ''
    super(
      `Incompatibilidad de tipos${ctx}: se esperaba '${expected}', pero se recibió '${received}'.`,
    )
  }
}

export class InvalidOperationError extends RuntimeError {
  constructor(message: string) {
    super(message)
  }
}

export class DuplicateSymbolError extends RuntimeError {
  readonly symbolName: string
  readonly scopeName: string

  constructor(symbolName: string, scopeName: string) {
    super(`El identificador '${symbolName}' ya está declarado en el ámbito '${scopeName}'`)
    this.symbolName = symbolName
    this.scopeName = scopeName
  }
}
