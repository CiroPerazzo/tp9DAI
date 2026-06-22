# API REST - Clon de Instagram (Backend)

Backend desarrollado con Node.js, Express y PostgreSQL para el proyecto de clon de Instagram. Implementa autenticacion JWT, validacion de datos y arquitectura por capas.

## Arquitectura por capas

```
Cliente (React)
      |
      v
  app.js ---------------> Express, CORS, JSON parser, puerto
      |
      v
  /routes --------------> Define verbos HTTP y endpoints
      |
      v
  /middlewares ---------> authMiddleware (JWT) + validate (Joi)
      |
      v
  /controllers ---------> Extrae req, invoca services, responde HTTP
      |
      v
  /services ------------> Consultas SQL puras (sin req/res)
      |
      v
  /config/db.js --------> Pool de conexion PostgreSQL (pg)
      |
      v
  PostgreSQL
```

### Responsabilidades

| Capa | Responsabilidad |
|------|-----------------|
| `config` | Pool de PostgreSQL con credenciales desde `.env` |
| `routes` | Enrutamiento HTTP y asociacion con middlewares/controladores |
| `middlewares` | Validacion de JWT y esquemas de datos |
| `controllers` | Logica de flujo, codigos HTTP y manejo de errores |
| `services` | Queries SQL directas a la base de datos |
| `app.js` | Inicializacion del servidor Express |

## Base de datos

Ejecutar el script `database/schema.sql` en DBeaver, pgAdmin o Supabase.

### Tabla `usuarios`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | SERIAL | PRIMARY KEY |
| nombre_usuario | VARCHAR(50) | UNIQUE, NOT NULL |
| nombre_completo | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (hash bcrypt) |
| foto_perfil | VARCHAR(255) | Opcional, default URL |
| biografia | TEXT | Opcional |

### Tabla `publicaciones`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | SERIAL | PRIMARY KEY |
| usuario_id | INT | FK -> usuarios(id), ON DELETE CASCADE |
| url_imagen | VARCHAR(255) | NOT NULL |
| descripcion | TEXT | Opcional |
| likes | INT | DEFAULT 0 |
| fecha_creacion | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Relacion:** Un usuario tiene muchas publicaciones (One-to-Many).

## Configuracion

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Copiar variables de entorno:

```bash
cp .env.example .env
```

3. Completar `.env` con las credenciales de PostgreSQL y una clave JWT segura.

4. Ejecutar `database/schema.sql` en la base de datos.

5. Iniciar el servidor:

```bash
npm start
# o en modo desarrollo:
npm run dev
```

## Endpoints

Base URL: `http://localhost:3000/api`

### Rutas publicas

#### `POST /auth/register`

Registra un nuevo usuario. La contraseña se cifra con bcrypt antes de guardarse.

**Body:**
```json
{
  "nombre_usuario": "gato_programador",
  "nombre_completo": "Gato Programador",
  "email": "gato@example.com",
  "password": "miPassword123",
  "foto_perfil": "https://placekitten.com/200/200",
  "biografia": "Amante de los gatos"
}
```

**Respuesta 201:**
```json
{
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Gato Programador",
    "email": "gato@example.com",
    "foto_perfil": "https://placekitten.com/200/200",
    "biografia": "Amante de los gatos"
  }
}
```

---

#### `POST /auth/login`

Valida credenciales y devuelve un JWT con expiracion de 2 horas.

**Body:**
```json
{
  "email": "gato@example.com",
  "password": "miPassword123"
}
```

**Respuesta 200:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Gato Programador",
    "email": "gato@example.com",
    "foto_perfil": "https://placekitten.com/200/200",
    "biografia": "Amante de los gatos"
  }
}
```

---

#### `GET /publicaciones`

Devuelve el feed global con datos del autor (JOIN con usuarios).

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "url_imagen": "https://cataas.com/cat",
    "descripcion": "Mi gato favorito",
    "likes": 0,
    "fecha_creacion": "2026-06-22T12:00:00.000Z",
    "nombre_usuario": "gato_programador",
    "foto_perfil": "https://placekitten.com/200/200"
  }
]
```

---

### Rutas protegidas

Requieren header: `Authorization: Bearer <token>`

#### `GET /usuarios/perfil`

Retorna el perfil del usuario autenticado (segun el token), con contadores y publicaciones.

**Respuesta 200:**
```json
{
  "usuario": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Gato Programador",
    "email": "gato@example.com",
    "foto_perfil": "https://placekitten.com/200/200",
    "biografia": "Amante de los gatos"
  },
  "contadores": {
    "publicaciones": 3,
    "likes_totales": 15
  },
  "publicaciones": [
    {
      "id": 1,
      "url_imagen": "https://cataas.com/cat",
      "descripcion": "Mi gato favorito",
      "likes": 5,
      "fecha_creacion": "2026-06-22T12:00:00.000Z"
    }
  ]
}
```

---

#### `PUT /usuarios/perfil`

Permite editar biografia, nombre completo o foto de perfil del usuario activo.

**Body (al menos un campo):**
```json
{
  "nombre_completo": "Gato Dev Senior",
  "biografia": "Fullstack cat lover",
  "foto_perfil": "https://placekitten.com/300/300"
}
```

**Respuesta 200:**
```json
{
  "message": "Perfil actualizado exitosamente",
  "usuario": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Gato Dev Senior",
    "email": "gato@example.com",
    "foto_perfil": "https://placekitten.com/300/300",
    "biografia": "Fullstack cat lover"
  }
}
```

---

#### `POST /publicaciones`

Crea una publicacion asignada automaticamente al usuario del token.

**Body:**
```json
{
  "url_imagen": "https://cataas.com/cat/gif",
  "descripcion": "Gato del dia"
}
```

**Respuesta 201:**
```json
{
  "message": "Publicacion creada exitosamente",
  "publicacion": {
    "id": 2,
    "usuario_id": 1,
    "url_imagen": "https://cataas.com/cat/gif",
    "descripcion": "Gato del dia",
    "likes": 0,
    "fecha_creacion": "2026-06-22T14:00:00.000Z"
  }
}
```

## Middleware JWT

El archivo `src/middlewares/authMiddleware.js` intercepta las rutas protegidas:

1. Lee el header `Authorization`.
2. Extrae el token con formato `Bearer <token>`.
3. Verifica firma y expiracion con `jsonwebtoken`.
4. Si es valido, adjunta `req.user` con el payload decodificado.
5. Si falta o expiro, responde `401 Unauthorized`.

### Payload del token

Al hacer login se firma un JWT con:

```json
{
  "id": 1,
  "nombre_usuario": "gato_programador",
  "email": "gato@example.com"
}
```

**No se incluye la contraseña** ni datos sensibles. La expiracion por defecto es de 2 horas (`JWT_EXPIRES_IN=2h`).

## Checklist de entrega

- [x] Servidor web corriendo con Node.js y Express
- [x] Base de datos PostgreSQL (script en `database/schema.sql`)
- [x] Arquitectura separada en `/routes`, `/middlewares`, `/controllers`, `/services`
- [x] Emision de JWT validos tras login exitoso
- [x] Middleware de autenticacion protegiendo rutas privadas
- [x] Endpoint de perfil dinamico segun token
- [x] Variables de entorno con `.env.example`

## Dependencias

- `express` - Servidor HTTP
- `pg` - Cliente PostgreSQL
- `jsonwebtoken` - Tokens JWT
- `bcrypt` - Hash de contraseñas
- `joi` - Validacion de esquemas
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Variables de entorno
