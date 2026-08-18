# Caso de desarrollo

> **Versión:** `0.1.0`

## 1. Introducción

Este documento formaliza la personalización del **Proceso Unificado Ágil** para
el proyecto **Diagramar PWA**. Al tratarse de un desarrollo de grado
unipersonal, el proceso se enfoca en la mitigación temprana de riesgos técnicos
(_risk-driven_) y la entrega continua de incrementos ejecutables, seleccionando
únicamente los artefactos que aportan valor directo al diseño, construcción y
validación del sistema.

## 2. Entorno y estándares del proyecto

### 2.1 Herramientas de soporte

- **Control de versiones:** Git con repositorio centralizado en GitHub.
- **Entorno de desarrollo (IDE):** Visual Studio Code.
- **Marco de pruebas unitarias (_xUnit_):** Vitest para la verificación
  automatizada del parser, AST e intérprete.
- **Gestión ágil:** Tablero Kanban en GitHub Projects para la administración
  visual de tareas e iteraciones.

### 2.2 Estándares de modelado (UML)

- **UML como boceto (_UML as sketch_):** Los diagramas se emplean para explorar,
  razonar y comunicar decisiones de diseño previas o paralelas a la
  programación, evitando el modelado exhaustivo y la sobrecarga documental.
- **Notación en texto plano:** Los diagramas UML se redactan mediante sintaxis
  Mermaid.js incrustada directamente en los documentos Markdown, facilitando el
  control de versiones en Git.

### 2.3 Estándares de código y arquitectura

- **Principio de Separación Modelo-Vista:** La capa de dominio (núcleo en
  TypeScript: AST, intérprete, transpilador) no posee dependencias ni
  referencias a los componentes de presentación (Vue.js).
- **Tipado estricto:** Compilación con TypeScript bajo la directiva `strict:
true`.
- **Convención idiomática:** Nomenclatura del código fuente y modelos de diseño
  en inglés; interfaz de usuario y documentación funcional en español.

## 3. Matriz del ciclo de vida de artefactos

> **Convención:** `s` = Inicio del artefacto (_start_); `r` = Refinamiento o
> actualización (_refine_).

| Disciplina               | Artefacto                                   | Inicio<br>_(I1)_ | Elaboración<br>_(E1..En)_ | Construcción<br>_(C1..Cn)_ | Transición<br>_(T1..T2)_ |
| :----------------------- | :------------------------------------------ | :--------------: | :-----------------------: | :------------------------: | :----------------------: |
| **Modelado de negocio**  | Modelo de dominio                           |        s         |             r             |                            |                          |
| **Requisitos**           | Documento de visión                         |        s         |             r             |                            |                          |
|                          | Modelo de casos de uso                      |        s         |             r             |             r              |                          |
|                          | Especificación suplementaria                |        s         |             r             |                            |                          |
|                          | Glosario y diccionario de datos             |        s         |             r             |                            |                          |
| **Diseño**               | Modelo de diseño (DCD, Secuencia)           |                  |             s             |             r              |                          |
|                          | Documento de arquitectura de software (SAD) |                  |             s             |             r              |                          |
| **Implementación**       | Modelo de implementación (Código fuente)    |                  |             s             |             r              |            r             |
| **Pruebas**              | Modelo de pruebas (Pruebas unitarias)       |                  |             s             |             r              |            r             |
| **Gestión del proyecto** | Plan de fase                                |        s         |             r             |                            |                          |
|                          | Plan de iteración                           |        s         |             r             |             r              |            r             |
|                          | Lista de riesgos                            |        s         |             r             |                            |                          |
| **Entorno**              | Caso de desarrollo                          |        s         |             r             |                            |                          |

## 4. Justificación y alcance de artefactos

### 4.1 Modelado de negocio

- **Modelo de dominio:** Captura visualmente las clases conceptuales del
  problema (estructogramas, bloques, variables, memoria, ámbitos). Se inicia en
  Inicio y se consolida en Elaboración; no se mantiene como modelo formal en
  Construcción para evitar duplicación con el código fuente.

### 4.2 Requisitos

- **Documento de visión:** Resumen ejecutivo que establece el caso de negocio,
  la lista de actores/objetivos, las _System Features_ y las restricciones del
  producto.
- **Modelo de casos de uso:**
  - _Formato breve:_ Define la totalidad del alcance funcional en la fase de
    Inicio.
  - _Formato detallado:_ Reservado exclusivamente para el subconjunto crítico
    (~10%) que gobierna el núcleo de la arquitectura: _UC02 (Ejecutar y depurar
    algoritmo)_ y _UC06 (Resolver tarea evaluable)_.
  - _Diagramas de secuencia del sistema (DSS):_ Se construyen para los casos de
    uso críticos con el fin de identificar formalmente las operaciones del
    sistema como caja negra.
- **Especificación suplementaria:** Centraliza todos los requisitos no
  funcionales (FURPS+), restricciones tecnológicas y reglas de negocio formales
  (semántica N-S, tipado, memoria dinámica, criptografía).
- **Glosario:** Define el vocabulario común y opera como diccionario de datos
  para los tipos de datos, estructuras de memoria y formatos de archivo.

### 4.3 Diseño

- **Modelo de diseño:** Comprende los diagramas de interacción y diagramas de
  clases de diseño (DCD) enfocados en resolver los puntos complejos del motor
  lógico (patrón _Interpreter_, gestión de ámbitos, cálculo geométrico).
- **Documento de arquitectura de software (SAD):** Consolida las decisiones
  técnicas (_Technical Memos_) y las vistas arquitectónicas relevantes del
  modelo N+1 (Lógica, Despliegue y Procesos). No se crea de forma especulativa
  en papel, sino que documenta la arquitectura ejecutable base estabilizada
  durante Elaboración.

### 4.4 Implementación y pruebas

- **Modelo de implementación:** Código fuente modular en TypeScript y
  componentes reactivos en Vue.js.
- **Modelo de pruebas:** Siguiendo la práctica de desarrollo guiado por pruebas
  (_Test-Driven Development_ - TDD), se construyen suites de pruebas unitarias
  automatizadas con Vitest para validar el parser, AST e intérprete antes de su
  integración visual.

### 4.5 Gestión del proyecto

- **Plan de fase:** Establece los hitos macro del proyecto vinculados al
  calendario académico del Seminario.
- **Plan de iteración:** Planes operativos de corto plazo (2 a 4 semanas) con
  caja de tiempo (_timebox_) fija que detallan los escenarios específicos a
  implementar.
- **Lista de riesgos:** Registro jerárquico de incertidumbres técnicas y
  operativas con sus correspondientes planes de mitigación.

## 5. Prácticas ágiles complementarias

1. **Desarrollo dirigido por el riesgo (_Risk-Driven_):** El esfuerzo de las
   primeras iteraciones de Elaboración se asigna a construir el núcleo
   ejecutable del intérprete y el cálculo geométrico N-S (mitigación de R1 y
   R2).
2. **Planificación adaptativa (_Adaptive Planning_):** Se evitan planes
   predictivos rígidos; el alcance de cada iteración se reajusta al cierre de la
   anterior en función de la velocidad real y la retroalimentación.
3. **Desarrollo guiado por pruebas (TDD):** Implementación incremental de
   pruebas de unidad previas o simultáneas a la codificación de las reglas
   sintácticas y semánticas del motor algorítmico.
