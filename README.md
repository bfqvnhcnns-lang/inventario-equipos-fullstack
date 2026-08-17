Gestión de Inventario de Equipos de Cómputo

Sistema web completo de CRUD para la gestión del inventario de equipos de laboratorio del IIAP.

Desarrollado con TypeScript, Express, React, PostgreSQL y Docker como proyecto de prácticas pre-profesional en SENATI-IQUITOS.

---

 Qué es este proyecto?

Es una aplicación web profesional que permite al IIAP administrar sus equipos de cómputo:
- ✅ Registrar equipos nuevos en la base de datos
- ✅ Consultar información de equipos existentes
- ✅ Actualizar datos de equipos (estado, marca, descripción)
- ✅ Eliminar equipos del inventario

Implementado con arquitectura cliente-servidor moderna**, separando completamente la interfaz gráfica (Frontend) de la lógica de negocio (Backend).

---

## 📋 Requisitos Previos

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- Node.js 20+ (solo si deseas ejecutar localmente sin Docker)

---

## 🚀 Inicio Rápido

### ⭐ Con Docker (Recomendado - La forma profesional)

```bash
# 1. Clonar el repositorio
git clone <tu-repositorio-url>
cd Prueba_IIAP

# 2. Levantar toda la aplicación con un comando
docker-compose up --build
```

**Después de unos minutos, la aplicación estará disponible en:**

| Componente | URL |
|-----------|-----|
| **Frontend (Interfaz)** | http://localhost:5173 |
| **API Backend** | http://localhost:3000/api |
| **Documentación API** | http://localhost:3000/api/docs |
| **Base de Datos** | localhost:5432 |

### Sin Docker (Desarrollo Local)

#### Backend

```bash
cd backend
npm install
npm run dev  # Inicia en puerto 3000
```

#### Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev  # Inicia en puerto 5173
```

---

##  Documentación de API

La documentación interactiva de Swagger está disponible en:

```
http://localhost:3000/api/docs
```

### Endpoints Disponibles

#### Listar Equipos
```
GET /api/equipos
```

#### Obtener Equipo por ID
```
GET /api/equipos/:id
```

#### Crear Nuevo Equipo
```
POST /api/equipos
Content-Type: application/json

{
  "nombre": "Laptop",
  "marca": "Dell",
  "estado": "Operativo",
  "numeroSerie": "SN123456",
  "descripcion": "Laptop de desarrollo"
}
```

#### Actualizar Equipo
```
PUT /api/equipos/:id
Content-Type: application/json

{
  "nombre": "Laptop",
  "marca": "Dell",
  "estado": "En Mantenimiento",
  "numeroSerie": "SN123456",
  "descripcion": "Laptop de desarrollo - actualizado"
}
```

#### Eliminar Equipo
```
DELETE /api/equipos/:id
```

##  Estructura del Proyecto

```
Prueba_IIAP/
├── backend/                      # API REST con Express
│   ├── src/
│   │   └── main.ts             # Punto de entrada
│   ├── prisma/
│   │   └── schema.prisma       # Esquema de base de datos
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                     # Aplicación React con Vite
│   ├── src/
│   │   ├── App.tsx             # Componente principal
│   │   ├── App.css             # Estilos
│   │   ├── main.tsx            # Punto de entrada
│   │   └── index.css           # Estilos globales
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── .env.example
├── docker-compose.yml          # Orquestación de servicios
├── .env.example               # Variables de entorno ejemplo
├── .gitignore
└── README.md
```

##  Configuración

### Variables de Entorno

#### `.env` en la raíz del proyecto:
```env
DATABASE_URL=postgresql://equipos:password123@postgres:5432/equipos_db
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000/api
```

### Estados Disponibles de Equipos

- `Operativo` - El equipo está funcionando correctamente
- `En Mantenimiento` - El equipo se encuentra bajo mantenimiento
- `Dañado` - El equipo tiene daños
- `Inactivo` - El equipo no está en uso

##  Docker

### Comandos Útiles

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# Levantar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Logs del backend
docker-compose logs -f backend

# Ver estado de servicios
docker-compose ps

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

##  Base de Datos

### Schema de Equipos

```sql
CREATE TABLE equipos (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  marca VARCHAR(255) NOT NULL,
  estado VARCHAR(50) DEFAULT 'Operativo',
  numeroSerie VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

##  Dependencias Principales

### Backend
- **Express**: Framework web minimalista
- **Prisma**: ORM moderno para SQL
- **Swagger**: Documentación de API
- **TypeScript**: Tipado estricto
- **PostgreSQL**: Base de datos relacional

### Frontend
- **React 18**: Librería de UI
- **Vite**: Bundler rápido
- **Axios**: Cliente HTTP
- **TypeScript**: Tipado estricto

##  Casos de Uso

1. **Registrar nuevo equipo**: Complete el formulario y haga clic en "Crear"
2. **Listar equipos**: La tabla se carga automáticamente al abrir la aplicación
3. **Actualizar estado**: Haga clic en "Editar", cambie el estado y guarde
4. **Buscar equipo**: Use la tabla para buscar por ID o número de serie
5. **Eliminar equipo**: Haga clic en "Eliminar" y confirme la acción

##  Seguridad

- Validación de tipos con TypeScript estricto
- Validación de entrada en backend
- Manejo de errores en API y Frontend
- Variables de entorno para credenciales sensibles

## Solución de Problemas

### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Revisar logs
docker-compose logs postgres

# Reiniciar servicios
docker-compose down
docker-compose up --build
```

### Puerto ya en uso
```bash
# Cambiar puerto en docker-compose.yml
# Editar los puertos en los servicios (e.g., "8000:3000")
```

### Frontend no conecta a API
- Verificar que `VITE_API_URL` en frontend sea correcto
- Asegurar que backend esté corriendo (http://localhost:3000)
- Revisar CORS en backend

##  Notas

- La base de datos se reinicia cuando se ejecuta `docker-compose down -v`
- Los datos se persisten en el volumen `postgres_data`
- El frontend se reconstruye automáticamente en cambios (desarrollo)

##  Licencia

MIT
