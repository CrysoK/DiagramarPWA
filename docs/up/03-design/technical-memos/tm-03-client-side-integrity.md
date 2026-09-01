# TM-03: Integridad y auditoría en cliente

> **Versión:** `0.1.0`

## Asunto

Validación de integridad de tareas, prevención de plagio y auditoría sin
infraestructura de backend.

## Resumen de la solución

Emplear criptografía asimétrica nativa (WebCrypto API) con firmas digitales
(ECDSA / RSA-PSS) sobre las consignas docentes y un historial semántico
acumulativo encadenado por hashes SHA-256 (_workspace hash-chain_).

## Factores arquitectónicos

- Arquitectura 100% _client-side_ sin almacenamiento ni procesamiento en
  servidor.
- Imposibilidad de ocultar secretos simétricos en el código cliente.
- Necesidad docente de auditar masivamente lotes de exámenes (~350 entregas) con
  generación de métricas confiables
  ([UC09](../../02-requirements/use-cases/brief-use-cases.md#uc09-evaluar-y-auditar-entregas-masivas)).

## Solución

1. **Firma de consignas
   ([UC08](../../02-requirements/use-cases/brief-use-cases.md#uc08-elaborar-tarea-evaluable)):**
   La clave privada del docente sella el archivo `.dpwa` (enunciado, perfil,
   restricciones y casos de prueba).
2. **Historial encadenado
   ([UC06](../../02-requirements/use-cases/brief-use-cases.md#uc06-resolver-tarea-evaluable)):**
   Cada acción de edición o ejecución incorpora el hash del estado anterior
   ($H_i = \text{SHA-256}(H_{i-1} \parallel A_i \parallel t_i)$).
3. **Métricas en vivo:** La terminal docente calcula tiempos activos y errores
   recalculando el historial; una alteración manual rompe la cadena de hashes.

## Motivación

Elimina la falsificación superficial de entregas y resuelve la auditoría
académica sin incurrir en costos de servidores ni bases de datos.

## Asuntos no resueltos

- Heurísticas de ponderación temporal ante cambios de ventana legítimos
  (consultas de documentación).

## Alternativas consideradas

- **Código de autenticación de mensajes simétrico HMAC (propuesta original del
  anteproyecto):** Descartada por la imposibilidad de mantener el secreto
  compartido en una PWA estática.
