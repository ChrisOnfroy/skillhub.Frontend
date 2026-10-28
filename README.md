# SkillHub · Frontend

> **Plataforma Web de Gestión de Cátedras, Talleres Presenciales y Matrículas Académicas.**  
> Diseñada para ofrecer una experiencia fluida, rápida y accesible tanto a estudiantes como a instructores y coordinadores académicos.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Características Principales](#-características-principales)
   - [Módulo de Estudiantes / Participantes](#módulo-de-estudiantes--participantes)
   - [Módulo de Docentes / Instructores](#módulo-de-docentes--instructores)
   - [Seguridad y Gestión de Acceso](#seguridad-y-gestión-de-acceso)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Roles y Control de Acceso (RBAC)](#-roles-y-control-de-acceso-rbac)
6. [Credenciales de Prueba (Seed Data)](#-credenciales-de-prueba-seed-data)
7. [Requisitos Previos y Configuración](#-requisitos-previos-y-configuración)
8. [Instalación y Despliegue Local](#-instalación-y-despliegue-local)
9. [Scripts Disponibles](#-scripts-disponibles)
10. [Integración con el Backend](#-integración-con-el-backend)

---

## 🎯 Descripción General

**SkillHub** es una plataforma integral para centros de formación y talleres presenciales (fotografía, cocina tradicional, oratoria, diseño gráfico, música, entre otros). 

Este cliente web (Single Page Application) consume la API REST de **SkillHub Backend (.NET 10 con Arquitectura Limpia)** y resuelve problemáticas de negocio clave:
* **Control estricto de cupos y aforo en tiempo real:** previene sobrecupos y bloquea inscripciones cuando la capacidad máxima está copada.
* **Prevención de cruces de horarios y dobles matrículas:** validaciones de dominio automáticas.
* **Segmentación de vistas por rol:** aislamiento completo entre la experiencia del participante y la gestión académica del docente.
* **Descarga instantánea de certificaciones oficiales en PDF** generadas en el backend con QuestPDF.
* **Importación masiva de matrículas vía hojas de cálculo Excel (`.xlsx`).**

---

## ✨ Características Principales

### Módulo de Estudiantes / Participantes
* **Catálogo Académico Interactivo:**
  * Búsqueda en vivo por título, temática, palabras clave o nombre del instructor.
  * Filtros dinámicos por categorías formativas (*Tecnología & IA, Arquitectura & Urbanismo, Diseño & Creatividad, Negocios & Comercio, Comunicación & Narrativas*).
  * Monitoreo de aforo disponible con indicadores visuales de disponibilidad y cupos agotados (*"Aforo Completo"*).
  * Proceso de matrícula inmediata con 1 solo clic.
* **Mi Aula Virtual (Panel del Estudiante):**
  * Historial de cátedras y talleres matriculados.
  * Consulta detallada del estado de inscripción, fechas, horarios y ubicación en sede.
  * Descarga directa del **Certificado Oficial en PDF** al culminar la formación.
  * Opción de cancelación de matrícula con liberación automática de cupo.

### Módulo de Docentes / Instructores
* **Panel de Gestión Docente:**
  * Visualización centralizada de las cátedras asignadas al instructor en sesión.
  * Creación y apertura de nuevos talleres presenciales con definición de código, horario (inicio/fin), aforo máximo y descripción curricular.
  * Consulta en tiempo real de las listas de participantes matriculados por taller.
* **Importación Masiva de Estudiantes (Excel):**
  * Subida de archivos `.xlsx` estructurados para matricular múltiples participantes en lote.
  * Notificaciones detalladas de filas procesadas con éxito y reporte de errores por solapamiento o capacidad excedida.
* **Módulo de Reportes & Métricas:**
  * Vista analítica con el **Top de Talleres con Mayor Demanda**.
  * Porcentajes de ocupación de plazas y métricas de desempeño académico.

### Seguridad y Gestión de Acceso
* **Autenticación Basada en JWT:**
  * Persistencia segura del token de sesión y expiración controlada.
  * Inyección automática del header `Authorization: Bearer <token>` en todas las peticiones protegidas.
* **Registro de Nuevos Estudiantes:**
  * Validación de tipos de identificación (*Cédula de Ciudadanía, Cédula de Extranjería, NIT, Pasaporte*).
  * Captura y validación de datos geográficos y números de contacto internacional.
* **Recuperación Segura de Contraseña:**
  * Flujo en dos pasos mediante solicitud por número de documento y validación de código de seguridad de 6 dígitos enviado al correo registrado.
* **Tema Visual Adaptado:**
  * Interfaz optimizada en **Modo Oscuro de alto contraste**, diseñada con una paleta sobria (negros neutros, grises carbón y rojo institucional `#d9251d`).

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **React** | `^19.3.1` | Biblioteca núcleo para interfaces de usuario declarativas y componentes reactivos |
| **TypeScript** | `~7.0.2` | Tipado estático estricto para DTOs, entidades y componentes |
| **Vite** | `^8.3.5` | Bundler y servidor de desarrollo ultrarrápido con ESM nativo |
| **Tailwind CSS** | `^4.3.3` | Framework de diseño utilitario (vía `@tailwindcss/vite`) |
| **Lucide React** | `^1.62.0` | Set unificado de iconografía vectorial |
| **Oxlint** | `^1.89.0` | Linter de alto rendimiento en Rust para calidad y estándares de código |

---

## 📂 Estructura del Proyecto

```
Skillhub.Frontend/
├── public/                 # Recursos estáticos y favicons
├── src/
│   ├── assets/             # Imágenes institucionales e ilustraciones
│   ├── components/         # Componentes UI reutilizables
│   │   ├── AuthModal.tsx   # Modal multifunción (Login, Registro, Recuperación)
│   │   ├── Logo.tsx        # Identidad visual de SkillHub
│   │   ├── Navbar.tsx      # Barra de navegación principal y menú móvil adaptativo
│   │   └── Toast.tsx       # Sistema de notificaciones flotantes (éxito, error, alertas)
│   ├── context/            # Proveedores de estado global
│   │   ├── AuthContext.tsx # Estado de autenticación, sesión y autorización RBAC
│   │   └── ThemeContext.tsx# Gestión del tema visual (Dark Theme)
│   ├── services/
│   │   └── api.ts          # Cliente HTTP centralizado para todos los endpoints del backend
│   ├── types/
│   │   └── api.ts          # Definiciones TypeScript de DTOs, Enums y Contratos de la API
│   ├── views/              # Vistas principales del sistema
│   │   ├── HomeView.tsx                 # Portal de inicio y presentación
│   │   ├── WorkshopsCatalogView.tsx     # Catálogo general de cátedras y talleres
│   │   ├── MyEnrollmentsView.tsx        # Aula virtual y certificados (exclusivo Estudiantes)
│   │   ├── InstructorManagementView.tsx # Gestión de cátedras y Excel (exclusivo Docentes)
│   │   └── ReportsView.tsx              # Analítica y reportes de ocupación (Docentes)
│   ├── App.tsx             # Enrutador, distribución de vistas y guardias de seguridad
│   ├── index.css           # Estilos base y configuración de Tailwind CSS v4
│   └── main.tsx            # Punto de entrada de la aplicación React
├── index.html              # Plantilla HTML base
├── package.json            # Dependencias y scripts de ejecución
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración del bundler Vite
```

---

## 🛡️ Roles y Control de Acceso (RBAC)

La plataforma maneja dos roles principales con separación estricta:

| Rol | Identificador en API | Vistas Disponibles | Restricciones |
| :--- | :--- | :--- | :--- |
| **Estudiante** | `Participant` | • Inicio<br>• Catálogo de Cátedras<br>• **Mi Aula Virtual** | No puede ingresar a Gestión Docente, ni a Reportes, ni importar archivos Excel. |
| **Docente** | `Employee` | • Inicio<br>• Catálogo de Cátedras (Sólo lectura)<br>• **Gestión Docente**<br>• **Reportes** | No puede matricularse en cátedras ni acceder a "Mi Aula Virtual". |
| **Visitante** | *Sin autenticar* | • Inicio<br>• Catálogo de Cátedras | Al intentar matricularse, se le solicita iniciar sesión o registrarse. |

*Cualquier intento directo de navegación hacia una vista no autorizada es interceptado de forma automática por el guardián de rutas en `App.tsx`, redirigiendo al usuario a su panel correspondiente.*

---

## 👥 Credenciales de Prueba (Seed Data)

El backend de SkillHub incluye datos iniciales precargados (*seeders*) para pruebas locales inmediatas:

### Cuentas de Docentes / Instructores (`Role: Employee`)
> **Contraseña universal para docentes:** `Instructor2026*`

| Nombre Completo | Correo Electrónico | Especialidad Docente |
| :--- | :--- | :--- |
| **Andrés Felipe Mejía Arango** | `andres.mejia@correo.com` | Fotografía Artística |
| **Rosa Elena Barrios Polo** | `rosa.barrios@correo.com` | Arte Culinario |
| **Mauricio Jiménez Cárdenas** | `mauricio.jimenez@correo.com` | Oratoria y Retórica |
| **Natalia Herrera Castaño** | `natalia.herrera@correo.com` | Diseño Gráfico |
| **Hernán Darío Quintero Gil** | `hernan.quintero@correo.com` | Música y Armonía |
| **Paola Andrea Vargas Mora** | `paola.vargas@correo.com` | Marketing Digital |

---

### Cuentas de Estudiantes / Participantes (`Role: Participant`)
> **Contraseña universal para estudiantes:** `Estudiante2026*`

| Correo Electrónico | Estado de Prueba | Escenario de Validación |
| :--- | :--- | :--- |
| `carlos.perez@skillhub.edu` | Matriculado en `ART-CUL-02` | Permite verificar cátedras con **aforo agotado (12/12)** |
| `estudiante.arte@skillhub.edu` | Matriculado en `ART-PHT-01` | Aula virtual activa con certificado disponible |
| `esteban.beltran@skillhub.edu` | Matriculado en `HUM-SPK-03` | Verificación de cancelaciones de matrícula |
| `julian.ortiz@skillhub.edu` | Matriculado en `ART-DSG-04` | Cátedra con cupos disponibles |

---

## ⚙️ Requisitos Previos y Configuración

### Requisitos del Sistema
* **Node.js:** Versión `18.0.0` o superior (se recomienda LTS `v20+`).
* **npm:** Versión `9.0.0` o superior.
* **SkillHub Backend:** En ejecución (normalmente en `http://localhost:5246`).

### Variables de Entorno
Crea un archivo `.env` en la raíz de `Skillhub.Frontend` si requieres apuntar a una URL de backend personalizada:

```env
# URL base de la API Web de SkillHub
VITE_API_BASE_URL=http://localhost:5246
```

*(Si no se define el archivo `.env`, la aplicación utilizará por defecto `http://localhost:5246`).*

---

## 🚀 Instalación y Despliegue Local

1. **Clonar o ubicarse en la carpeta del frontend:**
   ```bash
   cd Skillhub.Frontend
   ```

2. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación en el navegador:**
   ```
   http://localhost:5173
   ```

---

## 📦 Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con Hot Module Replacement (HMR). |
| `npm run build` | Compila TypeScript (`tsc -b`) y genera el bundle optimizado para producción en `/dist`. |
| `npm run preview` | Previsualiza localmente el build de producción generado. |
| `npm run lint` | Ejecuta el linter **Oxlint** para analizar y asegurar la calidad del código. |

---

## 🔌 Integración con el Backend

El frontend se comunica con los siguientes endpoints principales del backend:

```
[POST] /api/v1/auth/login               -> Inicio de sesión
[POST] /api/v1/auth/register            -> Registro de participantes
[POST] /api/v1/auth/forgot-password     -> Solicitud de código de verificación
[POST] /api/v1/auth/verify-reset-code   -> Validación de código de 6 dígitos
[POST] /api/v1/auth/reset-password      -> Establecimiento de nueva contraseña

[GET]  /api/v1/workshops                -> Listado de talleres con cupos calculados
[GET]  /api/v1/workshops/{id}           -> Detalle de taller
[POST] /api/v1/workshops                -> Creación de taller (Sólo Docente)
[GET]  /api/v1/workshops/{id}/enrollments -> Lista de inscritos por taller (Sólo Docente)

[POST] /api/v1/enrollments              -> Matricularse en un taller (Sólo Estudiante)
[GET]  /api/v1/enrollments/mine         -> Mis matrículas activas (Sólo Estudiante)
[POST] /api/v1/enrollments/{id}/cancel  -> Cancelar matrícula (Sólo Estudiante)
[GET]  /api/v1/enrollments/{id}/certificate -> Descargar certificado PDF oficial
[POST] /api/v1/enrollments/import       -> Carga masiva de inscripciones vía Excel (.xlsx)

[GET]  /api/v1/reports/top-workshops    -> Estadísticas y top de talleres más demandados
```

---

## 📄 Licencia

Este proyecto ha sido desarrollado como solución para la gestión académica y de cátedras presenciales de **SkillHub**. Todos los derechos reservados.
