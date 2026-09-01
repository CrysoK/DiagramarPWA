# TM-02: Modelo de ejecución y representación de memoria

> **Versión:** `0.1.0`

## Asunto

Estrategia de interpretación paso a paso, manejo de ámbitos de memoria y tipado
estático con soporte legado.

## Resumen de la solución

Aplicar el patrón _Interpreter (GoF)_ recursivo para expresiones y un _Stepper_
explícito con pila de marcos (`ExecutionFrame[]`) para sentencias. Representar
los valores en memoria mediante uniones discriminadas (_tagged unions_) tipadas
(`RuntimeValue`).

## Factores arquitectónicos

- **Observabilidad ([UC02](../../02-requirements/use-cases/uc02.md)):**
  Pausabilidad inmediata y actualización de la prueba de escritorio tras cada
  instrucción.
- **Transpilación a C
  ([UC03](../../02-requirements/use-cases/brief-use-cases.md#uc03-transpilar-algoritmo-a-lenguaje-c)):**
  Exigencia de invariantes estáticos de tipos y dimensiones.
- **Retrocompatibilidad:** Soporte de tipado dinámico y coerción libre para
  archivos históricos `.deb` ([_Diagramar
  2009_](../../02-requirements/domain-rules/diagramar-2009.md)).

## Solución

1. **Valores:** `RuntimeValue = { type: DataType, value: PrimitiveValue }`
   desacopla la representación física de las reglas semánticas del perfil.
2. **Control de flujo:** `StatementNode.execute(context)` devuelve una acción
   `NextAction` (`ADVANCE`, `PUSH_FRAME`, `PUSH_AND_ADVANCE`). La clase
   `Simulation` administra `executionStack: ExecutionFrame[]`, evitando
   recursión de control bloqueante.
3. **Resolución de variables:** `MemoryScope` delega en `SymbolTable` el
   registro y búsqueda de variables (`Symbol` -> `MemoryCell`).

## Motivación

El _stepper_ explícito convierte la ejecución en una máquina de estados
discreta, previniendo desbordamientos de pila (_stack overflow_) y habilitando
la inspección inmutable del estado.

## Asuntos no resueltos

- Límite máximo de pasos retenidos en memoria antes de aplicar compresión en
  `ExecutionTrace`.

## Alternativas consideradas

- **Evaluación recursiva directa sobre sentencias:** Descartada por bloquear el
  hilo de la UI y no permitir pausas limpias entre bloques.
- **Compilación a JavaScript vía `eval`:** Descartada por impedir el seguimiento
  paso a paso de variables en memoria.
