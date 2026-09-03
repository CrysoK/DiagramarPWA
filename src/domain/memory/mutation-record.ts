import type { RuntimeValue } from './runtime-value'

export interface MutationRecord {
  readonly variableName: string
  readonly writerScopeName: string
  readonly ownerScopeName: string
  readonly previousValue: RuntimeValue | null
  readonly newValue: RuntimeValue
}
