# Especificación suplementaria

> **Versión:** `0.1.0`

## 1. Introducción

Este documento especifica los requisitos del sistema **Diagramar PWA** que no se
describen naturalmente en los casos de uso: atributos de calidad (usabilidad,
confiabilidad, rendimiento y soportabilidad), restricciones de diseño e
implementación, interfaces externas y reglas de dominio formales, organizados
bajo la taxonomía **FURPS+**.

Dada la naturaleza _client-side_ pura del sistema (sin servidor de aplicaciones
ni base de datos centralizada), este artefacto resulta crítico para formalizar
la seguridad criptográfica en el cliente, la operación fuera de línea y el
aislamiento del motor lógico.

## 2. Funcionalidad (Aspectos transversales)

### 2.1 Seguridad y auditoría de integridad académica

El objetivo de seguridad no es la búsqueda de una inviolabilidad absoluta del
cliente —inviable en una aplicación web sin servidor—, sino eliminar la
falsificación superficial, elevar sustancialmente la barrera técnica del fraude
y proveer evidencia objetiva del proceso de resolución para la cátedra.

- **Activación contextual y transparente:** La aplicación funciona por defecto
  como un IDE libre. El contexto de evaluación (con auditoría estricta de
  eventos e identificación de alumno) se activa de forma automática y
  transparente al abrir un archivo de tarea sellado digitalmente por un docente.
- **Inalterabilidad de consignas mediante firma asimétrica:** La inalterabilidad
  de enunciados, perfiles sintácticos, restricciones de alcance y casos de
  prueba se garantiza mediante firma digital asimétrica del emisor generada
  localmente mediante la WebCrypto API. Cualquier modificación posterior
  invalida la firma de forma detectable.
- **Trazabilidad append-only (_hash-chain_):** El proceso de resolución se
  registra como un historial semántico de acciones donde cada evento incorpora
  el hash SHA-256 del anterior. Toda edición manual del archivo exportado rompe
  la cadena criptográfica.
- **Modelo de confianza y custodia de claves:** El sistema no administra roles
  ni credenciales de usuario: verifica firmas e integridad matemática. La
  confianza en una consigna proviene del canal de distribución del archivo y se
  confirma cuando el docente audita las entregas contra su propia clave pública.
  La clave privada es exportable para respaldo y custodia del docente; su
  extravío impide validar tareas emitidas previamente.
- **Identificación flexible:** La identidad del alumno (legajo o DNI) se declara
  al inicio; cualquier cambio posterior queda registrado como un evento
  auditable en la cadena, detectando intentos de intercambio de archivos entre
  estudiantes.
- **Cálculo dinámico de métricas:** Las métricas de auditoría (tiempo activo,
  ejecuciones, errores de sintaxis) no se almacenan precalculadas: se computan
  en vivo desde el historial durante la auditoría docente. Ante una ruptura de
  integridad, el sistema alerta sobre la corrupción y bloquea el reporte.
- **Límites declarados de seguridad (Exclusiones de alcance):** Quedan
  formalmente fuera del alcance de la seguridad la prevención de ayudas externas
  físicas (dispositivos móviles, consultas interpersonales) y la manipulación
  avanzada de la memoria del navegador en tiempo de ejecución (DevTools),
  asumiendo que esta última excede ampliamente las competencias esperables en un
  curso de algoritmia elemental.

### 2.2 Configuración declarativa

El comportamiento del motor (convenciones léxicas, régimen de tipado, políticas
de declaración, reglas de ámbito, modalidad de pasaje de parámetros y
subprogramas) se parametriza mediante perfiles de configuración declarativos en
formato JSON. El sistema incluye perfiles predefinidos (_Estándar_, _Diagramar
2009 UNSa_, _C_, _Python_) y permite la creación, importación y exportación de
esquemas personalizados. En contexto de evaluación, el perfil activo y las
restricciones de alcance quedan embebidos y protegidos bajo la firma digital de
la tarea.

## 3. Usabilidad (Usability)

- **Idioma:** La interfaz de usuario, mensajes diagnósticos y documentación se
  presentan íntegramente en español.
- **Manipulación directa:** Construcción visual de estructogramas mediante
  interacción de arrastrar y soltar (_drag & drop_), acoplamiento magnético
  (_snap_), controles de zoom y desplazamiento panorámico (_pan_).
- **Diagnóstico no bloqueante en edición:** Detección y notificación en tiempo
  real de inconsistencias sintácticas, tipos incompatibles o variables no
  inicializadas, señalando el bloque afectado en lenguaje natural sin
  interrumpir el flujo de edición.
- **Edición reversible:** Soporte integral de funciones de deshacer y rehacer
  (_Undo/Redo_) en el espacio de trabajo.
