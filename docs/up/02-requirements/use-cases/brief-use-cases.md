# Casos de uso

> **Versión:** `0.1.0`

## 1. Tabla de actores y objetivos (_Actor-Goal List_)

| Actor          | Objetivo / Caso de uso                                | Nivel     | Formato en Inicio                     |
| :------------- | :---------------------------------------------------- | :-------- | :------------------------------------ |
| **Estudiante** | **UC01:** Construir algoritmo N-S                     | User-goal | _Brief_                               |
|                | **UC02:** Ejecutar y depurar algoritmo                | User-goal | _Brief_ (Candidato a _Fully dressed_) |
|                | **UC03:** Transpilar algoritmo a lenguaje C           | User-goal | _Brief_                               |
|                | **UC04:** Gestionar proyecto y exportación            | User-goal | _Brief_                               |
|                | **UC05:** Importar diagrama legado                    | User-goal | _Brief_                               |
|                | **UC06:** Resolver tarea evaluable                    | User-goal | _Brief_ (Candidato a _Fully dressed_) |
|                | **UC07:** Instalar aplicación para uso fuera de línea | User-goal | _Brief_                               |
| **Docente**    | **UC08:** Elaborar tarea evaluable                    | User-goal | _Brief_                               |
|                | **UC09:** Evaluar y auditar entregas masivas          | User-goal | _Brief_                               |
|                | **UC10:** Gestionar perfiles de configuración         | User-goal | _Brief_                               |

## 2. Especificación de casos de uso en formato breve (_Brief_)

### Actor primario: Estudiante / Usuario general

#### UC01: Construir algoritmo N-S

**Resumen:** El estudiante construye o modifica un algoritmo estructurado en el
lienzo interactivo agregando, moviendo, reestructurando y editando bloques
geométricos N-S (secuencia, alternativa, ciclos, asignación, entrada/salida e
invocación de procedimientos). Puede organizar el espacio de trabajo mediante el
programa principal y sus subprogramas/módulos, así como definir sus parámetros
formales y modos de paso. El sistema valida la sintaxis en tiempo real y
mantiene la contigüidad espacial propia de los estructogramas.

#### UC02: Ejecutar y depurar algoritmo

**Resumen:** El estudiante ejecuta el algoritmo representado en el diagrama de
forma continua o paso a paso. Durante la ejecución, el sistema resalta el bloque
activo, permite regular la velocidad de paso, gestiona la consola interactiva de
entrada/salida y actualiza en tiempo real la prueba de escritorio, reflejando
las mutaciones de las variables y el estado de la memoria según el ámbito
activo.

#### UC03: Transpilar algoritmo a lenguaje C

**Resumen:** El estudiante solicita la traducción de la lógica del estructograma
a código fuente estructurado en lenguaje C estándar (ANSI/ISO). El sistema
analiza la consistencia semántica y de tipos del algoritmo y emite el código
equivalente limpio e idiomático para su visualización, guardado o copia.

#### UC04: Gestionar proyecto y exportación

**Resumen:** El usuario guarda el estado completo del espacio de trabajo
(diagrama principal, subprogramas, perfil activo, restricciones e historial) en
un archivo local `.dpwa`, o carga un proyecto previamente almacenado. Asimismo,
exporta la representación gráfica del estructograma y la traza de la prueba de
escritorio a formatos visuales o portables (PNG/PDF).

#### UC05: Importar diagrama legado

**Resumen:** El usuario selecciona un archivo producido por la herramienta
heredada (_Diagramar 2009_, extensión `.deb`). El sistema decodifica la
estructura de origen, traduce sus componentes al nuevo modelo algorítmico y
reconstruye el diagrama en el lienzo para su posterior edición, depuración o
transpilación.

#### UC06: Resolver tarea evaluable

**Resumen:** El estudiante abre un archivo de tarea firmado digitalmente. El
sistema valida la integridad de la consigna y la autenticidad de la firma,
activa automáticamente el contexto de evaluación y registra el identificador
declarado por el alumno (legajo/DNI). El estudiante resuelve el ejercicio,
comprueba su lógica contra la batería de casos de prueba embebida y exporta su
entrega final conteniendo el historial semántico encadenado criptográficamente
(_hash-chain_). El trabajo puede interrumpirse y retomarse en múltiples sesiones
sin comprometer la integridad.

#### UC07: Instalar aplicación para uso fuera de línea

**Resumen:** El usuario solicita la instalación de la aplicación en su
dispositivo desde el navegador web. El sistema configura el entorno local para
garantizar la disponibilidad completa de las funciones de modelado, ejecución y
evaluación en ventana independiente y sin requerir conexión a internet.

### Actor primario: Docente / Cátedra

#### UC08: Elaborar tarea evaluable

**Resumen:** El docente configura una actividad académica estableciendo el
enunciado, seleccionando el perfil de configuración aplicable, definiendo las
restricciones de alcance sobre los bloques/estructuras permitidas e inyectando
una batería de casos de prueba (entradas y salidas esperadas). El sistema
empaqueta la consigna y genera un archivo de tarea sellado mediante su firma
digital asimétrica para su distribución a los alumnos.

#### UC09: Evaluar y auditar entregas masivas

**Resumen:** El docente proporciona un lote de archivos de entrega (`.dpwa`)
correspondientes a una tarea evaluable. El sistema valida la firma original de
la tarea y la continuidad del historial encadenado de cada entrega, ejecuta
automáticamente el oráculo de pruebas para determinar la correctitud del
algoritmo y calcula en vivo las métricas de auditoría (tiempo activo, errores
sintácticos, ejecuciones y modificaciones de identidad). El sistema emite
alertas visuales ante inconsistencias de autoría o rupturas de integridad, y
exporta el reporte consolidado de calificaciones (CSV) para su integración con
las planillas de cátedra.

#### UC10: Gestionar perfiles de configuración

**Resumen:** El docente consulta, personaliza, crea, exporta o importa perfiles
que gobiernan las reglas sintácticas y semánticas del motor (operadores válidos,
tipado estricto vs. dinámico, convenciones de indexación, reglas de ámbito,
modalidad de pasaje de parámetros y habilitación de subprogramas), partiendo de
los esquemas predefinidos (_Estándar_, _Diagramar 2009 (UNSa)_, _C_, _Python_) o
definiendo variantes institucionales.
