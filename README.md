# Tom Veijk Portfolio Website

Een moderne, responsive portfolio website gebouwd met Next.js, TypeScript, TailwindCSS en Framer Motion.

## Features

- Modern design met gradient achtergronden en animaties
- Volledig responsive voor alle schermformaten
- Snelle performance met Next.js 14
- Smooth animaties met Framer Motion
- Admin panel met authenticatie voor content management
- SQLite database voor portfolio items en skills
- Ondersteuning voor afbeeldingen, video's en website embeds
- Contact formulier

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Animaties**: Framer Motion
- **Database**: SQLite met Prisma ORM
- **Authenticatie**: NextAuth.js
- **Icons**: Lucide React

## Installatie

### Vereisten

- Node.js 18+ 
- SQLite (standaard)

### Stappen

1. **Clone het project en installeer dependencies**

```bash
npm install
```

2. **Configureer environment variabelen**

Kopieer `.env.example` naar `.env` en vul de waarden in:

```bash
cp .env.example .env
```

Bewerk `.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="genereer-met-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="info@tomveijk.nl"
ADMIN_PASSWORD="jouw-veilige-wachtwoord"
```

3. **Setup database**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Maak admin gebruiker aan**

Voer dit script uit om een admin gebruiker te maken:

```bash
node scripts/create-admin.js
```

5. **Start development server**

```bash
npm run dev
```

De website is nu beschikbaar op `http://localhost:3000`

## Docker Deployment

### Snelle start met Docker

1. **Bouw en start de container**

```bash
docker-compose up -d
```

### Admin panel

- Admin login: `http://localhost:3000/admin/login`
- Dashboard (beschermd): `http://localhost:3000/admin`

Default Docker credentials (als je geen eigen `.env` meegeeft):

```text
Email: info@tomveijk.nl
Password: admin
```

Als je bij inloggen een 401 krijgt op `/api/auth/callback/credentials`, klopt meestal het email/wachtwoord niet of is de admin user nog niet aangemaakt (check `docker-compose logs -f web`).

2. **Bekijk logs**

```bash
docker-compose logs -f
```

3. **Stop de container**

```bash
docker-compose down
```

### Docker met custom environment variabelen

1. **Kopieer environment bestand**

```bash
cp .env.docker .env
```

2. **Pas aan naar jouw situatie**

Bewerk `.env`:

```env
DATABASE_URL=file:/app/data/prod.db
NEXTAUTH_SECRET=your-super-secret-key-change-this
NEXTAUTH_URL=http://jouw-domein.nl
ADMIN_EMAIL=info@tomveijk.nl
ADMIN_PASSWORD=veilig-wachtwoord
```

3. **Start met custom env file**

```bash
docker-compose --env-file .env up -d
```

### Database migraties in Docker

Als je de database schema aanpast:

```bash
docker-compose exec web npx prisma migrate deploy
```

### Admin gebruiker aanmaken in Docker

```bash
docker-compose exec web node scripts/create-admin.js
```

### Data persistence

De SQLite database wordt opgeslagen in een Docker volume genaamd `sqlite-data`. Dit betekent dat je data behouden blijft, zelfs als je de container herstart of verwijdert.

Om de data te verwijderen:

```bash
docker-compose down -v
```

## Deployment op VPS

### 1. Installeer vereisten op VPS

```bash
# Update systeem
sudo apt update && sudo apt upgrade -y

# Installeer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installeer PostgreSQL
sudo apt install postgresql postgresql-contrib
```

### 2. Setup PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE tomveijk_portfolio;
CREATE USER tomveijk WITH PASSWORD 'jouw-wachtwoord';
GRANT ALL PRIVILEGES ON DATABASE tomveijk_portfolio TO tomveijk;
\q
```

### 3. Clone en configureer project

```bash
cd /var/www
git clone [jouw-repo-url] tomveijk-portfolio
cd tomveijk-portfolio
npm install
```

### 4. Configureer productie .env

```env
DATABASE_URL="postgresql://tomveijk:jouw-wachtwoord@localhost:5432/tomveijk_portfolio?schema=public"
NEXTAUTH_SECRET="productie-secret-key"
NEXTAUTH_URL="https://tomveijk.nl"
ADMIN_EMAIL="info@tomveijk.nl"
ADMIN_PASSWORD="veilig-productie-wachtwoord"
```

### 5. Build en start

```bash
npx prisma migrate deploy
npx prisma generate
npm run build
npm start
```

### 6. Setup PM2 (optioneel maar aanbevolen)

```bash
sudo npm install -g pm2
pm2 start npm --name "tomveijk-portfolio" -- start
pm2 startup
pm2 save
```

### 7. Setup Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name tomveijk.nl www.tomveijk.nl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. SSL met Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tomveijk.nl -d www.tomveijk.nl
```

## Admin Panel

Ga naar `/admin/login` om in te loggen met je admin credentials.

Vanuit het admin panel kun je:
- Portfolio items toevoegen/bewerken/verwijderen
- Skills beheren
- Media uploaden (afbeeldingen, video's)
- Website embeds toevoegen

## Project Structuur

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin panel
│   ├── portfolio/        # Portfolio detail pagina's
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── Navigation.tsx    # Navigatie component
│   ├── HeroSection.tsx   # Hero sectie
│   ├── SkillsSection.tsx # Skills sectie
│   ├── PortfolioSection.tsx # Portfolio grid
│   └── ContactModal.tsx  # Contact formulier
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functies
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Statische bestanden
```

## Kleuren

De website gebruikt de volgende kleurenpalet:

- **Primary**: `#00D752` (Groen)
- **Secondary**: `#A34BFF` (Paars)
- **Accent**: `#30A8FF` (Blauw)
- **Background**: Gradient van `#030310` → `#001E36` → `#00D752`

## 🎨 Logo Animation

Place your logo animation GIF at `/public/logo-animation.gif`. The hero section will automatically display it with a mouse-parallax effect. If the file is not found, a fallback logo will be displayed.

## 🤝 Partner Logos

Place your partner/collaboration logos in `/public/logos/` with the following names:
- `partner-1.png`
- `partner-2.png`
- `partner-3.png`
- `partner-4.png`
- `partner-5.png`

The logos will be displayed in a horizontal bar with grayscale effect that becomes colored on hover. If images are not found, placeholder text will be shown.

## Support

Voor vragen of problemen, neem contact op via info@tomveijk.nl

## Licentie

Copyright 2025 - Tom's Webontwikkeling
