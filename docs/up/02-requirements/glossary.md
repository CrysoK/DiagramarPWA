# Glosario y diccionario de datos

> **Versión:** `0.1.0`

Diccionario de datos conceptual y vocabulario formal de **Diagramar PWA**.
Define los términos del dominio algorítmico, del motor lógico, del esquema de
seguridad, de la plataforma y de los formatos de persistencia.

## 1. Roles y contextos de uso

- **Estudiante / Docente:** Roles de interacción definidos por el objetivo del
  usuario, no identidades autenticadas por el sistema. No existen cuentas de
  usuario, sesiones remotas ni esquemas de permisos: la totalidad de la
  herramienta es de uso libre. Las únicas distinciones técnicas son la
  activación del **contexto de evaluación** y la posesión de la clave privada
  del **emisor**.
- **Emisor:** Actor que genera y firma digitalmente una tarea evaluable.
  Típicamente un docente; el sistema vincula criptográficamente el contenido a
  una clave pública, no a una persona acreditada por un servidor.
- **Modo libre:** Estado por defecto de la aplicación donde opera como un
  entorno de desarrollo integrado (IDE) abierto. El historial semántico alimenta
  métricas de autoevaluación para el propio estudiante.
- **Contexto de evaluación:** Estado activado de forma transparente al abrir una
  tarea con firma digital válida. Fija las reglas y restricciones del ejercicio
  (no modificables durante la resolución) e incorpora eventos de auditoría
  estricta en el historial encadenado.
- **Identificador declarado:** Dato identificatorio (número de legajo, DNI)
  introducido por el estudiante al iniciar una tarea evaluable. No se valida
  contra un padrón centralizado; cualquier corrección o cambio queda registrado
  cronológicamente en el historial encadenado.

## 2. Perfiles de configuración y restricciones

- **Perfil de configuración:** Esquema declarativo nombrado que define las
  reglas sintácticas y semánticas del motor: operadores aceptados, régimen de
  tipado, política de declaración, reglas de ámbito, base de indexación y
  habilitación de subprogramas. Es exportable e importable como archivo JSON.
- **Perfiles embebidos:** Esquemas de fábrica provistos con el sistema y no
  eliminables:
  - _Estándar:_ Referencia moderna general del producto.
  - _Diagramar 2009 (UNSa):_ Reglas históricas de la herramienta legada y de la
    cátedra.
  - _C_ y _Python:_ Convenciones léxicas y operacionales próximas a dichos
    lenguajes.
- **Perfil de usuario:** Perfil personalizado creado por un docente o
  institución, distribuible como archivo JSON independiente.
- **Régimen de tipado:** Disciplina aplicada por el analizador semántico
  (`estático` con inferencia fuerte o `dinámico` con celdas de tipo libre).
- **Política de declaración:** Modalidad de nacimiento de variables: `explícita`
  (obligatoria antes de su uso) o `implícita` (nace en la primera asignación o
  lectura).
- **Política de ámbitos:** Niveles de visibilidad habilitados y resolución
  jerárquica de identificadores.
- **Longitud de lista:** Régimen dimensional (`fija` o `dinámica`). Si es
  dinámica, permite mutaciones de tamaño en tiempo de ejecución (lo que anula la
  exportación directa a arreglos estáticos de C).
- **Subprogramas (on/off):** Parámetro que habilita o inhabilita la gestión de
  pestañas secundarias (funciones y procedimientos) en el espacio de trabajo.
- **Restricciones de alcance:** Lista de construcciones sintácticas (tipos de
  bloques, tipos de datos, recursión, punteros) habilitadas o prohibidas para
  una tarea evaluable específica, adaptada a la progresión didáctica de la
  cátedra. Es ortogonal al perfil: el perfil define cómo se interpreta el
  lenguaje; las restricciones definen qué elementos están permitidos en el
  ejercicio.

## 3. Dominio algorítmico y estructogramas

- **Diagrama de Nassi-Shneiderman (N-S) o estructograma:** Representación
  gráfica para el diseño de algoritmos estructurados (Nassi y Shneiderman,
  1973). El flujo de control es estrictamente descendente y está determinado por
  la contigüidad espacial de los bloques geométricos, impidiendo el uso de salto
  incondicionales (_goto_).
