#!/bin/bash

# Script to add a new website to VPS with Traefik
# Usage: ./add-site.sh site-name domain.com

set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <site-name> <domain.com>"
    echo "Example: $0 mysite example.com"
    exit 1
fi

SITE_NAME=$1
DOMAIN=$2
SITE_DIR="/var/www/$SITE_NAME"

echo "Adding new site: $SITE_NAME at $DOMAIN"

# Create site directory
if [ -d "$SITE_DIR" ]; then
    echo "Error: Directory $SITE_DIR already exists"
    exit 1
fi

echo "Creating directory: $SITE_DIR"
sudo mkdir -p "$SITE_DIR"

# Copy site template
echo "Copying docker-compose template..."
sudo cp docker-compose.site-template.yml "$SITE_DIR/docker-compose.yml"

# Replace placeholders
echo "Configuring site..."
sudo sed -i "s/SITE_NAME/$SITE_NAME/g" "$SITE_DIR/docker-compose.yml"
sudo sed -i "s/DOMAIN.COM/$DOMAIN/g" "$SITE_DIR/docker-compose.yml"

# Create .env file
echo "Creating .env file..."
sudo cat > "$SITE_DIR/.env" << EOF
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://$DOMAIN
ADMIN_EMAIL=info@tomveijk.nl
ADMIN_PASSWORD=$(openssl rand -base64 12)
EOF

echo ""
echo "Site created successfully!"
echo ""
echo "Next steps:"
echo "1. Copy your project files to: $SITE_DIR"
echo "2. Update DNS: Add A record pointing $DOMAIN to this server's IP"
echo "3. Update .env file at: $SITE_DIR/.env"
echo "4. Start the site: cd $SITE_DIR && docker-compose up -d"
echo ""
echo "Admin credentials (change these!):"
echo "Email: info@tomveijk.nl"
echo "Password: $(sudo cat $SITE_DIR/.env | grep ADMIN_PASSWORD | cut -d'=' -f2)"
echo ""
