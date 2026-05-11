## Prompt à utiliser

```
Lis et applique ces fichiers de contexte avant de faire quoi que ce soit :

- .agent/context/PROJECT_CONTEXT.md   → contexte technique et fonctionnel
- .agent/context/ARCHITECTURE.md      → règles d'architecture obligatoires
- .agent/context/USER_STORIES.md      → scénarios Given/When/Then du MVP
- .agent/workflows/tdd-workflow.md    → workflow TDD strict à respecter
- .agent/skills/nestjs-cinematch/SKILL.md → règles de code NestJS

Règles non négociables :
1. TDD obligatoire : test en premier, toujours.
2. Un seul scénario Given/When/Then à la fois.
3. Ordre : écrire le test → je valide → commit test → implémenter le minimum → commit implémentation.
4. Screaming Architecture : dossier "movies/", pas "services/" ou "controllers/".
5. Vertical slices : chaque slice est autonome.
6. Jamais de logique dans le controller.
7. Jamais de `any`.
8. Erreurs via HttpException NestJS.
9. Variables d'environnement via ConfigService uniquement.

On commence par : US1 — Scénario 1.1.

Propose uniquement :
1. Le fichier de test à créer (chemin complet)
2. Le code du test
3. La commande git de commit

Attends ma validation avant toute implémentation.
```
