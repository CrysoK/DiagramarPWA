# Visión

> **Versión:** `0.1.0`

## 1. Resumen ejecutivo

**Diagramar PWA** es un entorno interactivo y multiplataforma para el
aprendizaje, construcción, depuración y evaluación de algoritmos estructurados
representados mediante **Diagramas de Nassi-Shneiderman (N-S)**.

La plataforma sustituye a la herramienta de escritorio heredada _Diagramar
(2009)_, resolviendo sus limitaciones de portabilidad (exclusiva de Windows),
inestabilidad gráfica y vulnerabilidad ante copias académicas. Diseñada como una
Aplicación Web Progresiva (_Progressive Web App_ - PWA), opera de forma 100%
autónoma en el cliente (_client-side_), funciona sin conexión a internet y
provee mecanismos criptográficos para la evaluación automatizada y la auditoría
de entregas académicas.

## 2. Planteamiento del problema y caso de negocio

### 2.1 Declaración del problema

| Aspecto                          | Descripción                                                                                                                                                                                                                                         |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El problema de...**            | La obsolescencia tecnológica de la herramienta heredada _Diagramar (2009)_: falta de portabilidad (exclusiva de Windows), inestabilidad gráfica, rigidez de edición y ausencia de mecanismos de validación de integridad en los archivos generados. |
| **Afecta a...**                  | Aproximadamente 930 estudiantes de la asignatura _Elementos de Programación_ (~350 alumnos activos en instancias evaluativas) y al cuerpo docente compuesto por 8 comisiones de trabajos prácticos.                                                 |
| **El impacto es...**             | Exclusión de estudiantes con entornos Linux/macOS, imposibilidad de realizar evaluaciones digitales seguras y una sobrecarga operativa docente por corrección manual en papel (~128 horas netas de trabajo por examen parcial).                     |
| **Una solución eficaz sería...** | Un entorno web progresivo e instalable, multiplataforma, con depuración paso a paso, evaluación automática mediante casos de prueba y trazabilidad criptográfica del proceso de resolución.                                                         |

### 2.2 Declaración de posicionamiento del producto

- **Para:** Los estudiantes y docentes de la cátedra _Elementos de
  Programación_.
- **Que necesitan:** Un entorno confiable e intuitivo para diseñar, depurar,
  validar y evaluar algoritmos mediante estructogramas Nassi-Shneiderman.
- **Diagramar PWA:** Es una aplicación web progresiva de modelado y ejecución
  algorítmica.
- **Que permite:** Construir diagramas visuales mediante manipulación directa,
  simular la ejecución paso a paso con seguimiento de memoria, traducir a
  lenguaje C y calificar automáticamente mediante baterías de prueba.
- **A diferencia de:** La herramienta heredada _Diagramar (2009)_ y alternativas
  de escritorio generalistas como _Structorizer_.
- **Nuestro producto:** Opera en cualquier navegador moderno sin requerir
  servidores ni dependencias locales, funciona completamente fuera de línea,
  mantiene retrocompatibilidad con archivos `.deb` y resguarda la autoría
  académica mediante firmas digitales y registros de eventos inmutables
  (_hash-chain_).

### 2.3 Factibilidad operativa

El sistema está diseñado para suprimir las restricciones logísticas de la
cátedra:

- **Para los estudiantes:** Al tratarse de una PWA que no requiere emuladores ni
  máquinas virtuales, elimina las barreras de acceso para usuarios de Linux y
  macOS.
- **Para el cuerpo docente:** Permite reintroducir la evaluación práctica
  mediante software con auditoría de integridad, reduciendo los tiempos de
  devolución de notas.
- **Transición amortiguada:** La retrocompatibilidad con archivos `.deb` y la
  fidelidad notacional aseguran la reutilización del material didáctico
  existente.

### 2.4 Factibilidad económica y análisis costo/beneficio

El proyecto no requiere costos de licencias comerciales ni servidores de
aplicaciones: al ser una aplicación web estática autónoma (_client-side_), se
despliega sobre plataformas con capa gratuita (GitHub Pages, Vercel), con
posibilidad de migración a servidores de la UNSa.

El costo de desarrollo se cuantifica en base a las horas de ingeniería
estimadas, tomando como referencia los honorarios mínimos indicativos del
Consejo Profesional de Agrimensores, Ingenieros y Profesiones Afines (COPAIPA,
Enero 2026) para el rol de _analista programador_ ($13.167/hora). La inversión
representa esfuerzo académico de seminario de grado.

El beneficio tangible radica en la optimización de horas-hombre docentes en la
corrección de exámenes masivos (~350 entregas), valuadas según la escala
salarial universitaria (Marzo 2026, JTP con dedicación simple: $6.514/hora).

A continuación se formalizan los costos de desarrollo (Tabla 1), el ahorro
operativo por examen (Tabla 2) y el análisis de amortización teórica (Tabla 3).

#### Tabla 1: Estimación de costos de desarrollo

| Recurso                      | Descripción               | Detalle                                   | Monto total    |
| :--------------------------- | :------------------------ | :---------------------------------------- | :------------- |
| Recurso humano               | Analista programador      | 400 hs. a $13.167/h                       | $5.267.088     |
| Hardware                     | Equipo de desarrollo      | Provisto por el alumno                    | $0             |
| Software                     | Licencias (Vue, TS, Vite) | Código abierto (MIT/Apache)               | $0             |
| Infraestructura              | Hosting estático          | Despliegue gratuito (Vercel/GitHub Pages) | $0             |
| **Costo total de inversión** |                           |                                           | **$5.267.088** |

#### Tabla 2: Beneficios tangibles por instancia evaluativa masiva

