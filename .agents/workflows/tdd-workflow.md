---
description: tdd-workflow
---

---
name: tdd-workflow
description: >
  Workflow TDD strict pour CineMatch. S'active quand l'utilisateur demande
  de développer une User Story ou un scénario. Impose : test → commit → code → commit.
  Un seul scénario Given/When/Then à la fois. Jamais de génération massive.
triggers:
  - user story
  - US
  - scénario
  - implémente
  - développe
  - TDD
  - Given
  - When
  - Then
---

# Workflow TDD Strict — CineMatch

## Règle fondamentale

> Un scénario = un test = un commit = une implémentation = un commit.
> Jamais plus. Jamais moins.

## Séquence obligatoire

```
┌─────────────────────────────────────┐
│  1. Lire USER_STORIES.md            │
│  2. Annoncer le scénario choisi     │
│  3. Écrire le test (RED)            │
│  4. Valider que le test échoue      │
│  5. Commit du test                  │
│  6. Écrire le code minimum (GREEN)  │
│  7. Valider que le test passe       │
│  8. Commit de l'implémentation      │
│  9. Passer au scénario suivant      │
└─────────────────────────────────────┘
```

## Détail de chaque étape

### Étape 1 — Choisir le scénario
- Toujours dans l'ordre de `USER_STORIES.md` section "Ordre de développement"
- Annoncer : "Je travaille sur : US1 — Scénario 1.1"

### Étape 2 — Écrire le test (RED)
- Créer ou compléter le `.spec.ts` du slice concerné
- Mocker toutes les dépendances externes (Axios, TMDB)
- Rédiger une explication simple du code en commentaires
- Ne toucher à **aucun autre fichier**

### Étape 3 — Vérifier que le test échoue
```bash
npm run test -- --testPathPattern=movies.service
```
- Si le test passe sans code → le test est mal écrit, le corriger

### Étape 4 — Commit du test
```bash
git add src/movies/movies.service.spec.ts
git commit -m "test(movies): <description du scénario en francais>"
```

### Étape 5 — Implémenter le code minimum (GREEN)
- Écrire **uniquement** ce qui est nécessaire pour faire passer CE test
- Pas de code anticipatoire, pas de refacto prématurée
- Relancer le test → il doit passer

### Étape 6 — Commit de l'implémentation
```bash
git add src/movies/
git commit -m "feat(movies): <description de l'implémentation>"
```

### Étape 7 — Passer au suivant
- Retour à l'étape 1 avec le scénario suivant
- Ne pusher que quand toute une US est terminée et tous les tests passent

## Interdictions absolues

- ❌ Écrire plusieurs tests d'un coup
- ❌ Implémenter avant que le test soit commité
- ❌ Générer un service ou controller complet en une seule fois
- ❌ Modifier un test pour le faire passer artificiellement
- ❌ Pusher sans que `npm run test` soit entièrement vert

## Commandes de référence

```bash
# Lancer tous les tests
npm run test

# Lancer un fichier spécifique
npm run test -- --testPathPattern=movies.service

# Mode watch (pendant le dev)
npm run test:watch

# Couverture de code
npm run test:cov
```