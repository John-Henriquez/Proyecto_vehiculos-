# Proyecto Vehículos - Sistema de Gestión de Solicitudes y Asignación de Vehículos

Un sistema completo para la gestión de solicitudes de vehículos, asignación de conductores y mantenimiento de un inventario de vehículos y conductores. Este proyecto incluye tanto un **backend** desarrollado con **Node.js y Express** como un **frontend** construido con **React.js**.

## Tabla de contenidos
* [Descripción General](#descripción-general)
* [Backend](#backend)
* [Frontend](#frontend)
* [Arquitectura del Proyecto](#arquitectura-del-proyecto)
  * [Estructura del Backend](#estructura-del-backend)
  * [Estructura del Frontend](#estructura-del-frontend)
* [Instalación y Configuración](#instalación-y-configuración)
  * [Prerrequisitos](#prerrequisitos)
  * [Clonación del Repositorio](#clonación-del-repositorio)
  * [Configuración del Backend](#configuración-del-backend)
  * [Configuración del Frontend](#configuración-del-frontend)
* [Modelo de Datos](#modelo-de-datos)
* [Tecnologías Utilizadas](#tecnologías-utilizadas)
* [Licencia](#licencia)

## Descripción General
Este proyecto tiene como objetivo facilitar la gestión de solicitudes de vehículos por parte de una organización, permitiendo el registro y la asignación de vehículos y conductores de manera centralizada. Los administradores pueden aprobar o rechazar solicitudes, asignar recursos y llevar un control detallado del inventario.

### Características principales
- **Gestión de solicitudes**: Creación, aprobación y rechazo de solicitudes de vehículos.
- **Asignación de conductores y vehículos**: Asociar conductores y vehículos a solicitudes aprobadas.
- **Inventario de vehículos y conductores**: Mantenedor para agregar, editar y eliminar registros.
- **Autenticación y roles de usuario**: Administrador y usuario.
- **Notificaciones por correo electrónico**: Envío de confirmaciones y notificaciones importantes.

## Backend
El backend está desarrollado con **Node.js**, **Express**, y utiliza **MongoDB** como base de datos. Se siguen principios de arquitectura RESTful para facilitar la integración y escalabilidad.

### Funcionalidades clave
- **Autenticación y autorización** con JWT.
- **CRUD completo** para vehículos, conductores y solicitudes.
- **Gestión de asignaciones**.
- **Validación de datos** con `express-validator`.
- **Configuración de entorno** manejada con `dotenv`.

### Rutas principales
- `POST /api/auth/login`: Inicio de sesión.
- `GET /api/vehiculos`: Listado de vehículos.
- `POST /api/solicitudes`: Crear una nueva solicitud.
- `PUT /api/solicitudes/:id`: Aprobar/rechazar una solicitud.
- `POST /api/asignaciones`: Asignar vehículo y conductor a una solicitud.

## Frontend
El frontend está desarrollado con **React.js** y **Vite** como herramienta de construcción. Proporciona una interfaz limpia y funcional para la gestión del sistema.

### Páginas principales
- **Inicio de sesión y registro de usuarios**.
- **Panel de administración**: Visualización de solicitudes, inventario de vehículos y conductores.
- **Formulario de creación de solicitudes**.
- **Página de detalles de una solicitud**.

## Arquitectura del Proyecto
El proyecto está dividido en dos partes principales: el **backend** y el **frontend**.

### Estructura del Backend
```bash
backend
├── node_modules
├── src
│   ├── auth
│   ├── config
│   ├── controllers
│   ├── entity
│   ├── handlers
│   ├── helpers
│   ├── middlewares
│   ├── routes
│   ├── services
│   └── validations
├── .env.example
├── package.json
└── index.js
```

### Estructura del Frontend
```bash
frontend
├── node_modules
├── public
├── src
│   ├── assets
│   ├── components
│   ├── context
│   ├── helpers
│   ├── hooks
│   ├── pages
│   ├── services
│   └── styles
├── .env.example
├── package.json
└── main.jsx
```

## Instalación y Configuración

### Prerrequisitos
Asegúrate de tener instalados los siguientes programas:
- **Node.js** (versión 20.x.x LTS)
- **MongoDB** (versión 6.x.x)
- **Git** (versión 2.45.2 o superior)

### Clonación del Repositorio
```bash
git clone https://github.com/tu-usuario/Proyecto_vehiculos-.git
```

### Configuración del Backend
1. Accede al directorio del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Renombra el archivo `.env.example` a `.env` y configura las variables de entorno necesarias.
4. Inicia el servidor:
   ```bash
   npm run dev
   ```

### Configuración del Frontend
1. Accede al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Renombra el archivo `.env.example` a `.env` y configura las variables de entorno necesarias.
4. Inicia la aplicación:
   ```bash
   npm run dev
   ```

## Modelo de Datos
### Entidades principales
- **Vehículo**: Información sobre los vehículos disponibles.
- **Conductor**: Información de los conductores registrados.
- **Solicitud**: Detalles de las solicitudes de vehículos.
- **Asignación**: Relación entre solicitudes, vehículos y conductores.

## Tecnologías Utilizadas
- **Node.js** y **Express** para el backend.
- **React.js** para el frontend.
- **MongoDB** como base de datos.
- **JWT** para autenticación.
- **Nodemailer** para envío de correos electrónicos.

## Licencia
Este proyecto está bajo la licencia [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html).

---
⌨️ with ❤️ by [John-Henriquez](https://github.com/John-Henriquez)

