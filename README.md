# Diagramar PWA

> **Entorno interactivo y progresivo para el aprendizaje, ejecución y evaluación
> de algoritmos mediante estructogramas Nassi-Shneiderman (N-S).**

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4.x-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

## Estado actual

El repositorio se encuentra al inicio de la fase de elaboración del Proceso
Unificado (iteración E1). La documentación de requisitos, el modelo de dominio y
la planificación están en `docs/up/`. El código fuente corresponde al andamiaje
inicial de Vue 3 y TypeScript; el núcleo de dominio (analizador, árbol de
sintaxis abstracta e intérprete) aún no está implementado.

## Propósito

Diagramar PWA sustituye a la herramienta de escritorio _Diagramar_ (UNSa, 2009).
Está pensada para estudiantes y docentes de la asignatura Elementos de
Programación. Debe operar exclusivamente en el cliente —sin servidor de
aplicaciones ni base de datos centralizada— y funcionar fuera de línea.

## Alcance previsto

- Construcción visual de estructogramas, con manipulación directa, acoplamiento
  magnético y espacio de trabajo de varios diagramas.
- Ejecución y depuración paso a paso, con prueba de escritorio y seguimiento de
  ámbitos de memoria.
- Núcleo de dominio desacoplado de la interfaz: analizador sintáctico, árbol de
  sintaxis abstracta, intérprete y transpilador a C.
- Evaluación automática mediante casos de prueba.
- Integridad académica: consignas firmadas con criptografía asimétrica del
  navegador e historial encadenado por funciones de resumen.
- Importación de archivos `.deb` de la herramienta de 2009.
- Instalación como aplicación web progresiva y uso sin conexión.

## Tecnologías

- Lenguaje: [TypeScript](https://www.typescriptlang.org/), con tipado estricto
- Interfaz: [Vue 3](https://vuejs.org/) (API de composición)
- Estado: [Pinia](https://pinia.vuejs.org/)
- Enrutamiento: [Vue Router](https://router.vuejs.org/)
- Empaquetado y entorno de desarrollo: [Vite](https://vite.dev/)
- Pruebas unitarias: [Vitest](https://vitest.dev/)
- Gestor de paquetes: [pnpm](https://pnpm.io/)

## Documentación

El desarrollo sigue el Proceso Unificado ágil descrito por Craig Larman. Los
artefactos están organizados por disciplina en `docs/up/`:

```text
docs/up/
├── 01-business-modeling/     # modelo de dominio
├── 02-requirements/          # visión, casos de uso, especificación
│                             # suplementaria, glosario y reglas de dominio
├── 03-design/                # documento de arquitectura de software
├── 08-project-management/    # plan de fase, planes de iteración y lista de
│                             # riesgos
└── 09-environment/           # caso de desarrollo
```

## Desarrollo

### Requisitos

- [Node.js](https://nodejs.org/) 24 LTS (24.15 o posterior de la serie 24)
- [pnpm](https://pnpm.io/)

### Comandos

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm dev

# Pruebas unitarias
pnpm test:unit

# Comprobación de tipos
pnpm type-check

# Análisis estático y formateo
pnpm lint
pnpm format

# Compilación para producción
pnpm build
```

## Contexto académico

- **Institución:** Universidad Nacional de Salta (UNSa), Facultad de Ciencias
  Exactas
- **Carrera:** Licenciatura en Análisis de Sistemas
- **Cátedra de aplicación:** Elementos de Programación
- **Actividad:** Seminario de Sistemas
- **Autor:** Ezequiel Lizandro Dzioba
- **Director:** Javier Edgardo Trenti

## Licencia

El proyecto se distribuye bajo la licencia MIT. El texto completo está en
[LICENSE](LICENSE).
