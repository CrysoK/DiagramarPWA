# TM-01: Aislamiento del motor lógico y separación modelo-vista

> **Versión:** `0.1.0`

## Asunto

Aislamiento del motor lógico y aplicación del principio de separación
modelo-vista (_Model-View Separation Principle_).

## Resumen de la solución

Encapsular la capa de dominio en un módulo independiente en TypeScript puro sin
dependencias de la interfaz gráfica (Vue 3, DOM o SVG). Canalizar todas las
operaciones del sistema mediante el controlador de fachada
`AlgorithmInterpreter` (patrón GRASP Controller / Facade).

## Factores arquitectónicos

- **Mantenibilidad:** Evitar el acoplamiento rígido entre UI y lógica que
  impidió la evolución, modernización y reutilización del motor original de
  [_Diagramar (2009)_](../../02-requirements/domain-rules/diagramar-2009.md).
- **Verificabilidad:** Capacidad de ejecutar pruebas unitarias automatizadas
  (Vitest) sobre el AST y el intérprete sin montar componentes del DOM.
- **Intercambiabilidad:** Capacidad de modificar o reemplazar la biblioteca de
  renderizado visual sin alterar la semántica algorítmica.

## Solución

1. El código de la capa de dominio (`domain/`) no importa elementos de `@vue/*`
   ni manipula el árbol del DOM.
2. `AlgorithmInterpreter` recibe las operaciones del sistema definidas en los
   [DSS](../../02-requirements/ssd/uc02.md).
3. Las comunicaciones hacia la capa de presentación se realizan mediante objetos
   de transferencia inmutables (`ExecutionStep`, `MemorySnapshot`).

## Motivación

Garantiza alta cohesión, bajo acoplamiento y permite que las suites de pruebas
TDD se ejecuten en milisegundos sin emulación de navegadores.

## Asuntos no resueltos

- Definir el mecanismo de notificación de eventos continuos hacia el almacén de
  estado reactivo (Pinia).

## Alternativas consideradas

- **Integración de Composition API en el motor:** Descartada por acoplar el
  dominio al framework de presentación.
- **Ejecución en Web Workers:** Postergada para fases posteriores si la carga de
  cómputo degrada la respuesta visual.
