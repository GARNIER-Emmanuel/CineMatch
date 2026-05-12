import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// IMPORTANT : Assure-toi d'avoir ta clé TMDB dans un fichier .env à la racine du backend
const API_KEY = process.env.TMDB_API_KEY || 'e356cfc4cfc652dc98efb8b201a052ff'; // J'utilise une clé par défaut si non trouvé, mais tu devrais la passer en env
const BASE_URL = 'https://api.themoviedb.org/3';
const DB_PATH = path.join(__dirname, '../data/directors-db.json');

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedDatabase() {
  console.log('🎬 Début du peuplement de la base de données des réalisateurs...');
  
  const popularIds = new Set<number>();

  // 1. Scanner 50 pages de films les mieux notés (1000 films cultes) pour extraire TOUS les grands réalisateurs
  console.log('📡 Scan des 1000 films les plus cultes de l\'histoire...');
  for (let i = 1; i <= 50; i++) {
    try {
      const res = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: { api_key: API_KEY, page: i, language: 'fr-FR' }
      });
      
      const movies = res.data.results;
      // Pour chaque film on récupère les crédits
      const creditsRequests = movies.map((m: any) => 
        axios.get(`${BASE_URL}/movie/${m.id}/credits`, { params: { api_key: API_KEY } }).catch(() => null)
      );
      
      const creditsResponses = await Promise.all(creditsRequests);
      creditsResponses.forEach(cRes => {
        if (cRes && cRes.data && cRes.data.crew) {
          const director = cRes.data.crew.find((member: any) => member.job === 'Director');
          if (director) popularIds.add(director.id);
        }
      });
      
      process.stdout.write(`Scan films : page ${i} / 50\r`);
      await delay(200);
    } catch (e) {
      console.error(`Erreur page ${i}`);
    }
  }
  console.log('\n');

  // 2. Ajouter les réalisateurs tendances du moment
  console.log('📡 Scan des réalisateurs populaires du moment...');
  for (let i = 1; i <= 10; i++) {
    try {
      const res = await axios.get(`${BASE_URL}/person/popular`, {
        params: { api_key: API_KEY, page: i, language: 'fr-FR' }
      });
      const directors = res.data.results.filter((p: any) => p.known_for_department === 'Directing');
      directors.forEach((d: any) => popularIds.add(d.id));
      await delay(100);
    } catch (e) {}
  }
  const uniqueIds = Array.from(popularIds);
  console.log(`✅ ${uniqueIds.length} réalisateurs uniques identifiés.`);

  // 3. Récupération des profils complets
  console.log('📥 Téléchargement des profils complets (cela peut prendre 1 à 2 minutes)...');
  const directorsDB: any[] = [];
  
  // Par lots de 20 pour éviter de timeout
  for (let i = 0; i < uniqueIds.length; i += 20) {
    const chunk = uniqueIds.slice(i, i + 20);
    const requests = chunk.map(id => 
      axios.get(`${BASE_URL}/person/${id}`, {
        params: { api_key: API_KEY, language: 'fr-FR' }
      }).catch(() => null)
    );

    const responses = await Promise.all(requests);
    responses.forEach(res => {
      if (res && res.data && res.data.birthday) {
        directorsDB.push({
          id: res.data.id,
          name: res.data.name,
          biography: res.data.biography,
          birthday: res.data.birthday,
          deathday: res.data.deathday,
          placeOfBirth: res.data.place_of_birth,
          image: res.data.profile_path ? `https://image.tmdb.org/t/p/w500${res.data.profile_path}` : null,
          birthYear: parseInt(res.data.birthday.split('-')[0], 10)
        });
      }
    });
    
    process.stdout.write(`Progression : ${Math.min(i + 20, uniqueIds.length)} / ${uniqueIds.length}\r`);
    await delay(300); // Quota de sécurité TMDB (environ 40 requêtes / 10s)
  }

  console.log('\n💾 Sauvegarde dans la base de données locale...');
  
  // S'assurer que le dossier data existe
  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(directorsDB, null, 2), 'utf-8');
  console.log(`🎉 Succès ! ${directorsDB.length} réalisateurs enregistrés dans ${DB_PATH}.`);
}

seedDatabase();