- **Continuidad notacional:** La representación geométrica respeta las
  proporciones y convenciones visuales de los estructogramas tradicionales de la
  cátedra para garantizar adopción inmediata.
- **Personalización:** Interfaz adaptativa basada en variables CSS que soporta
  temas visuales (Claro, Oscuro, Solarized).

## 4. Confiabilidad (Reliability)

- **Disponibilidad autónoma (_Offline-first_):** La totalidad de las funciones
  de modelado, interpretación, prueba de escritorio, transpilación y auditoría
  operan sin conexión a internet tras la primera carga o instalación de la PWA.
- **Aislamiento de fallos algorítmicos:** Los bucles infinitos o excepciones en
  el código del estudiante son contenidos por el intérprete mediante límites
  configurables de pasos y ejecución asíncrona, impidiendo el bloqueo de la
  interfaz gráfica.
- **Detección explícita de corrupción:** Ante archivos dañados o con
  firmas/hashes inválidos, el sistema presenta diagnósticos claros y precisos,
  evitando fallos silenciosos o estados inconsistentes.
- **Persistencia atómica:** La serialización consolida el espacio de trabajo
  completo (pestañas, configuraciones, historiales y firmas) en un único archivo
  local `.dpwa`.

## 5. Rendimiento (Performance)

- **Fluidez de edición:** El recálculo geométrico recursivo y renderizado del
  diagrama ante modificaciones responde en menos de 50 ms para diagramas
  estándar (hasta 100 bloques).
- **Ejecución regulable:** La velocidad de depuración paso a paso es
  configurable entre 100 ms y 2000 ms por instrucción, disponiendo además de un
  modo continuo instantáneo.
- **Eficiencia de almacenamiento:** El historial registra deltas semánticos
  (operaciones lógicas, no capturas completas de estado), generando archivos de
  proyecto inferiores a 50 KB tras sesiones prolongadas.
- **Evaluación masiva en cliente:** La verificación criptográfica, ejecución del
  oráculo de pruebas y generación de métricas para un lote de 350 entregas se
  completa en menos de 15 segundos en un equipo de desarrollo estándar.

## 6. Soportabilidad (Supportability)

- **Multiplataforma:** Ejecución homogénea en navegadores web modernos
  (Chromium, Firefox, Safari/WebKit) sobre Windows, Linux, macOS, Android e iOS.
- **Estándar PWA:** Cumplimiento estricto de estándares W3C para manifiestos de
  aplicación web y _Service Workers_, permitiendo la instalación en el sistema
  operativo y ejecución en ventana propia.
- **Mantenibilidad arquitectónica:** Aplicación estricta del **Principio de
  Separación Modelo-Vista**. El motor lógico (AST, parser, intérprete,
  transpilador) es autónomo, reutilizable y cuenta con cobertura de pruebas
  unitarias automatizadas con Vitest.
- **Extensibilidad prevista:** La arquitectura contempla la futura
  internacionalización (i18n) y el análisis de cobertura de pruebas (_Test
  Coverage_) sin requerir rediseños estructurales.

## 7. Restricciones de implementación (+)

- **Arquitectura 100% Client-Side:** No se implementará servidor de aplicaciones
  (_backend_) ni bases de datos remotas. Todo el procesamiento, validación y
  persistencia se realiza localmente.
- **Stack tecnológico:** TypeScript compilado con tipado estricto (`strict:
true`), Vue.js 3 (Composition API) para la interfaz de usuario y Vite como
  empaquetador.
- **Criptografía nativa:** Operaciones de hash (SHA-256) y firmas digitales
  asimétricas (ECDSA o RSA-PSS) ejecutadas exclusivamente sobre la **WebCrypto
  API** nativa de HTML5.
- **Convención de nomenclatura e idioma:** Código fuente, clases, métodos y
  modelos de diseño nombrados en inglés; interfaz gráfica y documentación
  funcional en español.
- **Licenciamiento permisivo:** Totalidad de librerías de terceros bajo
  licencias de código abierto permisivas (MIT, Apache 2.0). El proyecto se
  distribuye bajo licencia MIT.

## 8. Interfaces externas (Formatos de archivo)