| Concepto de ahorro                         | Horas docentes recuperadas | Monto equivalente |
| :----------------------------------------- | :------------------------: | :---------------- |
| Corrección automatizada (1 examen parcial) |          128 hs.           | $833.792          |
| **Beneficio tangible por instancia**       |                            | **$833.792**      |

#### Tabla 3: Análisis de punto de equilibrio y amortización

| Instancias evaluativas | Costo acumulado | Beneficio acumulado |  Flujo neto   |
| :--------------------: | :-------------: | :-----------------: | :-----------: |
|           1            |   $5.267.088    |      $833.792       |  -$4.433.296  |
|           2            |   $5.267.088    |     $1.667.584      |  -$3.599.504  |
|           3            |   $5.267.088    |     $2.501.376      |  -$2.765.712  |
|           4            |   $5.267.088    |     $3.335.168      |  -$1.931.920  |
|           5            |   $5.267.088    |     $4.168.960      |  -$1.098.128  |
|           6            |   $5.267.088    |     $5.002.752      |   -$264.336   |
|         **7**          | **$5.267.088**  |   **$5.836.544**    | **+$569.456** |

La amortización teórica de la inversión se alcanza a partir de la **séptima
instancia evaluativa masiva**, demostrando la viabilidad financiera para la
institución.

## 3. Lista de actores y objetivos de usuario

| Actor                                 | Rol / Descripción                                                         | Objetivos principales                                                                                                                                                                                                                                                                                                                                                                  |
| :------------------------------------ | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Estudiante**<br>_(Primario)_        | Alumno que modela soluciones lógicas y ejercita algoritmos estructurados. | 1. Construir y editar diagramas N-S interactivamente.<br>2. Depurar algoritmos paso a paso con seguimiento visual de memoria (prueba de escritorio).<br>3. Autoevaluar soluciones mediante casos de prueba.<br>4. Trabajar de forma fluida sin conexión a internet.<br>5. Exportar entregas de tareas y exámenes.                                                                      |
| **Docente / Cátedra**<br>_(Primario)_ | Profesor o auxiliar que diseña material didáctico y califica soluciones.  | 1. Diseñar tareas evaluables con restricciones y casos de prueba inyectados.<br>2. Sellar digitalmente las consignas mediante firma asimétrica.<br>3. Evaluar masivamente entregables mediante ejecución automática del oráculo.<br>4. Auditar la integridad y el historial de resolución de las entregas para detectar plagio.<br>5. Importar ejercicios heredados en formato `.deb`. |

## 4. Características del sistema (System Features)

- **FEAT-01: Modelado geométrico interactivo N-S:** Lienzo estructurado con
  soporte de _drag and drop_, acoplamiento magnético (_snap_), controles de
  zoom/paneo y espacio de trabajo multidiagrama organizado en pestañas.
- **FEAT-02: Análisis léxico-sintáctico en tiempo real:** Validación estática
  continua que advierte errores de tipado, variables sin inicializar y fallas de
  sintaxis en edición.
- **FEAT-03: Depuración interactiva y prueba de escritorio:** Motor de ejecución
  paso a paso con velocidad regulable, resaltado visual del bloque activo e
  inspección del estado de variables en memoria.
- **FEAT-04: Oráculo de evaluación automática:** Inyección y ejecución de casos
  de prueba (entradas vs. salidas esperadas) para validar la correctitud
  funcional del algoritmo.
- **FEAT-05: Auditoría de integridad académica y trazabilidad:** Registro
  inmutable del proceso de edición mediante cadena de hashes (_hash-chain_),
  firma asimétrica de consignas docentes, activación automática de contexto de
  examen y cálculo en vivo de métricas de resolución para la detección de
  anomalías.
- **FEAT-06: Transpilación a lenguaje C:** Generación automática de código
  fuente equivalente en C estándar (ANSI/ISO) a partir del árbol de sintaxis
  abstracta (AST).
- **FEAT-07: Perfiles de configuración sintáctica:** Parametrización del
  comportamiento del motor (_Estándar_, _Diagramar 2009 (UNSa)_, _C_, _Python_)
  con soporte para exportar e importar esquemas de reglas.
- **FEAT-08: Operación fuera de línea (PWA):** Disponibilidad total e
  instalación nativa mediante _Service Workers_ y almacenamiento local, sin
  requerir conexión a internet.
- **FEAT-09: Retrocompatibilidad con formato legado:** Conversión y
  reconstrucción semántica de diagramas almacenados en el formato histórico
  `.deb`.
- **FEAT-10: Exportación gráfica y documental:** Generación de estructogramas y
  pruebas de escritorio en formatos portables (PNG, PDF) y serialización de
  proyectos en archivos locales `.dpwa`.

## 5. Restricciones y supuestos

### 5.1 Restricciones

- **Arquitectura estrictamente Client-Side:** Sin servidor de aplicaciones ni
  base de datos centralizada; la ejecución y el almacenamiento se gestionan en
  el navegador.
- **Principio de Separación Modelo-Vista:** La lógica de dominio (AST, parser,
  intérprete, transpilador) permanece totalmente desacoplada de la interfaz de
  usuario (Vue.js).
- **Licenciamiento permisivo:** Dependencias de código abierto bajo licencias
  MIT y Apache 2.0.
- **Protección de datos:** Cumplimiento con la Ley N.º 25.326 de Protección de
  Datos Personales. No se realiza telemetría ni recolección de datos privados en
  servidores externos.

### 5.2 Supuestos

- Los usuarios disponen de un navegador web moderno con soporte para HTML5, SVG,
  Service Workers y WebCrypto API.
- Docentes y estudiantes poseen competencias básicas para la manipulación de
  archivos locales (`.json`, `.deb`, `.pdf`, `.png`).
