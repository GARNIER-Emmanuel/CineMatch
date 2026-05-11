# Étape 1 — on part d'une image Node.js légère
FROM node:20-alpine

# Étape 2 — on définit le dossier de travail dans le conteneur
WORKDIR /app

# Étape 3 — on copie les fichiers de dépendances en premier
# (optimisation : Docker met ça en cache si package.json n'a pas changé)
COPY package*.json ./

# Étape 4 — on installe les dépendances
RUN npm install

# Étape 5 — on copie tout le reste du code
COPY . .

# Étape 6 — on expose le port utilisé par NestJS
EXPOSE 3000

# Étape 7 — commande de démarrage en mode développement
CMD ["npm", "run", "start:dev"]