- **Bloque N-S:** Unidad gráfica y semántica elemental. Catálogo:
  - `Entrada`: Lectura de datos externos asignados a un destino de memoria.
  - `Salida`: Emisión de expresiones evaluadas o cadenas literales hacia la
    consola.
  - `Asignación`: Evaluación de una expresión y almacenamiento en un destino de
    memoria.
  - `Invocación (procedimiento)`: Ejecución de un subprograma como sentencia
    independiente.
  - `Alternativa`: Bifurcación condicional booleana (ramas Verdadero y Falso).
  - `Ciclo Mientras`: Iteración pretest que evalúa la condición antes de cada
    repetición.
  - `Ciclo Repetir-Hasta`: Iteración postest que evalúa la condición de corte al
    final.
  - `Ciclo Para`: Iteración incondicional gobernada por variable de control,
    valor inicial, final y paso.
- **Subprograma (Módulo):** Diagrama secundario alojado en una pestaña
  independiente. Puede actuar como **función** (invocada en expresiones, con
  retorno de valor) o **procedimiento** (ejecutado mediante un bloque de
  invocación específico).
- **Parámetro formal:** Identificador declarado en la cabecera de un
  subprograma. Modalidades de paso:
  - _Por valor:_ El subprograma recibe una copia aislada del valor; las
    mutaciones no alteran la memoria del invocador.
  - _Por referencia:_ El parámetro enlaza directamente a la celda de memoria del
    argumento; las mutaciones son visibles en el invocador.
- **Lienzo:** Superficie interactiva donde se construye, edita y anima el
  estructograma activo mediante acoplamiento magnético, zoom y desplazamiento
  panorámico.
- **Espacio de trabajo (_Workspace_):** Sesión integral de trabajo que agrupa el
  diagrama principal, los subprogramas, el perfil activo, las restricciones de
  alcance y el historial de acciones. Constituye la unidad de persistencia del
  archivo `.dpwa`.
- **Expresión:** Construcción sintáctica de literales, variables, operadores y
  funciones que puede ser evaluada para producir un valor.
- **Convenciones sintácticas:** Reglas y operadores válidos reconocidos por el
  motor (ej. `MOD[A;B]`, `<>`, `matriz[i;j]` vs. `A % B`, `!=`, `matriz[i][j]`).
- **Variable:** Posición de almacenamiento con nombre, tipo de dato y ámbito
  asociado.
- **Destino de variable / memoria (_l-value_):** Designación formal del receptor
  de una escritura o lectura. El **especificador** define el mecanismo de
  acceso:
  - _Simple:_ Variable atómica directa.
  - _Elemento de lista:_ Celda indexada (`L[i]`, `M[i][j]`).
  - _Campo de registro:_ Miembro nombrado (`registro.campo`).
  - _Desreferenciación:_ Celda apuntada por una referencia (`p.dato`, `p->dato`,
    `p^.dato`).
- **Tipo de dato:** Clasificación conceptual de los valores:
  - _Tipos simples:_ Escalares atómicos (`Entero`, `Real`, `Lógico`, `Carácter`,
    `Cadena`).
  - _Tipos estructurados:_ Composiciones homogéneas o heterogéneas (`Lista`,
    `Registro`, `Enumeración`, `Puntero`).
- **Ámbito (_Scope_):** Región del algoritmo donde un identificador es
  accesible. Jerarquía: `Programa` (global a la sesión), `Subprograma` (local al
  módulo) y `Bloque` (local al cuerpo de una estructura condicional o
  iterativa).
- **Puntero:** Tipo de dato cuyos valores son direcciones de memoria a celdas o
  el literal constante `NULO`.
- **Referencia (dirección / puntero):** Enlace que designa una celda de memoria
  o `NULO`. El predicado `esNulo` es verdadero si no apunta a ninguna celda
  válida.
- **`NULO`:** Literal que representa una referencia inválida. Intentar
  desreferenciarla genera un error de ejecución.
- **Celda de memoria:** Unidad básica de almacenamiento físico de un valor
  escalar o referencia.
- **Lista:** Secuencia indexada unidimensional. Sus cotas son opcionales en la
  declaración: `[n]` (capacidad fija con base según perfil) o `[inf..sup]`
  (rango explícito). Las matrices se modelan conceptualmente como listas de
  listas.
- **Registro:** Estructura de datos compuesta por un conjunto heterogéneo de
  campos nombrados con sus propios tipos.
- **Enumeración:** Tipo de dato compuesto por un conjunto finito de
  identificadores o constantes simbólicas.
- **Prueba de escritorio:** Procedimiento analítico de depuración que registra
  el avance secuencial del algoritmo, las salidas producidas y las mutaciones
  del estado de la memoria en cada paso.
- **Paso de simulación:** Unidad elemental de avance en la depuración. Asocia el
  bloque activo, el número de paso y el estado resultante de la memoria.
