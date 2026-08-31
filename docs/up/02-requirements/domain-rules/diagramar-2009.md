# Diagramar 2009

> **Versión:** `0.1.0`

Especificación de la semántica observada en _Diagramar_ (UNSa, 2009),
reconstruida a partir del evaluador, el manejador de variables, los bloques N-S
y el _Manual de usuario_. Destino: perfil embebido **Diagramar 2009 (UNSa)** de
Diagramar PWA.

El lenguaje no es un lenguaje textual autónomo. El programa es un diagrama
Nassi–Shneiderman: una secuencia vertical de bloques. Lo que se escribe es solo
el contenido de cada bloque (expresiones de asignación, condiciones, listas de
variables). La composición secuencial, la alternativa y los ciclos están en la
geometría del diagrama, no en palabras clave de control.

Fuentes: `Evaluador`, `ManejadorDeVariables`, `Asignacion`, `Ingreso`, `Salida`,
`Alternativa`, `CicloCondicional`, `CicloIncondicional`, `Bloque` y el manual
(apartado _Sintaxis, operadores y funciones_).

## 1. Modelo de programa

- Un diagrama: un único bloque raíz, sin subprogramas, sin funciones de usuario
  y sin ámbitos anidados.
- Memoria global única. Toda variable es visible en todo el diagrama.
- Declaración implícita: la variable nace en la primera asignación o en el
  primer ingreso.
- Tipado dinámico de dos valores escalares: **número** (`double`) y **cadena**
  (`string`). No hay tipo lógico almacenable, ni carácter, ni entero como tipo
  distinto, ni registros.
- No hay `break`, `continue`, `return`, _repetir-hasta_, selección múltiple ni
  invocación de procedimientos.

Los **componentes** del panel de herramientas (contador, búsqueda binaria,
ordenamientos, etc.) no son construcciones del lenguaje: el editor pega un
fragmento de diagrama.

### 1.1 Bloques

| Bloque              | Rol                  | Contenido                                              |
| :------------------ | :------------------- | :----------------------------------------------------- |
| Entrada             | Ingreso              | Lista de l-valores separados por `,`                   |
| Asignación          | Efecto sobre memoria | Lista de `lvalor=expr` separados por `,`               |
| Salida              | Escritura            | Lista de expresiones o literales separados por `,`     |
| Alternativa         | Selección binaria    | Expresión lógica; ramas V y F (esta puede estar vacía) |
| Ciclo condicional   | _Mientras_ pretest   | Expresión lógica; un cuerpo                            |
| Ciclo incondicional | _Para_               | Variable de control, inicial, final y paso; un cuerpo  |

La ejecución continua de la interfaz recorre el diagrama con la misma primitiva
que el paso a paso (`ejecutarPasoAPaso`), disparada por un temporizador. La
semántica normativa de los ciclos es la de esa primitiva.

## 2. Léxico

El evaluador no ignora espacios ni tabuladores. Un espacio fuera de una cadena
es un error léxico. El manual lo exige: `x=x*10`, no `x = x * 10`.

El lenguaje distingue mayúsculas de minúsculas. `ACUM` y `Acum` son variables
distintas. Los nombres de función deben escribirse en mayúsculas.

### 2.1 Identificadores

```txt
nombre = letra { letra | dígito }
```

- Empieza con letra (`char.IsLetter`: incluye `ñ`, `á` y demás letras Unicode).
- Siguen letras o dígitos. No admite `_` ni otros signos.
- Reservados como nombres de función (no pueden usarse como variable ni como
  vector): `MOD`, `DIV`, `ABS`, `RAIZ`, `TRUNC`.
- Nombre interno: `salida__`. Lo crea el manejador al iniciar; no forma parte
  del lenguaje del usuario.

### 2.2 Literales

**Número.** Secuencia de dígitos, con parte fraccionaria opcional separada por
`.` (nunca `,`). No hay signo en el literal: el menos es el operador unario. No
hay notación científica ni decimal inicial (`.5` es inválido; debe ser `0.5`).

El parser construye la fracción así: interpreta los dígitos posteriores al punto
como un entero y lo divide por $10^{k}$, donde $k$ es la cantidad de dígitos de
ese entero **sin ceros a la izquierda**. En consecuencia `1.05` se lee como
`1.5` y `10.023` como `10.23`. Los ceros finales de la fracción no alteran el
valor (`1.50` = `1.5`).

