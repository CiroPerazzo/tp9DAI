# 📸 Instagram Clone API

Backend REST desarrollado con Node.js, Express y PostgreSQL que simula las funcionalidades básicas de una red social estilo Instagram.

## 🚀 Características

- Registro de usuarios
- Inicio de sesión con JWT
- Gestión de perfil de usuario
- Creación de publicaciones
- Feed global de publicaciones
- Validación de datos con Joi
- Contraseñas cifradas con Bcrypt
- Arquitectura por capas
- PostgreSQL como base de datos

---

# 🛠 Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- JWT (JSON Web Tokens)
- Bcrypt
- Joi
- Dotenv
- CORS

---

# 📂 Estructura del proyecto

```text
src/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── publicacion.controller.js
│   └── user.controller.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── schemas.js
│   └── validate.js
│
├── routes/
│   ├── auth.routes.js
│   ├── publicacion.routes.js
│   ├── user.routes.js
│   └── index.js
│
├── services/
│   ├── auth.service.js
│   ├── publicacion.service.js
│   └── user.service.js
│
└── app.js

database/
└── schema.sql
```

---

# 🏗 Arquitectura

El proyecto sigue una arquitectura por capas:

```text
Cliente
   │
   ▼
Routes
   │
   ▼
Middlewares
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
PostgreSQL
```

### Responsabilidad de cada capa

| Capa | Función |
|--------|----------|
| Routes | Define endpoints y rutas |
| Middlewares | Autenticación y validación |
| Controllers | Manejo de requests y responses |
| Services | Lógica de negocio y consultas SQL |
| Config | Configuración de PostgreSQL |
| Database | Persistencia de datos |

---

# 🗄 Base de datos

## Tabla usuarios

| Campo | Tipo |
|---------|---------|
| id | SERIAL |
| nombre_usuario | VARCHAR(50) |
| nombre_completo | VARCHAR(100) |
| email | VARCHAR(100) |
| password | VARCHAR(255) |
| foto_perfil | VARCHAR(255) |
| biografia | TEXT |

## Tabla publicaciones

| Campo | Tipo |
|---------|---------|
| id | SERIAL |
| usuario_id | INT |
| url_imagen | VARCHAR(255) |
| descripcion | TEXT |
| likes | INT |
| fecha_creacion | TIMESTAMP |

Relación:

```text
Usuario 1 ────── N Publicaciones
```

---

# ⚙ Instalación

## 1. Clonar repositorio

```bash
git clone <url-del-repo>
cd tp9dai
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar variables de entorno

Crear archivo `.env`

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=tp9dai

JWT_SECRET=clave_super_segura
JWT_EXPIRES_IN=2h
```

## 4. Crear la base de datos

Ejecutar:

```sql
database/schema.sql
```

en PostgreSQL.

## 5. Iniciar servidor

Modo producción:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

Servidor disponible en:

```text
http://localhost:3000
```

---

# 🔐 Autenticación

El sistema utiliza JWT.

Al iniciar sesión se devuelve un token:

```json
{
  "token": "eyJhbGc..."
}
```

Para acceder a rutas protegidas:

```http
Authorization: Bearer <token>
```

---

# 📡 Endpoints

Base URL:

```text
http://localhost:3000/api
```

---

## Auth

### POST /auth/register

Registrar usuario.

### POST /auth/login

Iniciar sesión.

---

## Usuarios

### GET /usuarios/perfil

Obtiene el perfil del usuario autenticado.

🔒 Requiere token.

### PUT /usuarios/perfil

Actualiza:

- nombre completo
- foto de perfil
- biografía

🔒 Requiere token.

---

## Publicaciones

### GET /publicaciones

Obtiene el feed global de publicaciones.

### POST /publicaciones

Crea una nueva publicación.

🔒 Requiere token.

---

# ✅ Validaciones implementadas

## Registro

- Usuario obligatorio
- Nombre completo obligatorio
- Email válido
- Contraseña mínimo 6 caracteres

## Publicaciones

- URL de imagen obligatoria
- Descripción opcional

## Perfil

- Al menos un campo para actualizar

---

# 🔒 Seguridad

- Contraseñas hasheadas con Bcrypt
- Tokens JWT firmados
- Middleware de autenticación
- Validación de datos con Joi
- Uso de variables de entorno

---

# 📋 Dependencias

| Paquete | Uso |
|----------|------|
| express | API REST |
| pg | PostgreSQL |
| bcrypt | Hash de contraseñas |
| jsonwebtoken | JWT |
| joi | Validaciones |
| cors | Acceso desde frontend |
| dotenv | Variables de entorno |

---

# 👨‍💻 Autor

Trabajo práctico desarrollado para la materia Desarrollo de Aplicaciones en Internet (DAI).

Backend de una red social tipo Instagram utilizando Node.js, Express y PostgreSQL.