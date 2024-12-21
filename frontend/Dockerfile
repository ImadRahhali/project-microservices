# Étape 1 : Construction de l'image avec Node.js Alpine
FROM node:18-alpine AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et package-lock.json (ou yarn.lock si vous utilisez yarn)
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Construire l'application React pour la production
RUN npm run build