**Cadena.** Delimitada por `"..."`. No hay secuencias de escape. No puede
contener `"` ni, en bloques que parten por coma, el carácter `,`. La cadena
vacía `""` es válida. Los espacios _sí_ son significativos dentro de las
comillas.

### 2.3 Delimitadores

| Símbolo | Uso                                                              |
| :------ | :--------------------------------------------------------------- |
| `,`     | Separa sentencias dentro de un mismo bloque                      |
| `;`     | Separa índices de vector/matriz y parámetros de función          |
| `[]`    | Índices y lista de parámetros de función                         |
| `()`    | Agrupación aritmética o lógica                                   |
| `"`     | Delimitador de cadena                                            |
| `=`     | Asignación en un bloque de asignación; igualdad en una condición |

No hay comentarios.

## 3. Tipos y predicados

En tiempo de ejecución un escalar es un `double` o un `string`. Un arreglo es un
`object[]` o un `object[,]` (rango 1 o 2).

No existe el tipo _entero_. Hay un predicado que clasifica un número como entero
cuando la parte fraccionaria hacia $-\infty$ es menor que `0.02`:

$$ \text{esEntero}(x) \iff \lfloor (x - \lfloor x \rfloor) \times 50 \rfloor = 0
$$

Así, `5` y `5.019` se aceptan como enteros; `5.02` no. Las operaciones que
exigen enteros (índices, `MOD`/`DIV`/`%`/`\`, cotas del _para_) usan este
predicado y después `Convert.ToInt32`.

Un valor se considera número si `Convert.ToDouble` no falla (depende de la
cultura del sistema anfitrión cuando el valor llega como cadena).

**Coerción en reasignación.** La primera escritura guarda el objeto tal cual lo
produjo el evaluador. Una reasignación de variable simple convierte a `double`
si el valor “es número”; si no, a `string`. Por eso `A="123"` puede terminar
almacenado como número `123` en una escritura posterior, y una variable puede
cambiar de número a cadena a lo largo del programa. La única restricción estable
es **escalar frente a arreglo**: un nombre ya usado como variable simple no
puede indexarse, y un nombre ya usado como vector no puede usarse sin índices.

## 4. Expresiones aritméticas

Gramática alineada con el descenso recursivo (`evalE` / `evalT` / `evalF` /
`evalP`):

```txt
E  = T  { ("+" | "-") T }
T  = F  { ("*" | "/") F }
F  = ("+" | "-") F | P [ ("^" | "%" | "\\") P ]
P  = número | cadena | "(" E ")"
   | nombre
   | nombre "[" índices "]"
   | funcion "[" parámetros "]"

índices    = E { ";" E }
parámetros = E { ";" E }
```

Precedencia, de mayor a menor: unario `+`/`-`; luego `^`, `%` y `\`; luego `*` y
`/`; luego `+` y `-`. `*` `/` `+` `-` asocian a izquierda. `^`, `%` y `\` **no
se encadenan**: `2^3^2` deja el segundo `^` sin consumir y falla. El manual
declara asociatividad izquierda para todos los binarios; el evaluador no
implementa esa regla sobre `^`.

El unario se aplica a un _factor_, no a un primario. Por tanto:

- `-2^2` vale `-(2^2) = -4`.
- `2*-3` vale `-6` (`*` delega en `evalF`, que acepta el unario).
- `2^-3` **falla** (`^` delega en `evalP`, que no acepta el `-`). Hay que
  escribir `2^(-3)`.

### 4.1 Semántica de operadores aritméticos

| Op. | Operandos                   | Resultado                                                                            |
| :-- | :-------------------------- | :----------------------------------------------------------------------------------- |
| `+` | número, número              | suma en `double`                                                                     |
| `+` | al menos un operando cadena | concatenación (`ToString` del otro)                                                  |
| `-` | número, número              | resta                                                                                |
| `*` | número, número              | producto                                                                             |
| `/` | número, número              | división real. Si el divisor es entero y vale `0`, error. Un divisor `0.5` es legal. |
| `^` | número, número              | `Math.Pow`                                                                           |
| `%` | enteros                     | resto; el divisor no puede ser `0`. Equivale a `(int)floor(a) % (int)floor(b)`       |
| `\` | enteros                     | división entera `floor(a / b)`; el divisor no puede ser `0`                          |

`%` y `\` están en el evaluador y no figuran en las tablas del manual. Los
componentes de fábrica usan `MOD[...]` y `DIV[...]`.

Restar, multiplicar, dividir o potenciar cadenas es error. El `+` es el único
operador aritmético sobrecargado.

## 5. Expresiones lógicas

No hay literales `verdadero`/`falso` ni variables lógicas. Toda condición es una
comparación, combinable con `&` (conjunción) y `|` (disyunción). No hay
negación.

```txt
EL = TL { "|" TL }
TL = FL { "&" FL }
FL = "(" EL ")" | E relop E
relop = ">" | ">=" | "<" | "<=" | "<>" | "="
```

Precedencia: comparaciones sobre la aritmética; `&` sobre las comparaciones; `|`
sobre `&`. Asociación a izquierda.

Antes de analizar una condición, `buscarEA` recorre el texto y sustituye cada
paréntesis cuyo contenido sea una **expresión aritmética completa** por el valor
calculado. `(A+1)>0` se reduce a `5>0` si `A` vale `4`. Un paréntesis con
comparadores (`(A>B)`) no se reduce y se analiza como subexpresión lógica.

### 5.1 Comparaciones

| Op.               | Números                         | Cadenas                              |
| :---------------- | :------------------------------ | :----------------------------------- |
| `>` `>=` `<` `<=` | orden numérico                  | error                                |
| `=` `<>`          | igualdad / desigualdad numérica | igualdad / desigualdad de `ToString` |

Mezclar número y cadena en `=` o `<>` es error. Encadenar comparaciones
(`A>B>C`) deja resto y falla.

### 5.2 Conjunción y disyunción

- `|` evalúa siempre ambos operandos (no hay cortocircuito).
- `&` con operando izquierdo verdadero evalúa el derecho.
- `&` con operando izquierdo falso intenta evaluar el derecho y **traga la
  excepción** si falla. Si esa evaluación lanza, el resto de la expresión se
  descarta (el residuo queda vacío). Un error a la derecha de un `&` falso puede
  silenciar un `|` posterior.

Para replicar el uso docente basta el cortocircuito estándar (`&` no evalúa el
derecho si el izquierdo es falso; `|` no evalúa el derecho si el izquierdo es
verdadero), que cubre los componentes de fábrica. El tragar excepciones no debe
reproducirse.

## 6. Funciones predefinidas

Invocación: `NOMBRE[arg1;arg2]`. Los corchetes son obligatorios aunque haya un
solo argumento. Usar el nombre sin `[...]` es error (“es una función y se está
utilizando como variable”).

| Función    | Aridad    | Semántica                                             |
| :--------- | :-------- | :---------------------------------------------------- |
| `DIV[A;B]` | 2 enteros | `floor(A / B)`. Sin chequeo de división por cero      |
| `MOD[A;B]` | 2 enteros | `ToInt32(A) % ToInt32(B)`. Sin chequeo de módulo cero |
| `ABS[A]`   | 1 número  | `Math.Abs`                                            |
| `TRUNC[A]` | 1 número  | `Math.Truncate` (hacia cero)                          |
| `RAIZ[A]`  | 1 número  | `Math.Sqrt`. Raíz de negativo: `NaN`                  |

Los argumentos se evalúan como expresiones aritméticas, se convierten a texto
con `ToString` y se vuelven a interpretar al aplicar la función. En culturas que
usan `,` decimal eso rompe argumentos no enteros. En la PWA los argumentos deben
pasarse con su tipo, no como texto.

## 7. Variables, vectores y matrices

### 7.1 Variables simples

Nacen al asignar o al ingresar. Lectura de un nombre no definido es error.
Lectura de un vector sin índices, o de un escalar con índices, es error.

### 7.2 Indexación

```txt
nombre[e1]
nombre[e1;e2]
```

Cada índice debe ser un **entero** (predicado de §3). El arreglo es de origen
**cero**: la primera asignación a `A[5]` crea un vector de longitud 6 (índices
`0..5`). La cátedra trabaja en la práctica con índices desde `1`; el índice `0`
existe y los componentes lo usan como centinela (p. ej. el ordenamiento por
inserción asigna `idd[0]=aux`). El visor de matrices oculta la fila y la columna
`0`.

Hasta dos dimensiones. Un tercer índice es error.

Crecimiento al escribir: si el índice supera el máximo actual, el arreglo se
redimensiona conservando los valores previos. Las celdas nuevas quedan sin
inicializar (`null`). Leer un índice mayor que el máximo es error. Leer una
celda `null` devuelve `null` y las operaciones posteriores fallan.

No hay declaración de tamaño. No hay límite inferior configurable.

## 8. Bloques: semántica de ejecución

En un bloque, `,` parte el contenido en sentencias que se ejecutan de izquierda
a derecha. La partición es léxica (no respeta cadenas): `S{"Hola, mundo"}` se
parte en dos.

### 8.1 Asignación

```txt
lvalor = expr
lvalor = nombre | nombre "[" índices "]"
```

Se evalúa `expr` y se escribe en el l-valor. Varias asignaciones en el mismo
bloque: `ini=1,fin=cant,m=DIV[ini+fin;2]`. Cada una ve los efectos de las
anteriores.

### 8.2 Entrada

Para cada l-valor se pide un texto al usuario y se ejecuta la asignación
`lvalor=texto`:

- Número: dígitos, con `.` decimal según el evaluador. El diálogo original
  valida con la cultura del sistema (`NumberStyles.Currency`), lo que desacuerda
  con el `.` del parser.
- Cadena: debe ir entre comillas y no contener `,`.
- Vacío o cancelar: error.

El índice de `A[I]` se evalúa al mostrar el diálogo; la escritura usa el l-valor
original, de modo que se asigna a la celda que `I` designe en ese momento.

### 8.3 Salida

Cada ítem se evalúa como expresión aritmética.

- Si el texto del ítem empieza o termina en `"`, se muestra solo el valor
  (mensaje).
- Si no, se muestra `expresión = valor`.
- En un acceso a vector, el original intenta mostrar los índices ya evaluados;
  la implementación de ese formato está defectuosa (reutiliza el último índice).
  Replicar `nombre[i;j] = valor` con los índices correctos.

Varios ítems en un bloque producen varias líneas de salida, en orden.

### 8.4 Alternativa

Se evalúa la condición. Si es verdadera se ejecuta la rama V; si no, la rama F.
Ambas existen siempre (la F puede no tener bloques). No hay _si-entonces_ de una
sola rama como construcción distinta: se representa con F vacía, p. ej.
`C{idd<men#A{men=idd}#}`.

Un cuerpo vacío transfiere el control al sucesor de la alternativa.

### 8.5 Ciclo condicional (_mientras_)

Pretest. Se evalúa la condición; si vale, se ejecuta el cuerpo y se vuelve a
evaluar. Cuerpo vacío con condición verdadera: bucle que solo reevalúa la
condición.

Al terminar el cuerpo, el sucesor es de nuevo el propio ciclo (reevaluar), no el
primer bloque del cuerpo.

No hay _repetir-hasta_.

### 8.6 Ciclo incondicional (_para_)

Atributos: variable de control `v`, expresiones `inicial`, `final` y `paso`.
Visualización típica: `v= inicial..(paso)..final`.

Al **entrar la primera vez**:

1. Se evalúan `inicial`, `paso` y `final`, una sola vez. Deben ser enteros.
   Quedan fijados: mutarlos dentro del cuerpo no cambia el ciclo.
2. Se asigna `v ← inicial`.
3. Si `paso > 0` y `v <= final`, o si `paso <= 0` y `v >= final`, se entra al
   cuerpo; si no, el ciclo termina.

Al **terminar el cuerpo**:

1. `v ← v + paso` (se escribe en memoria; una asignación a `v` dentro del cuerpo
   se pierde en este paso).
2. Se vuelve a la cabecera y se aplica el mismo test, **sin** reevaluar cotas ni
   paso.

Efectos:

- Tras `v=1..3` con paso `1`, al salir `v` vale `4` (un paso más allá de la
  última iteración).
- Paso negativo: `F{ind2#cant#ind1#-1#...}` recorre hacia abajo. El manual
  documenta incremento o decremento; los ordenamientos de fábrica usan paso
  `-1`.
- Paso `0` y `inicial >= final`: bucle infinito. Paso `0` e `inicial < final`:
  no entra.
- Cuerpo vacío: itera igual, incrementando `v` en cada vuelta.
- `inicial`, `final` y `paso` pueden ser expresiones (`cant-1`, `ind1+1`).

Hay un método `ejecutar` (no usado por la interfaz) que ignora el signo del paso
y siempre compara `v <= final`. No es la semántica a replicar.

## 9. Serialización textual del diagrama

Formato interno (y cuerpo cifrado del `.deb`): concatenación de bloques sin
separador.

```txt
secuencia     = { bloque }
bloque        = "E{" texto "}"                          (* entrada *)
              | "A{" texto "}"                          (* asignación *)
              | "S{" texto "}"                          (* salida *)
              | "C{" condicion "#" seqV "#" seqF "}"    (* alternativa *)
              | "W{" condicion "#" secuencia "}"        (* mientras *)
              | "F{" v "#" ini "#" fin "#" paso "#" secuencia "}"
```

`#` separa cabecera y cuerpos. Un `.deb` guarda esa cadena ofuscada, más casos
de prueba y documentación. El carácter de separación de secciones es el código
223 (`ß`).

## 10. Lo que el perfil 2009 no cubre

Respecto del [modelo de dominio](../../01-business-modeling/domain-model.md) de
Diagramar PWA, este lenguaje **no** tiene:

- subprogramas (funciones o procedimientos);
- _repetir-hasta_;
- declaración explícita ni tipos del usuario;
- ámbitos de bloque o de módulo;
- tipo lógico, carácter, lista, registro o enumeración;
- paso de parámetros;
- comentarios.

Esas construcciones pertenecen a otros perfiles (Estándar, C, Python) o a
extensiones de la PWA, no al perfil de compatibilidad.

## 11. Particularidades que conviene no copiar

La semántica de §1–§8 es la que hay que reproducir para que un diagrama legado
se comporte como en 2009. Lo que sigue son defectos del ejecutable original;
copiarlos no aporta fidelidad pedagógica y complica el intérprete.

1. **Parser decimal.** Los ceros a la izquierda de la fracción se pierden
   (`1.05` → `1.5`). En la PWA, analizar la parte fraccionaria dígito a dígito.
2. **Cultura del anfitrión.** `ToString`/`Convert.ToDouble` usan la cultura
   local. En `es-AR`, un paréntesis aritmético que vale `0.5` puede reinyectarse
   como `0,5` y romper la condición. Usar `.` invariante.
3. **`&` que traga excepciones.** Cortocircuitar sin ejecutar el derecho, sin
   silenciar errores.
4. **Chequeos del lado izquierdo repetidos** en `*` y `/` (el derecho no se
   valida). Validar ambos operandos.
5. **Umbral `0.02` para “entero”.** Aceptar solo valores cuyo residuo
   fraccionario sea nulo a tolerancia de punto flotante (p. ej. `1e-10`), no
   `5.019` como entero.
6. **Cadenas numéricas que se vuelven números** al reasignar. Conservar el tipo
   que produjo el evaluador (`"123"` sigue siendo cadena).
7. **Argumentos de función vía `ToString`.** Pasar valores tipados.

## 12. Gramática de referencia (perfil 2009)

Conjunto mínimo que un intérprete del perfil debe aceptar. Los espacios están
prohibidos fuera de cadenas.

```txt
diagrama       = secuencia

exp_arit       = termino { ("+" | "-") termino }
termino        = factor { ("*" | "/") factor }
factor         = ("+" | "-") factor
               | primario [ ("^" | "%" | "\\") primario ]
primario       = numero | cadena | "(" exp_arit ")"
               | nombre [ "[" lista_expr "]" ]
               | funcion "[" lista_expr "]"

exp_logica     = conjuncion { "|" conjuncion }
conjuncion     = comparacion { "&" comparacion }
comparacion    = "(" exp_logica ")" | exp_arit relop exp_arit
relop          = ">" | ">=" | "<" | "<=" | "<>" | "="

lista_expr     = exp_arit { ";" exp_arit }
lvalor         = nombre [ "[" lista_expr "]" ]
asignaciones   = lvalor "=" exp_arit { "," lvalor "=" exp_arit }
entradas       = lvalor { "," lvalor }
salidas        = exp_arit { "," exp_arit }

funcion        = "MOD" | "DIV" | "ABS" | "RAIZ" | "TRUNC"
nombre         = letra { letra | dígito }
numero         = dígito { dígito } [ "." dígito { dígito } ]
cadena         = '"' { caracter - '"' } '"'
```

Ejemplos canónicos (componentes de fábrica y `Ejemplo 7_1`):

```txt
A{cont=cont+1}
A{ini=1,fin=cant,m=DIV[ini+fin;2]}
C{(pd>DIV[idd;2])&(idd<>1)#S{"Es Primo"}#S{"No es primo"}}
W{(ind<=cant)&(idd[ind]<>buscado)#A{ind=ind+1}}
F{ind1#1#cant-1#1#F{ind2#ind1+1#cant#1#C{idd[ind2]<idd[ind1]#A{aux=idd[ind2]}A{idd[ind2]=idd[ind1]}A{idd[ind1]=aux}#}}}
E{idd[indF;indC]}
S{"Posicion: ",ind}
A{Num10=Num10+dig*beta^Expo}
```