- **Ámbito de memoria:** Marco de variables visibles en memoria durante la
  ejecución de un paso, ligado al contexto del subprograma activo.

## 4. Motor lógico y arquitectura

- **Analizador léxico-sintáctico (_Parser_):** Componente de la capa de dominio
  que valida las cadenas de texto de los bloques contra la gramática formal
  activa y genera el AST.
- **Árbol de sintaxis abstracta (AST):** Estructura arbórea en memoria que
  representa la semántica lógica del algoritmo, desacoplada de la vista
  geométrica.
- **Intérprete (_Interpreter_):** Motor de ejecución que recorre el AST en modo
  continuo o paso a paso, gestiona la tabla de símbolos y actualiza el estado de
  la memoria.
- **Tabla de símbolos:** Estructura de datos dinámica que almacena
  identificadores, tipos, ámbitos y referencias de memoria activas.
- **Transpilador a C:** Generador de código que traduce la semántica del AST a
  código fuente equivalente en lenguaje C estándar (ANSI/ISO).
- **Análisis estático:** Validación preventiva en tiempo de edición que señala
  discordancias de tipos, sintaxis errónea o variables no inicializadas antes de
  ejecutar.
- **Inferencia de tipos:** Capacidad del analizador para deducir el tipo de dato
  de una variable a partir del valor o expresión asignada en su primer uso.
- **Coerción de tipos:** Conversión implícita de un tipo de dato a otro durante
  la evaluación de expresiones según las reglas del perfil activo.
- **Caso de prueba:** Par de secuencias de datos (entradas y salidas esperadas)
  asociadas a una tarea evaluable.
- **Oráculo de pruebas:** Componente que ejecuta el algoritmo inyectando las
  entradas y cotejando las salidas producidas contra las esperadas.
- **Resultado de caso de prueba:** Veredicto emitido por el oráculo: `exitoso`,
  `salidaIncorrecta`, `tiempoExcedido` o `errorEjecucion`.
- **Principio de Separación Modelo-Vista:** Directriz de diseño que garantiza
  que los objetos de dominio (AST, parser, intérprete, transpilador) no poseen
  conocimiento ni dependencias hacia los componentes de la interfaz de usuario
  (Vue.js, DOM).
- **Agnóstico:** Cualidad del motor lógico de operar con total independencia de
  tecnologías de renderizado, librerías gráficas o frameworks externos.

## 5. Seguridad y auditoría de integridad académica

- **Tarea evaluable:** Paquete didáctico distribuido como archivo `.dpwa` que
  contiene consigna, perfil activo, restricciones y casos de prueba sellados con
  firma digital.
- **Firma digital asimétrica:** Sello criptográfico generado localmente en el
  cliente con la WebCrypto API mediante la clave privada del emisor. Garantiza
  que la consigna no ha sido alterada.
- **Par de claves del emisor:** Claves criptográficas generadas en el navegador
  del docente. La clave privada sella las tareas; la clave pública permite
  auditar entregas masivas.
- **Historial semántico de acciones:** Registro cronológico acumulativo
  (_append-only_) de operaciones de edición y ejecución realizadas por el
  usuario.
- **Acción de trabajo (Acción semántica):** Evento del historial con marca
  temporal. Tipos: `estructuracion`, `edicionTexto`, `ejecucion`, `cambioFoco`,
  `declaracionIdentidad`.
- **Encadenamiento criptográfico (_Hash-Chain_):** Mecanismo de integridad donde
  cada acción semántica incorpora el hash SHA-256 de la acción anterior.
  Cualquier alteración manual del archivo rompe la cadena (`esIntegro = falso`).
- **Métricas de auditoría:** Indicadores derivados (`/`) calculados en vivo por
  el sistema a partir del historial durante la auditoría docente:
  - `/tiempoActivo`: Suma de duraciones entre acciones consecutivas, excluyendo
    pausas fuera de foco.
  - `/cantidadEjecuciones`: Total de ejecuciones lanzadas.
  - `/totalErroresSintaxis`: Conteo de advertencias sintácticas detectadas
    durante el trabajo.
- **Entrega:** Archivo `.dpwa` exportado por el alumno con su solución, la tarea
  firmada original y el historial completo encadenado.
- **Alerta de auditoría:** Notificación visual ante anomalías de resolución.
  Motivos: `anomaliaTemporal`, `pegadoMasivo`, `inconsistenciaIdentidad`,
  `rupturaIntegridad`. Severidad: `informativa`, `advertencia`,
  `sospechaCritica`.
