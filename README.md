# Pinterest Clone - Next.js Full-Stack

Un clone complet de Pinterest créé avec Next.js 14, incluant authentification, upload d'images, grille Masonry, et gestion de tableaux.

## 🚀 Technologies utilisées

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de données**: MySQL / MariaDB
- **Authentification**: NextAuth.js avec credentials
- **Upload**: Système local avec option Cloudinary
- **Styling**: Tailwind CSS avec thème Pinterest

## 📋 Fonctionnalités

✅ Authentification complète (inscription, connexion, déconnexion)  
✅ Création et upload de pins avec images  
✅ Grille Masonry responsive (2 à 5 colonnes selon l'écran)  
✅ Système de likes  
✅ Recherche de pins  
✅ Gestion de tableaux (boards)  
✅ Profil utilisateur  
✅ Design inspiré de Pinterest  

## 🛠️ Installation

### 1. Prérequis

- Node.js 18+ installé
- MySQL ou MariaDB installé et en cours d'exécution
- npm ou yarn

### 2. Cloner et installer

```bash
# Aller dans le dossier du projet
cd pinterest-clone

# Installer les dépendances
npm install
```

### 3. Configuration de la base de données

Créer une base de données MySQL :

```sql
CREATE DATABASE pinterest_clone;
```

Copier le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Modifier le fichier `.env` avec vos informations :

```env
DATABASE_URL="mysql://votre_user:votre_password@localhost:3306/pinterest_clone"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="générez-une-clé-secrète-ici"
```

Pour générer un secret sécurisé :

```bash
openssl rand -base64 32
```

### 4. Initialiser la base de données

```bash
# Créer les tables avec Prisma
npm run db:push

# (Optionnel) Ouvrir Prisma Studio pour voir vos données
npm run db:studio
```

### 5. Lancer le projet

```bash
# Mode développement
npm run dev

# Le site sera accessible sur http://localhost:3000
```

## 📁 Structure du projet

```
pinterest-clone/
├── app/
│   ├── api/              # API Routes (backend)
│   │   ├── auth/         # Authentification
│   │   ├── pins/         # CRUD pins
│   │   ├── boards/       # CRUD boards
│   │   └── upload/       # Upload d'images
│   ├── create/           # Page création de pin
│   ├── boards/           # Page des tableaux
│   ├── login/            # Page de connexion
│   ├── register/         # Page d'inscription
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Page d'accueil
├── components/
│   ├── Navbar.tsx        # Barre de navigation
│   ├── MasonryGrid.tsx   # Grille Masonry
│   ├── PinCard.tsx       # Carte de pin
│   └── Providers.tsx     # Providers NextAuth
├── lib/
│   ├── auth.ts           # Configuration NextAuth
│   └── prisma.ts         # Client Prisma
├── prisma/
│   └── schema.prisma     # Schéma de la base de données
└── public/
    └── uploads/          # Images uploadées (créé automatiquement)
```

## 🎨 Utilisation

### Créer un compte

1. Aller sur `/register`
2. Remplir le formulaire d'inscription
3. Vous serez automatiquement connecté

### Créer un pin

1. Cliquer sur le bouton "+" dans la navbar
2. Uploader une image (glisser-déposer ou clic)
3. Ajouter un titre et une description
4. Cliquer sur "Créer le Pin"

### Rechercher

Utiliser la barre de recherche dans la navbar pour chercher des pins par titre ou description.

### Liker un pin

Survoler un pin et cliquer sur le cœur (nécessite d'être connecté).

## 🔧 Scripts disponibles

```bash
npm run dev          # Lancer en mode développement
npm run build        # Build pour la production
npm run start        # Lancer en production
npm run lint         # Linter le code
npm run db:push      # Mettre à jour la base de données
npm run db:studio    # Ouvrir Prisma Studio
```

## 🌐 API Routes

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/[...nextauth]` - Connexion NextAuth

### Pins
- `GET /api/pins` - Récupérer tous les pins (avec recherche optionnelle)
- `POST /api/pins` - Créer un pin
- `POST /api/pins/[id]/like` - Liker/unliker un pin

### Upload
- `POST /api/upload` - Uploader une image

### Boards
- `GET /api/boards` - Récupérer les boards de l'utilisateur
- `POST /api/boards` - Créer un board

## 🚧 Fonctionnalités à venir

- [ ] Commentaires sur les pins
- [ ] Épingler un pin dans un board
- [ ] Suivre d'autres utilisateurs
- [ ] Feed personnalisé
- [ ] Notifications
- [ ] Partage de pins
- [ ] Collections privées
- [ ] Intégration Cloudinary pour l'upload
- [ ] Optimisation des images avec Sharp

## 📝 Base de données

Le schéma Prisma inclut :

- **User** : Utilisateurs
- **Pin** : Pins (images)
- **Board** : Tableaux de pins
- **BoardPin** : Relation many-to-many entre boards et pins
- **Like** : Likes sur les pins
- **Comment** : Commentaires (préparé pour futur)
- **Follow** : Système de followers (préparé pour futur)

## 🎨 Personnalisation

Les couleurs Pinterest sont définies dans `tailwind.config.js` :

```js
colors: {
  pinterest: {
    red: '#E60023',
    'red-hover': '#AD081B',
    black: '#111111',
    gray: '#767676',
    'light-gray': '#EFEFEF',
  },
}
```

## 🐛 Dépannage

**Erreur de connexion à la base de données**
- Vérifier que MySQL/MariaDB est lancé
- Vérifier les credentials dans `.env`
- Vérifier que la base de données existe

**Images ne s'affichent pas**
- Vérifier que le dossier `public/uploads` existe
- Vérifier les permissions du dossier

**Erreur NextAuth**
- Vérifier que `NEXTAUTH_SECRET` est défini
- Vérifier que `NEXTAUTH_URL` correspond à votre URL

## 📄 Licence

Ce projet est créé à des fins éducatives.

## 🤝 Contribution

N'hésitez pas à ouvrir des issues ou proposer des améliorations !
