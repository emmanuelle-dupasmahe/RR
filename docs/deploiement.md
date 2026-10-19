# Déployer le même dépôt sur le LXC et le VPS

Git transporte les sources. Les fichiers `.env`, les médias de `backend/uploads`,
la base MySQL et le résultat de la compilation `frontend/dist` restent propres
à chaque serveur.

## Chemin du frontend

Sur le LXC, le site est servi à la racine du domaine : aucune variable supplémentaire
n'est nécessaire (`VITE_BASE_PATH=/` par défaut).

Sur le VPS, le site est servi sous `/resrock/`. Dans `frontend/.env.local` :

```env
VITE_BASE_PATH=/resrock/
```

Sans `VITE_API_URL`, les requêtes utilisent alors `/resrock/api` et
`/resrock/uploads`. Une ancienne valeur `VITE_API_URL` dans `frontend/.env`
peut remplacer ce comportement : supprimer cette valeur si le backend est servi
par le même domaine et le même préfixe, ou lui donner l'adresse publique correcte
(sans suffixe `/api`). Les variables Vite sont intégrées au moment du build.

```bash
cd /home/projets/RR/frontend
npm ci
npm run build
```

Le compte qui construit doit pouvoir écrire dans `frontend/dist`. Compiler dans
un dossier temporaire puis remplacer le build permet de conserver l'ancien build
pendant la compilation.

## Apache et backend du VPS

Le frontend compilé est servi par un alias Apache `/resrock/` vers
`/home/projets/RR/frontend/dist/`. Le fallback SPA doit renvoyer
`/resrock/index.html` pour permettre de recharger une page comme `/resrock/contact`.
Les règles API et médias précèdent cet alias :

```apache
ProxyPass        /resrock/api/     http://127.0.0.1:5000/api/
ProxyPassReverse /resrock/api/     http://127.0.0.1:5000/api/
ProxyPass        /resrock/uploads/ http://127.0.0.1:5000/uploads/
ProxyPassReverse /resrock/uploads/ http://127.0.0.1:5000/uploads/
```

Le compte du processus Node doit pouvoir écrire dans `backend/uploads`. Sur le
VPS actuel, PM2 appartient au compte `debian` et le processus s'appelle
`rr-backend` :

```bash
sudo install -d -o debian -g debian -m 0755 /home/projets/RR/backend/uploads
cd /home/projets/RR/backend
pm2 restart rr-backend --update-env
curl --fail http://127.0.0.1:5000/api/health
curl --fail http://vps-9a818ab2.vps.ovh.net/resrock/api/health
```

## Données et médias

Pour reproduire les données du LXC, exporter sa base et copier ses fichiers
`backend/uploads`. Importer l'export dans une nouvelle base du VPS, vérifier les
comptages et les fichiers, puis ajuster `DB_NAME` dans `backend/.env` et redémarrer
le backend. Conserver l'ancienne base et la configuration pour revenir en arrière.
Les identifiants MySQL du VPS restent ceux du VPS ; ne pas remplacer son `.env`
par celui du LXC.

Les images de `frontend/public` sont suivies dans Git et sont copiées dans
`frontend/dist` par le build. Leurs URL doivent contenir `/resrock/` sur le VPS.

Après le déploiement, vérifier les pages, les fichiers JS/CSS, le manifeste,
les images et les API. Si le navigateur demande encore un ancien fichier JS,
faire un rechargement complet ; vérifier aussi le service worker s'il était actif.
