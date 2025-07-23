# 🛠️ Prueba Técnica Fullstack: Node.js + MongoDB + React

Este proyecto es una aplicación fullstack que permite realizar un CRUD de personas utilizando:
- Backend con Node.js y MongoDB sin Mongoose.
- Frontend con React 16.9.
- Despliegue local usando Docker y Docker Compose.

---
## 🚀 Cómo iniciar el proyecto localmente

### ✅ Requisitos
- Docker
- Docker Compose
- Node < 20

### ⚙️ Iniciar con Docker

docker-compose up --build
Esto levantará:

MongoDB en localhost:27017

Backend en localhost:3001

Frontend en localhost:3000

## Variable de entorno en el front .env

REACT_APP_API_URL=http://localhost:3001

## Probar conexión base de datos

docker exec -it mongo mongosh
> rs.status()

# Scripts utiles

cd backend
npm install
npm start

cd frontend
npm install
npm start
