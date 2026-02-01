# VPS Setup Guide - Multi-Site met Traefik

Complete gids voor het opzetten van meerdere Next.js websites op één VPS met automatische SSL via Traefik.

## Overzicht

Deze setup maakt gebruik van:
- **Traefik** als reverse proxy met automatische Let's Encrypt SSL
- **Docker & Docker Compose** voor containerisatie
- **SQLite** database per site (in Docker volumes)
- **Shared network** voor communicatie tussen Traefik en sites

## Vereisten

- VPS met Ubuntu 22.04 LTS (of nieuwer)
- Root of sudo toegang
- Domeinnaam(en) met DNS controle

## Stap 1: Server Voorbereiding

### Update systeem

```bash
sudo apt update && sudo apt upgrade -y
```

### Installeer Docker

```bash
# Installeer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Voeg gebruiker toe aan docker group
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Log opnieuw in voor group changes
exit
```

### Installeer Docker Compose

```bash
sudo apt install docker-compose-plugin -y
```

### Firewall configureren

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

## Stap 2: Traefik Installatie

### Creëer Traefik network

```bash
docker network create traefik-network
```

### Download Traefik configuratie

```bash
mkdir -p ~/traefik
cd ~/traefik
wget https://raw.githubusercontent.com/YOUR_REPO/docker-compose.traefik.yml
```

### Pas configuratie aan

Bewerk `docker-compose.traefik.yml` en wijzig:
- Email adres voor Let's Encrypt: `admin@example.com` → `jouw@email.com`
- Dashboard wachtwoord (optioneel)

Genereer nieuw dashboard wachtwoord:
```bash
echo $(htpasswd -nb admin jouw-wachtwoord) | sed -e s/\\$/\\$\\$/g
```

### Start Traefik

```bash
docker-compose -f docker-compose.traefik.yml up -d
```

### Controleer status

```bash
docker ps
docker logs traefik
```

## Stap 3: Eerste Website Toevoegen

### Maak site directory

```bash
sudo mkdir -p /var/www/tomveijk-portfolio
cd /var/www/tomveijk-portfolio
```

### Clone of upload je project

Optie A - Via Git:
```bash
git clone https://github.com/YOUR_USERNAME/personal-website.git .
```

Optie B - Via FTP/SCP:
```bash
# Upload bestanden via FileZilla of scp
scp -r ./local-project/* user@your-vps-ip:/var/www/tomveijk-portfolio/
```

### Maak docker-compose.yml

Kopieer `docker-compose.site-template.yml` en pas aan:
```bash
cp docker-compose.site-template.yml docker-compose.yml

# Vervang placeholders
sed -i 's/SITE_NAME/tomveijk/g' docker-compose.yml
sed -i 's/DOMAIN.COM/tomveijk.nl/g' docker-compose.yml
sed -i 's/ADMIN_EMAIL="info@tomveijk.nl"/g' docker-compose.yml
```

### Maak .env bestand

```bash
cat > .env << 'EOF'
NEXTAUTH_SECRET=<genereer met: openssl rand -base64 32>
NEXTAUTH_URL=https://tomveijk.nl
ADMIN_EMAIL=info@tomveijk.nl
ADMIN_PASSWORD=<veilig wachtwoord>
EOF
```

### DNS configureren

Ga naar je DNS provider (bijv. Cloudflare, Namecheap) en voeg toe:
```
Type: A
Name: @
Value: <jouw-vps-ip>
TTL: Auto

Type: A
Name: www
Value: <jouw-vps-ip>
TTL: Auto
```

Wacht 5-15 minuten voor DNS propagatie.

### Build en start de site

```bash
docker-compose build
docker-compose up -d
```

### Controleer logs

```bash
docker-compose logs -f
```

### Test de site

Bezoek `https://tomveijk.nl` - SSL certificaat wordt automatisch aangemaakt!

## Stap 4: Tweede Website Toevoegen

### Gebruik het add-site script

```bash
cd ~/
chmod +x scripts/add-site.sh
./scripts/add-site.sh mijnsite mijnsite.nl
```

Dit creëert automatisch:
- Directory `/var/www/mijnsite`
- docker-compose.yml met correcte configuratie
- .env bestand met random wachtwoorden

### Upload project bestanden

```bash
cd /var/www/mijnsite
# Upload je code hier
```

### Configureer DNS voor nieuwe site

Herhaal DNS stappen voor `mijnsite.nl`

### Start de nieuwe site

```bash
cd /var/www/mijnsite
docker-compose build
docker-compose up -d
```

## Database Beheer

### Backup maken van SQLite database

```bash
# Voor specifieke site
docker exec tomveijk sh -c 'sqlite3 /app/data/prod.db .dump' > backup.sql

# Of kopieer het hele volume
docker run --rm -v tomveijk-portfolio_sqlite-data:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz /data
```