- **Reporte de evaluación:** Documento tabular exportable (CSV) con las
  calificaciones, veredictos del oráculo y banderas de auditoría de un lote de
  entregas.

## 6. Plataforma y formatos

- **Aplicación Web Progresiva (PWA):** Estándar web moderno (W3C) que emplea
  _Service Workers_ y manifiesto para permitir instalación en el sistema
  operativo, ejecución en ventana propia y funcionamiento autónomo sin internet.
- **Service Worker:** Hilo de ejecución en segundo plano que intercepta
  peticiones y sirve los recursos indispensables desde la caché local.
- **Arquitectura Client-Side pura:** Modelo donde todo el procesamiento,
  ejecución y persistencia se realizan en el navegador, sin servidores de
  aplicación ni bases de datos remotas.
- **WebCrypto API:** Interfaz nativa del navegador para operaciones
  criptográficas estándar (firmas ECDSA/RSA-PSS y funciones hash SHA-256).
- **Renderizado geométrico (_Layout top-down_):** Algoritmo matemático
  desacoplado que calcula recursivamente las dimensiones espaciales de los
  bloques N-S antes de dibujarlos en pantalla.

## 7. Diccionario de datos y formatos

### 7.1 Tipos de datos del motor lógico

| Tipo      | Literales / Formato                                | Operadores soportados                      | Comportamiento en transpilación a C                                              |
| :-------- | :------------------------------------------------- | :----------------------------------------- | :------------------------------------------------------------------------------- |
| `INTEGER` | Dígitos enteros (ej. `0`, `42`, `-5`)              | `+`, `-`, `*`, `/`, `%`, `MOD`, `DIV`      | Mapea a `int` o `long`.                                                          |
| `REAL`    | Decimal con punto (ej. `3.14`, `-0.5`)             | `+`, `-`, `*`, `/`                         | Mapea a `double`.                                                                |
| `BOOLEAN` | `true`, `false`, `V`, `F`, `VERDADERO`, `FALSO`    | `not`, `and`, `or`, `~`, `&`, `\|`         | Mapea a `bool` (`<stdbool.h>`) o `int`.                                          |
| `CHAR`    | Carácter entre comillas simples (ej. `'a'`, `'%'`) | Operadores relacionales (`==`, `<>`, etc.) | Mapea a `char`.                                                                  |
| `STRING`  | Texto entre comillas dobles (ej. `"Hola"`)         | `+` (concatenación según perfil)           | Mapea a `char[]` o literales de cadena.                                          |
| `POINTER` | Direcciones de memoria o literal `NULO`            | `==`, `<>`, asignación, `nuevo`, `liberar` | Mapea a punteros nativos (`Tipo*`).                                              |
| `LIST`    | Corchetes `[e1, e2]` o declarada con cotas         | Indexación `L[i]`, asignación              | Mapea a arreglos nativos C si es homogénea y acotada; si no, aborta exportación. |
| `RECORD`  | Campos clave-valor `{ c1: v1, c2: v2 }`            | Acceso a miembro `.`                       | Mapea a `struct` de C si la estructura de campos es estática.                    |
| `ENUM`    | Símbolos identificadores nominales                 | Operadores relacionales, asignación        | Mapea a `typedef enum { ... }` nativo de C.                                      |

### 7.2 Formatos de interfaz y persistencia

| Extensión        | Formato base    | Estructura principal                                                                                    | Finalidad                                                            |
| :--------------- | :-------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------- |
| `.dpwa`          | JSON / ZIP      | Workspace (diagramas, subprogramas), perfil activo, restricciones, tarea firmada, historial encadenado. | Archivo nativo de proyectos, tareas docentes y entregas de alumnos.  |
| `.json` (config) | JSON            | Objeto estructurado según esquema (perfil, reglas o casos de prueba).                                   | Intercambio y distribución modular de configuraciones de cátedra.    |
| `.json` (claves) | JSON            | Par de claves criptográficas WebCrypto en formato JWK.                                                  | Respaldo, uso en otras terminales y distribución de claves docentes. |
| `.deb`           | Binario / XML   | Serialización de clases .NET de _Diagramar (2009)_.                                                     | Migración de material didáctico histórico hacia el nuevo modelo.     |
| `.csv`           | Texto plano     | Columnas: `Identificador`, `Calificación`, `CasosSuperados`, `TiempoActivo`, `Alertas`.                 | Exportación masiva de resultados para planillas de cátedra.          |
| `.png` / `.pdf`  | Binario gráfico | Renderizado gráfico del estructograma y de la tabla de prueba de escritorio.                            | Exportación documental e impresión.                                  |
