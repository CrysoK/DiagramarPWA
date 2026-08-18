# Modelo de dominio

> **Versión:** `0.1.0`

## 1. Introducción

El **Modelo de Dominio** es una representación visual de las clases conceptuales
del mundo real identificadas para **Diagramar PWA**. Presentado desde una
**perspectiva conceptual**, este artefacto opera como un vocabulario visual de
términos, abstracciones y relaciones significativas del problema; no describe
clases de software ni incluye métodos, firmas de operaciones o detalles de
implementación.

El modelo se organiza en tres paquetes conceptuales:

1. **Estructura del algoritmo (Notación N-S):** Descomposición sintáctica de los
   estructogramas y modularidad.
2. **Simulación pedagógica (Prueba de escritorio):** Conceptos asociados a la
   ejecución observable y estado de la memoria.
3. **Configuración, evaluación didáctica y auditoría:** Instrumentos docentes,
   integridad criptográfica y calificación automática.

## 2. Estructura del algoritmo (Notación Nassi-Shneiderman)

Modela los componentes de un estructograma: la contigüidad jerárquica de
bloques, los destinos de memoria (_l-values_), las expresiones evaluables y el
sistema de tipos de datos.

```mermaid
classDiagram
    direction TB

    %% ESPACIO DE TRABAJO Y MODULARIDAD
    class EspacioDeTrabajo["Espacio de trabajo"]
    class Diagrama {
        <<abstract>>
        nombre
    }
    class ProgramaPrincipal["Programa principal"]
    class Subprograma {
        <<abstract>>
        nombre
    }
    class Funcion["Función"]
    class Procedimiento
    class Secuencia
    class Variable {
        nombre
    }
    class ParametroFormal["Parámetro formal"] {
        nombre
        modoDePaso: valor | referencia
    }

    EspacioDeTrabajo "1" *-- "1" ProgramaPrincipal : puntoDeEntrada
    EspacioDeTrabajo "1" *-- "0..*" Subprograma : modulos
    Diagrama <|-- ProgramaPrincipal
    Diagrama <|-- Subprograma
    Subprograma <|-- Funcion
    Subprograma <|-- Procedimiento

    Diagrama "1" *-- "1" Secuencia : cuerpo
    Diagrama "1" *-- "0..*" Variable : declaraLocales
    Subprograma "1" *-- "0..*" ParametroFormal : declaraParametros

    %% JERARQUÍA DE BLOQUES N-S
    class Bloque {
        <<abstract>>
    }
    class Entrada
    class Salida
    class Asignacion["Asignación"]
    class InvocacionProcedimiento["Invocación de procedimiento"]
    class Alternativa
    class Ciclo {
        <<abstract>>
    }
    class CicloCondicional {
        <<abstract>>
    }
    class CicloIncondicional {
        <<abstract>>
    }
    class CicloMientras["Ciclo Mientras"]
    class CicloRepetirHasta["Ciclo Repetir-Hasta"]
    class CicloPara["Ciclo Para"]

    Secuencia "1" *-- "0..*" Bloque : contieneOrdenados
    Bloque <|-- Entrada
    Bloque <|-- Salida
    Bloque <|-- Asignacion
    Bloque <|-- InvocacionProcedimiento
    Bloque <|-- Alternativa
    Bloque <|-- Ciclo

    Ciclo <|-- CicloCondicional
    Ciclo <|-- CicloIncondicional
    CicloCondicional <|-- CicloMientras
    CicloCondicional <|-- CicloRepetirHasta
    CicloIncondicional <|-- CicloPara

    Alternativa "1" *-- "1" Secuencia : ramaVerdadera
    Alternativa "1" *-- "1" Secuencia : ramaFalsa
    Ciclo "1" *-- "1" Secuencia : cuerpo

    %% ELEMENTOS DE OPERACIÓN: DESTINOS DE ACCESO Y EXPRESIONES
    class Expresion["Expresión"] {
        texto
    }
    class DestinoDeMemoria["Destino de memoria"] {
        especificador: simple | elementoLista | campoRegistro | desreferenciacion
    }

    DestinoDeMemoria "0..*" -- "1" Variable : variableBase
    DestinoDeMemoria "0..*" o-- "0..*" Expresion : expresionesDeIndexacion

    Asignacion "0..*" -- "1" DestinoDeMemoria : destino
    Asignacion "0..*" -- "1" Expresion : valorCalculado
    Entrada "0..*" -- "1..*" DestinoDeMemoria : destinosLectura
    Salida "0..*" -- "1..*" Expresion : elementosEmitidos

    Alternativa "0..*" -- "1" Expresion : condicion
    CicloCondicional "0..*" -- "1" Expresion : condicion
    CicloIncondicional "0..*" -- "1" Variable : variableControl
    CicloIncondicional "0..*" -- "1" Expresion : valorInicial
    CicloIncondicional "0..*" -- "1" Expresion : valorFinal
    CicloIncondicional "0..*" -- "0..1" Expresion : paso

    InvocacionProcedimiento "0..*" -- "1" Procedimiento : invoca
    InvocacionProcedimiento "0..*" *-- "0..*" Expresion : argumentos
    Expresion "0..*" -- "0..*" Funcion : invoca

    %% SISTEMA DE TIPOS CONCEPTUAL
    class TipoDeDato["Tipo de dato"] {
        <<abstract>>
        nombre
    }
    class TipoSimple {
        variante: entero | real | logico | caracter | cadena
    }
    class TipoLista {
        limiteInferior
        limiteSuperior
    }
    class TipoRegistro
    class CampoRegistro["Campo de registro"] {
        nombre
    }
    class TipoEnumeracion {
        simbolosValidos
    }
    class TipoPuntero

    TipoDeDato <|-- TipoSimple
    TipoDeDato <|-- TipoLista
    TipoDeDato <|-- TipoRegistro
    TipoDeDato <|-- TipoEnumeracion
    TipoDeDato <|-- TipoPuntero

    TipoLista "0..*" -- "1" TipoDeDato : tipoElemento
    TipoRegistro "1" *-- "1..*" CampoRegistro : defineCampos
    CampoRegistro "0..*" -- "1" TipoDeDato : tipoCampo
    TipoPuntero "0..*" -- "1" TipoDeDato : tipoApuntado

    Variable "0..*" -- "0..1" TipoDeDato : declaradaCon
    ParametroFormal "0..*" -- "0..1" TipoDeDato : declaradoCon
    Funcion "0..*" -- "1" TipoDeDato : tipoRetorno
```