### Database herstellen

```bash
# Van SQL dump
cat backup.sql | docker exec -i tomveijk sqlite3 /app/data/prod.db

# Van tar.gz
docker run --rm -v tomveijk-portfolio_sqlite-data:/data -v $(pwd):/backup alpine tar xzf /backup/db-backup.tar.gz -C /
```

## Handige Commando's

### Sites beheren

```bash
# Stop een site
cd /var/www/SITE_NAME
docker-compose down

# Start een site
docker-compose up -d

# Rebuild na code wijzigingen
docker-compose build
docker-compose up -d

# Bekijk logs
docker-compose logs -f

# Bekijk resource gebruik
docker stats
```

### Traefik beheren

```bash
cd ~/traefik

# Herstart Traefik
docker-compose restart

# Bekijk Traefik logs
docker-compose logs -f

# Hernieuw alle SSL certificaten
docker-compose restart traefik
```

### Volume beheer

```bash
# Lijst alle volumes
docker volume ls

# Inspecteer volume
docker volume inspect VOLUME_NAME

# Backup volume
docker run --rm -v VOLUME_NAME:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data

# Verwijder ongebruikte volumes (VOORZICHTIG!)
docker volume prune
```

## Troubleshooting

### SSL certificaat wordt niet aangemaakt

1. Controleer DNS: `dig +short DOMAIN.COM`
2. Controleer Traefik logs: `docker logs traefik`
3. Verificeer dat poorten 80 en 443 open zijn
4. Check rate limits van Let's Encrypt

### Site niet bereikbaar

1. Check of container draait: `docker ps`
2. Check logs: `docker-compose logs`
3. Ping het domein: `ping DOMAIN.COM`
4. Test direct port: `curl http://localhost:3000` (binnen container)

### Database errors

1. Check permissions: `ls -la /var/lib/docker/volumes/`
2. Controleer volume mount: `docker inspect CONTAINER_NAME`
3. Test database connectie binnen container:
```bash
docker exec -it CONTAINER_NAME sh
sqlite3 /app/data/prod.db "SELECT * FROM User;"
```

### Out of disk space

```bash
# Check disk usage
df -h

# Clean Docker cache
docker system prune -a --volumes

# Clean old images
docker image prune -a
```

## Monitoring & Updates

### Setup monitoring (optioneel)

```bash
# Installeer htop voor resource monitoring
sudo apt install htop

# Gebruik docker stats
docker stats --no-stream
```

### Updates uitvoeren

```bash
# Update systeem packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
cd /var/www/SITE_NAME
docker-compose pull
docker-compose build
docker-compose up -d

# Cleanup oude images
docker image prune -a
```

### Automatische backups (cronjob)

```bash
# Maak backup script
cat > ~/backup-sites.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR

for site in /var/www/*; do
    SITE_NAME=$(basename $site)
    docker run --rm \
        -v ${SITE_NAME}_sqlite-data:/data \
        -v $BACKUP_DIR:/backup \
        alpine tar czf /backup/${SITE_NAME}-$(date +%Y%m%d).tar.gz /data
done

# Verwijder backups ouder dan 30 dagen
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x ~/backup-sites.sh

# Voeg toe aan cron (dagelijks om 2:00)
(crontab -l 2>/dev/null; echo "0 2 * * * ~/backup-sites.sh") | crontab -
```

## Security Best Practices

1. **Sterke wachtwoorden**: Gebruik `openssl rand -base64 32` voor secrets
2. **Firewall**: Alleen poorten 22, 80, 443 open
3. **SSH keys**: Schakel password auth uit, gebruik alleen SSH keys
4. **Updates**: Regelmatig `apt update && apt upgrade`
5. **Backups**: Dagelijkse automated backups
6. **Monitoring**: Setup fail2ban voor brute force protection

```bash
# Installeer fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Kosten Optimalisatie

Voor kleine sites op gedeelde VPS:
- **512MB RAM**: 1-2 sites mogelijk
- **1GB RAM**: 3-5 sites mogelijk  
- **2GB RAM**: 5-10 sites mogelijk

Tips:
- Gebruik lightweight base images (alpine)
- Enable output: 'standalone' in Next.js config
- Gebruik SQLite (geen aparte database container)
- Share Traefik tussen alle sites

## Support

Bij problemen:
1. Check logs: `docker-compose logs -f`
2. Check Traefik dashboard: `https://traefik.localhost` (als configured)
3. Test health checks: `docker inspect CONTAINER_NAME`

## Conclusie

Je hebt nu een fully operational multi-site setup met:
- Automatische SSL voor alle sites
- Geïsoleerde databases per site
- Easy scaling voor nieuwe sites
- Production-ready configuratie

Voeg nieuwe sites toe met één commando en DNS configuratie!
