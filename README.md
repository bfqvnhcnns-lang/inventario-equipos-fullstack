#  Sistema de Gestión de Inventario de Equipos de Cómputo - IIAP

Sistema web completo **CRUD** desarrollado para la administración del inventario de equipos de cómputo del laboratorio del IIAP. Realizado como **Prueba Técnica para Practicante Preprofesional Full Stack (TypeScript)**.

---

##  Tabla de Contenidos
1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Requisitos Previos](#-requisitos-previos)
4. [Instrucciones de Ejecución con Docker](#-instrucciones-de-ejecución-con-docker)
5. [Documentación de la API (Swagger)](#-documentación-de-la-api-swagger)
6. [Variables de Entorno](#-variables-de-entorno)
7. [Estructura del Proyecto y Git Workflow](#-estructura-del-proyecto-y-git-workflow)
8. [Endpoints de la API REST](#-endpoints-de-la-api-rest)

---

##  Descripción del Proyecto

La aplicación permite gestionar el ciclo de vida completo de los equipos del laboratorio:
*    **Crear:** Registrar nuevos equipos (Laptops, Monitores, Teclados, Servidores, etc.) especificando Nombre, Marca, Estado, Número de Serie y Descripción.
*  **Listar:** Visualizar todos los equipos registrados con estado visual dinámico.
*  **Actualizar:** Modificar información de equipos existentes (ej. cambiar estado de "Operativo" a "En Mantenimiento", "Dañado" o "Inactivo").
*  **Eliminar:** Remover un equipo del inventario previa confirmación.

---

##  Tecnologías Utilizadas

* **Backend:** Node.js, Express, TypeScript (Modo estricto), Prisma ORM, Swagger / OpenAPI.
* **Frontend:** React 18, Vite, TypeScript, Axios, HTML5 / CSS3 responsivo.
* **Base de Datos:** PostgreSQL 16 (Oficial en Docker).
* **Contenedores:** Docker & Docker Compose.

---

##  Requisitos Previos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose.
* Git.

---

##  Instrucciones de Ejecución con Docker

Sigue estos 3 simples pasos para levantar la aplicación completa con **un solo comando**:

### Paso 1: Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITTORIO_GITHUB>
cd Prueba_IIAP
```

### Paso 2: Crear el archivo de variables de entorno (Opcional)
```bash
cp .env.example .env
```

### Paso 3: Ejecutar con Docker Compose
```bash
docker-compose up --build
```

Una vez que los contenedores estén corriendo, la aplicación estará disponible en:

| Servicio | URL | Descripción |
| :--- | :--- | :--- |
|  **Frontend (React)** | `http://localhost:5173` | Interfaz de Usuario |
|  **Backend API** | `http://localhost:3000/api` | Servidor REST |
|  **Swagger Docs** | `http://localhost:3000/api/docs` | Documentación interactiva de la API |
|  **PostgreSQL** | `localhost:5432` | Base de datos relacional |

---

##  Documentación de la API (Swagger)

La API cuenta con documentación interactiva con **OpenAPI 3.0 (Swagger)** accessible directamente desde el navegador en:

 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

Desde la interfaz de Swagger se pueden probar interactiva y directamente todos los endpoints HTTP (GET, POST, PUT, DELETE).

---

##  Variables de Entorno

El proyecto incluye un archivo `.env.example` en la raíz con los valores predeterminados requeridos para el entorno de producción y Docker:

```env
# Base de Datos PostgreSQL
DATABASE_URL=postgresql://equipos:password123@postgres:5432/equipos_db

# Backend
NODE_ENV=production
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000/api
```

---

##  Estructura del Proyecto y Git Workflow

### Estructura de Repositorio Monorepo:
```
Prueba_IIAP/
├── backend/                  # API REST (Node.js + Express + TypeScript + Prisma)
│   ├── src/
│   │   ├── controllers/      # Controladores de la API
│   │   ├── routes/           # Definición de rutas Express
│   │   └── main.ts           # Punto de entrada de la aplicación
│   ├── prisma/
│   │   └── schema.prisma     # Esquema relacional de PostgreSQL
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Interfaz de Usuario (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/       # Componentes de UI (EquipoTable, etc.)
│   │   ├── services/         # Cliente HTTP (equipoService)
│   │   ├── types/            # Interfaces TypeScript (Equipo, etc.)
│   │   └── App.tsx           # Componente principal
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml        # Orquestación de 3 servicios (Frontend, Backend, Postgres)
├── .env.example
└── README.md
```

### Estrategia de Ramas y Commits (Conventional Commits):
* `main`: Rama principal estable.
* `development`: Rama de integración para características.
* Ramas de Funcionalidades:
  * `feature/backend-crud`: Implementación de API REST y Prisma.
  * `feature/swagger-docs`: Documentación de OpenAPI/Swagger.
  * `feature/frontend-ui`: Desarrollo de la interfaz React en TypeScript.
  * `fix/docker-config`: Configuración de Dockerfiles y Docker Compose.

---

##  Endpoints de la API REST

| Método | Endpoint | Descripción | Cuerpo de Petición (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/equipos` | Listar todos los equipos | - |
| `GET` | `/api/equipos/:id` | Obtener un equipo por ID | - |
| `POST` | `/api/equipos` | Crear un nuevo equipo | `{ "nombre": "Laptop HP", "marca": "HP", "numeroSerie": "SN-12345", "estado": "Operativo", "descripcion": "Equipo de desarrollo" }` |
| `PUT` | `/api/equipos/:id` | Actualizar un equipo | `{ "estado": "En Mantenimiento" }` |
| `DELETE` | `/api/equipos/:id` | Eliminar un equipo | - |

---

##  Licencia
MIT - Desarrollado para la Prueba Técnica IIAP / SENATI.
