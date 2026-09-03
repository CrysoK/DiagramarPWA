import type { RuntimeValue } from './runtime-value'

export class MemoryCell {
  readonly id: string
  private _value: RuntimeValue

  constructor(id: string, initialValue: RuntimeValue) {
    this.id = id
    this._value = initialValue
  }

  getValue(): RuntimeValue {
    return this._value
  }

  setValue(newValue: RuntimeValue): void {
    this._value = newValue
  }
}
