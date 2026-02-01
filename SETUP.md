# Setup Instructies

## Stap 1: Update je .env bestand

Open het `.env` bestand en vervang de inhoud met:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="jmu3oYCk3m/YCWE3fdHAhC+88hrl+asaZCQpI7AsDUs="
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="info@tomveijk.nl"
ADMIN_PASSWORD="admin123"
```

## Stap 2: Run de volgende commando's

```bash
# Database migratie uitvoeren
npx prisma migrate dev --name init

# Admin gebruiker en demo data aanmaken
node scripts/create-admin.js

# Development server starten
npm run dev
```

## Stap 3: Open de website

Ga naar: http://localhost:3000

## Admin Panel

Login op: http://localhost:3000/admin/login
- Email: info@tomveijk.nl
- Password: admin123

## Logo Animatie

Plaats je logo animatie GIF in `/public/logo-animation.gif`
