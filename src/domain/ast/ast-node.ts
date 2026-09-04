export interface ASTNode {
  readonly id: string
  readonly line: number | null
}

let nextNodeId = 0
export function generateNodeId(prefix: string): string {
  return `${prefix}_${++nextNodeId}`
}
