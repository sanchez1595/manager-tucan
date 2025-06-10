# Tucan Manager

Aplicación web desarrollada con Next.js (frontend) y FastAPI (backend) con autenticación Bearer Token y base de datos PostgreSQL.

## Estructura del Proyecto

```
/
├── frontend/          # Next.js + TypeScript + Tailwind + shadcn/ui
├── backend/           # FastAPI + SQLAlchemy + PostgreSQL
└── README.md
```

## Configuración del Entorno

### Backend (FastAPI)

1. **Crear entorno virtual:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con tus credenciales de base de datos.

4. **Configurar Base de Datos:**
   
   **Opción 1: PostgreSQL Local**
   ```bash
   # Instalar PostgreSQL y crear base de datos
   createdb tucan_manager
   ```
   
   **Opción 2: PostgreSQL en Docker**
   ```bash
   docker run --name tucan-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=tucan_manager -p 5432:5432 -d postgres:15
   ```
   
   **Opción 3: PostgreSQL en la Nube**
   - Supabase, Railway, Neon, etc.
   - Actualizar `DATABASE_URL` en `.env`

5. **Ejecutar migraciones:**
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

6. **Ejecutar servidor:**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend (Next.js)

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## Endpoints de API

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual (requiere token)

### General
- `GET /` - Mensaje de bienvenida
- `GET /health` - Health check

## Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI

### Backend
- **FastAPI** - Framework web
- **SQLAlchemy** - ORM
- **Alembic** - Migraciones
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas

## Próximos Pasos

1. Configurar base de datos PostgreSQL
2. Definir el dominio y funcionalidades específicas del proyecto
3. Implementar frontend con componentes de autenticación
4. Desarrollar funcionalidades principales

## Desarrollo

El proyecto sigue las reglas definidas en `/rulers/`:
- Código limpio y best practices
- Componentes reutilizables
- Tipado estricto
- Documentación clara