## 3. Simulación pedagógica y prueba de escritorio

Modela la ejecución visible del algoritmo: la sucesión de pasos, la
actualización de la prueba de escritorio y la representación del estado de
memoria en función del ámbito vigente.

```mermaid
classDiagram
    direction TB

    class Simulacion["Simulación (Ejecución)"] {
        modo: continuo | pasoAPaso
    }
    class PasoDeSimulacion["Paso de simulación"] {
        numeroDePaso
    }
    class EstadoDeMemoria["Estado de memoria"]
    class AmbitoDeMemoria["Ámbito de memoria (Scope)"] {
        nombreAmbito
    }
    class Diagrama
    class VariableEnMemoria["Variable en memoria"] {
        nombre
    }
    class CeldaDeMemoria["Celda de memoria"] {
        posicionOIndice
    }
    class Valor["Valor"] {
        <<abstract>>
    }
    class ValorEscalar["Valor escalar"] {
        dato
        tipoInmanente
    }
    class ReferenciaMemoria["Referencia (Dirección / Puntero)"] {
        esNulo
    }
    class EventoES["Evento de E/S"] {
        tipo: entrada | salida
        contenido
    }
    class PruebaDeEscritorio["Prueba de escritorio"]
    class EspacioDeTrabajo["Espacio de trabajo"]
    class Bloque
    class Variable

    Simulacion "0..*" -- "1" EspacioDeTrabajo : simula
    Simulacion "1" *-- "1..*" PasoDeSimulacion : trazaPasos
    PruebaDeEscritorio "1" -- "1" Simulacion : proyectaTraza

    PasoDeSimulacion "0..*" -- "1" Bloque : bloqueActivo
    PasoDeSimulacion "1" *-- "1" EstadoDeMemoria : memoriaResultante
    PasoDeSimulacion "1" *-- "0..*" EventoES : produce

    EstadoDeMemoria "1" *-- "1..*" AmbitoDeMemoria : ambitosActivos
    EstadoDeMemoria "1" *-- "0..*" CeldaDeMemoria : memoriaDinamica
    AmbitoDeMemoria "0..*" -- "1" Diagrama : contextoDe
    AmbitoDeMemoria "1" *-- "0..*" VariableEnMemoria : variablesVisibles

    VariableEnMemoria "0..*" -- "1" Variable : origenVariable
    VariableEnMemoria "1" *-- "1..*" CeldaDeMemoria : contieneCeldas
    CeldaDeMemoria "1" *-- "1" Valor : almacena

    Valor <|-- ValorEscalar
    Valor <|-- ReferenciaMemoria
    ReferenciaMemoria "0..*" -- "0..1" CeldaDeMemoria : apuntaA
```

