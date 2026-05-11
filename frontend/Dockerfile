# Étape 1 — image Node.js légère
FROM node:20-alpine

# Étape 2 — dossier de travail
WORKDIR /app

# Étape 3 — copie des dépendances
COPY package*.json ./

# Étape 4 — installation
RUN npm install

# Étape 5 — copie du code
COPY . .

# Étape 6 — port Angular par défaut
EXPOSE 4200

# Étape 7 — démarrage avec --host 0.0.0.0 OBLIGATOIRE sous Docker
# sinon Angular n'est pas accessible depuis l'extérieur du conteneur
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]