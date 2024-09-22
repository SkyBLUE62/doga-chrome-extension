# Utilisez une image de base officielle de Node.js
FROM node:16-alpine

# Répertoire de travail pour l'application
WORKDIR /usr/src/doga-alerte-chrome-server

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install --production

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Expose le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande pour lancer l'application
CMD ["npm", "start"]
