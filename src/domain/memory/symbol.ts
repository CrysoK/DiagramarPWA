import type { DataType } from './data-type'
import type { MemoryCell } from './memory-cell'
import type { RuntimeValue } from './runtime-value'
import { isTypeAssignable } from './data-type'
import { createRealValue, isIntegerValue } from './runtime-value'
import { TypeMismatchError } from '../errors/runtime-error'

export class Symbol {
  readonly name: string
  readonly type: DataType
  readonly scopeName: string
  private readonly _cell: MemoryCell

  constructor(name: string, type: DataType, cell: MemoryCell, scopeName: string) {
    this.name = name
    this.type = type
    this.scopeName = scopeName
    this._cell = cell
    this.assertTypeCompatibility(cell.getValue())
  }

  getCell(): MemoryCell {
    return this._cell
  }

  getValue(): RuntimeValue {
    return this._cell.getValue()
  }

  setValue(newValue: RuntimeValue): void {
    const compatibleValue = this.assertTypeCompatibility(newValue)
    this._cell.setValue(compatibleValue)
  }

  private assertTypeCompatibility(val: RuntimeValue): RuntimeValue {
    if (!isTypeAssignable(this.type, val.type)) {
      throw new TypeMismatchError(
        this.type.kind,
        val.type.kind,
        `asignación a la variable '${this.name}'`,
      )
    }

    if (this.type.kind === 'REAL' && isIntegerValue(val)) {
      return createRealValue(val.value)
    }

    return val
  }
}