| Formato          | Dirección           | Descripción                                                                                                                                                               |
| :--------------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.dpwa`          | Lectura / Escritura | Archivo de proyecto nativo: diagramas (pestañas), perfil activo, restricciones, tarea firmada e historial encadenado. Formato estándar para proyectos, tareas y entregas. |
| `.json` (config) | Lectura / Escritura | Exportación/importación independiente de perfiles de configuración, restricciones de alcance o casos de prueba.                                                           |
| `.json` (claves) | Lectura / Escritura | Par de claves criptográficas del docente en formato JWK para respaldo y distribución en la cátedra.                                                                       |
| `.deb`           | Solo lectura        | Formato binario/XML heredado de _Diagramar (2009)_ para migración de material didáctico histórico.                                                                        |
| CSV              | Solo escritura      | Reporte tabular consolidado de calificaciones y auditoría docente resultante de la evaluación masiva.                                                                     |
| PNG / PDF        | Solo escritura      | Exportación gráfica del estructograma y de la traza de la prueba de escritorio.                                                                                           |

## 9. Reglas de dominio (Domain Rules)

### 9.1 Reglas generales y estructuración

| ID          | Regla                            | Descripción                                                                                                                                                                                             |
| :---------- | :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **RULE-01** | Semántica Nassi-Shneiderman      | El flujo de control es estrictamente descendente y condicionado por la contigüidad espacial de bloques. Se prohíben bifurcaciones incondicionales (_goto_).                                             |
| **RULE-02** | Convenciones sintácticas         | El motor soporta la notación tradicional de cátedra (`MOD[A;B]`, `<>`, `matriz[i;j]`) y notación estándar (`A % B`, `!=`, `matriz[i][j]`). Su aceptación se define en el perfil activo.                 |
| **RULE-03** | Invariantes de transpilación a C | La traducción a C exige consistencia estática: listas homogéneas acotadas traducen a arreglos C; listas heterogéneas o dinámicas detienen la exportación con advertencia diagnóstica.                   |
| **RULE-04** | Modularización y subprogramas    | El sistema admite subprogramas estructurados como funciones (retorno en expresiones) y procedimientos (bloques de invocación dedicados). Los parámetros formales pueden ser por valor o por referencia. |

### 9.2 Memoria dinámica y punteros

| ID          | Regla                      | Descripción                                                                                                                                                       |
| :---------- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RULE-05** | Reserva dinámica (`nuevo`) | Instancia una celda en memoria dinámica y retorna su referencia válida (`esNulo = falso`).                                                                        |
| **RULE-06** | Liberación (`liberar`)     | Desasigna la memoria asociada a una referencia vigente y la establece en `NULO`. Intentar liberar `NULO` o una referencia inválida produce un error de ejecución. |
| **RULE-07** | Desreferenciación nula     | Intentar acceder a los miembros de una referencia `NULO` genera un error de ejecución.                                                                            |

### 9.3 Listas y estructuras compuestas

| ID          | Regla                 | Descripción                                                                                                                                                                                  |
| :---------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RULE-08** | Declaración de cotas  | La definición de cotas `[inf..sup]` fija la base y capacidad. Sin cotas, el límite inferior toma el valor de `baseIndexacion` del perfil (0 o 1).                                            |
| **RULE-09** | Crecimiento de listas | Si el perfil admite dimensión dinámica, la lista puede crecer más allá de su capacidad inicial (perdiendo su capacidad de transpilar a C). Si es fija, desbordar la capacidad produce error. |
| **RULE-10** | Matrices              | Se modelan conceptualmente como listas anidadas (listas de listas).                                                                                                                          |

### 9.4 Resolución de nombres y ámbitos (_Scopes_)

| ID          | Regla                   | Descripción                                                                                                                                    |
| :---------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **RULE-11** | Jerarquía de ámbitos    | El sistema reconoce hasta tres niveles de visibilidad: Programa, Subprograma y Bloque.                                                         |
| **RULE-12** | Ocultamiento de nombres | La búsqueda de identificadores opera desde el ámbito local hacia el global. Las variables locales ocultan a las homónimas de ámbitos externos. |

### 9.5 Integridad y auditoría criptográfica

| ID          | Regla                     | Descripción                                                                                                                                                                               |
| :---------- | :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RULE-13** | Validez de firma de tarea | Una tarea es válida únicamente si la firma digital asimétrica del emisor verifica contra el contenido de la consigna. Una firma alterada impide la activación del contexto de evaluación. |
| **RULE-14** | Invariante de historial   | El historial de eventos es estrictamente acumulativo (_append-only_). Si un evento es eliminado, reordenado o modificado, la cadena de hashes queda invalidada (`esIntegro = falso`).     |

## 10. Aspectos legales

- **Protección de datos personales (Ley N.º 25.326):** El sistema carece de
  servidores centrales y bases de datos remotas. Los identificadores declarados
  por los estudiantes y sus historiales residen exclusivamente en los archivos
  `.dpwa` que los propios alumnos custodian y remiten a la cátedra.
- **Telemetría y privacidad:** El sistema no recolecta datos personales en
  servidores externos. Las métricas de uso generales son exclusivamente
  anónimas.
- **Propiedad intelectual:** No se infringen licencias privativas; todo el
  software de terceros empleado es de código abierto con licencias permisivas.
