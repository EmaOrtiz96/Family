# 🎨 FamilyPrint — Stickers, 3D, Láser & Más

## Cómo iniciar

### 1. Base de datos
- Abrir phpMyAdmin → Importar → `backend/database.sql`

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
# Editar .env con tus credenciales
python -m uvicorn main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Abrir: **http://localhost:5173**

## Admin
- Email: admin@familyprint.com
- Contraseña: Admin1234!
