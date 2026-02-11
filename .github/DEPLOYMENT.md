# Guide de Configuration du Déploiement VPS

Ce document explique comment configurer le déploiement automatique sur votre VPS via GitHub Actions.

## Prérequis

1. Un serveur VPS avec SSH activé
2. Node.js et npm installés sur le VPS
3. Git installé sur le VPS
4. Un service de gestion de processus (PM2, systemd, ou Docker) - optionnel mais recommandé

## Configuration des Secrets GitHub

Allez dans **Settings > Secrets and variables > Actions** de votre dépôt GitHub et ajoutez les secrets suivants :

### Secrets Requis

- `VPS_HOST` : L'adresse IP ou le domaine de votre VPS (ex: `192.168.1.100` ou `vps.example.com`)
- `VPS_USER` : Le nom d'utilisateur SSH (ex: `root` ou `deploy`)
- `VPS_SSH_KEY` : La clé privée SSH pour se connecter au VPS
- `VPS_DEPLOY_PATH` : Le chemin complet vers le répertoire de déploiement (ex: `/var/www/industriel-rh`)
- `DATABASE_URL` : L'URL de connexion à votre base de données PostgreSQL

### Secrets Optionnels

- `VPS_PORT` : Le port SSH (par défaut: `22`)

## Génération de la Clé SSH

### Sur votre machine locale :

```bash
# Générer une nouvelle paire de clés SSH (si vous n'en avez pas)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Copier la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-vps-ip

# Afficher la clé privée à copier dans GitHub Secrets
cat ~/.ssh/github_actions_deploy
```

**Important** : Copiez le contenu complet de la clé privée (y compris `-----BEGIN OPENSSH PRIVATE KEY-----` et `-----END OPENSSH PRIVATE KEY-----`) dans le secret `VPS_SSH_KEY` de GitHub.

## Configuration Initiale sur le VPS

### 1. Créer le répertoire de déploiement

```bash
sudo mkdir -p /var/www/industriel-rh
sudo chown $USER:$USER /var/www/industriel-rh
cd /var/www/industriel-rh
```

### 2. Cloner le dépôt (première fois)

```bash
git clone https://github.com/votre-username/industriel-rh.git .
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Configurer les variables d'environnement

Créez un fichier `.env` dans le répertoire du projet :

```bash
nano .env
```

Ajoutez vos variables d'environnement :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/industriel_rh"
NODE_ENV="production"
# Ajoutez vos autres variables d'environnement ici
```

### 5. Installer PM2 (recommandé pour la gestion des processus)

```bash
npm install -g pm2

# Créer un fichier ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'industriel-rh',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/industriel-rh',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Démarrer l'application avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Configuration du Workflow

Le workflow est configuré pour :
- Se déclencher automatiquement sur chaque push vers la branche `main`
- Exécuter les tests (lint, build, type-check) avant le déploiement
- Se connecter au VPS via SSH
- Mettre à jour le code, installer les dépendances, builder et redémarrer l'application

## Personnalisation

### Utiliser systemd au lieu de PM2

Si vous préférez utiliser systemd, modifiez le workflow dans `.github/workflows/ci-cd.yml` :

```yaml
# Remplacer la ligne PM2 par :
sudo systemctl restart industriel-rh.service
```

Puis créez un service systemd :

```bash
sudo nano /etc/systemd/system/industriel-rh.service
```

```ini
[Unit]
Description=Industriel RH Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/industriel-rh
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable industriel-rh.service
sudo systemctl start industriel-rh.service
```

### Utiliser Docker

Si vous utilisez Docker, créez un `docker-compose.yml` et modifiez le workflow pour utiliser Docker Compose.

## Dépannage

### Les mises à jour ne sont pas prises en compte sur le serveur

1. **Vérifier que le déploiement s’exécute**  
   Onglet **Actions** → dernier workflow run. Le job "Deploy to VPS" doit être vert. S’il est absent, le déploiement ne tourne que sur **push sur `main`** (pas sur les PR).

2. **Déclencher un déploiement à la main**  
   Actions → "CI/CD Pipeline" → "Run workflow" (bouton **Run workflow**). Utile pour tester sans push.

3. **VPS et dépôt privé**  
   Si le dépôt est **privé**, le VPS doit pouvoir faire `git fetch` :
   - Ajouter une **Deploy key** (Settings → Deploy keys) avec la clé **publique** du VPS.
   - Sur le VPS : `ssh-keygen -t ed25519 -C "vps-deploy"` puis ajouter la clé publique dans GitHub.
   - Ou configurer un **Personal Access Token** pour le clone/fetch (HTTPS).

4. **Branche sur le VPS**  
   Le workflow fait `git fetch origin main` puis `git reset --hard <commit>`. Sur le VPS, vérifier :
   ```bash
   cd $VPS_DEPLOY_PATH
   git remote -v   # doit pointer vers votre dépôt GitHub
   git fetch origin main
   git log -1 --oneline
   ```
   Si la branche par défaut est `master`, adapter le workflow (remplacer `main` par `master`).

5. **Cache Next.js**  
   Le workflow supprime `.next` avant chaque build. Si vous modifiez le workflow et désactivez cette étape, un ancien cache peut rester : en cas de doute, sur le VPS faire `rm -rf .next` puis relancer un déploiement.

6. **Nom de l’app PM2**  
   Le redémarrage utilise : `pm2 restart industriel-rh`. Vérifier le nom exact avec `pm2 list` ; si différent (ex. `industriel-rh-site-1`), adapter la ligne dans `.github/workflows/ci-cd.yml` ou renommer l’app PM2.

### Vérifier les logs du workflow

Allez dans l'onglet **Actions** de votre dépôt GitHub pour voir les logs de déploiement. Le step "Deploy to VPS via SSH" affiche le commit déployé (ex. "Code à jour sur le commit: abc1234").

### Vérifier les logs de l'application sur le VPS

```bash
# Si vous utilisez PM2
pm2 list
pm2 logs industriel-rh

# Si vous utilisez systemd
sudo journalctl -u industriel-rh.service -f
```

### Tester la connexion SSH manuellement

```bash
ssh -i ~/.ssh/github_actions_deploy user@your-vps-ip
```

## Sécurité

- ⚠️ Ne partagez jamais vos clés SSH privées
- ⚠️ Utilisez un utilisateur dédié avec des permissions limitées (pas root si possible)
- ⚠️ Configurez un firewall sur votre VPS
- ⚠️ Utilisez des clés SSH au lieu de mots de passe
- ⚠️ Limitez l'accès SSH par IP si possible