## 4. Configuración, evaluación didáctica y auditoría

Modela la parametrización del motor mediante perfiles, la inyección de
restricciones y casos de prueba, y el esquema de integridad criptográfica de las
entregas.

```mermaid
classDiagram
    direction TB

    %% REGLAS Y CONFIGURACIÓN
    class PerfilConfiguracion["Perfil de configuración"] {
        nombre
        convencionesSintacticas
        regimenTipado: estatico | dinamico
        politicaDeclaracion: explicita | implicita
        baseIndexacion: base0 | base1
        longitudLista: fija | dinamica
    }
    class RestriccionDeAlcance["Restricción de alcance"] {
        nombre
    }
    class ReglaDeRestriccion["Regla de restricción"] {
        elemento: recursion | punteros | registros | listas | subprogramas
        permitido
    }

    RestriccionDeAlcance "1" *-- "1..*" ReglaDeRestriccion : contieneReglas

    %% TAREA Y EVALUACIÓN
    class TareaEvaluable["Tarea evaluable (Plantilla)"] {
        titulo
        enunciado
        tipoEvaluacion: examen | trabajoPractico
    }
    class FirmaDigital["Firma digital"] {
        identificadorEmisor
        fechaFirma
        esValida
    }
    class CasoDePrueba["Caso de prueba"] {
        entradas
        salidasEsperadas
        esOculto
    }
    class Entrega["Entrega del estudiante"] {
        identificadorDeclarado
        fechaHoraExportacion
        /tiempoActivo
        /cantidadEjecuciones
        /totalErroresSintaxis
    }
    class HistorialDeAcciones["Historial semántico de acciones"] {
        esIntegro
    }
    class AccionSemantica["Acción de trabajo"] {
        marcaTemporal
        tipo: estructuracion | edicionTexto | ejecucion | cambioFoco | declaracionIdentidad
    }
    class EvaluacionEntrega["Evaluación de entrega"] {
        porcentajeCorrectitud
        estado: aprobada | desaprobada | observada
    }
    class ResultadoCasoPrueba["Resultado de caso de prueba"] {
        salidaObtenida
        veredicto: exitoso | salidaIncorrecta | tiempoExcedido | errorEjecucion
    }
    class AlertaDeAuditoria["Alerta de auditoría"] {
        motivo: anomaliaTemporal | pegadoMasivo | inconsistenciaIdentidad | rupturaIntegridad
        severidad: informativa | advertencia | sospechaCritica
    }
    class EspacioDeTrabajo["Espacio de trabajo"]

    EspacioDeTrabajo "0..*" -- "1" PerfilConfiguracion : seRigePor
    TareaEvaluable "0..*" -- "1" PerfilConfiguracion : imponePerfil
    TareaEvaluable "0..*" -- "0..1" RestriccionDeAlcance : imponeRestriccion
    TareaEvaluable "1" *-- "1" FirmaDigital : selladaCon
    TareaEvaluable "1" *-- "1..*" CasoDePrueba : bateriaPruebas

    Entrega "0..*" -- "1" TareaEvaluable : respondeA
    Entrega "1" *-- "1" EspacioDeTrabajo : solucionPresentada
    Entrega "1" *-- "1" HistorialDeAcciones : evidenciaDeResolucion
    HistorialDeAcciones "1" *-- "1..*" AccionSemantica : registroSecuencial

    EvaluacionEntrega "0..*" -- "1" Entrega : califica
    EvaluacionEntrega "1" *-- "1..*" ResultadoCasoPrueba : detalleCasos
    ResultadoCasoPrueba "0..*" -- "1" CasoDePrueba : valida
    EvaluacionEntrega "1" *-- "0..*" AlertaDeAuditoria : generaAlertas
```
