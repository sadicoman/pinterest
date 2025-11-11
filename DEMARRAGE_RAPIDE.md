# 🚀 Guide de Démarrage Rapide

## Installation en 5 minutes

### Étape 1 : Installer les dépendances

```bash
npm install
```

### Étape 2 : Configurer la base de données

1. **Créer la base de données MySQL :**

```sql
CREATE DATABASE pinterest_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Copier et configurer le fichier .env :**

```bash
cp .env.example .env
```

3. **Modifier `.env` avec vos informations :**

```env
DATABASE_URL="mysql://root:votre_password@localhost:3306/pinterest_clone"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre_secret_genere"
```

💡 **Générer un secret sécurisé :**
```bash
openssl rand -base64 32
```

### Étape 3 : Initialiser la base de données

```bash
npm run db:push
```

Ceci va créer toutes les tables nécessaires automatiquement !

### Étape 4 : Lancer le projet

```bash
npm run dev
```

Ouvrez http://localhost:3000 dans votre navigateur 🎉

---

## Premiers pas

### 1. Créer un compte
- Allez sur http://localhost:3000/register
- Créez votre compte avec email/mot de passe

### 2. Créer votre premier pin
- Cliquez sur le bouton "+" dans la barre de navigation
- Uploadez une image
- Ajoutez un titre et une description
- Cliquez sur "Créer le Pin"

### 3. Explorer
- Voir tous les pins sur la page d'accueil
- Utiliser la recherche pour trouver des pins
- Liker des pins en survolant et cliquant sur le cœur
- Créer des tableaux pour organiser vos pins

---

## Structure des fichiers importants

```
pinterest-clone/
├── app/
│   ├── api/              # Votre backend (API Routes)
│   │   ├── auth/         # Authentification
│   │   ├── pins/         # Gestion des pins
│   │   └── upload/       # Upload d'images
│   ├── page.tsx          # Page d'accueil (grille de pins)
│   ├── create/           # Page de création de pin
│   └── login/            # Page de connexion
├── components/
│   ├── MasonryGrid.tsx   # Grille responsive (ta spécialité !)
│   ├── PinCard.tsx       # Affichage d'un pin
│   └── Navbar.tsx        # Barre de navigation
├── prisma/
│   └── schema.prisma     # Schéma de la base de données
└── .env                  # Configuration (à créer)
```

---

## Commandes utiles

```bash
# Développement
npm run dev              # Lancer le serveur de dev

# Base de données
npm run db:push          # Mettre à jour le schéma DB
npm run db:studio        # Ouvrir l'interface Prisma Studio

# Production
npm run build            # Build pour la production
npm run start            # Lancer en production
```

---

## Problèmes courants

### ❌ Erreur de connexion à la base de données

**Solution :**
1. Vérifiez que MySQL/MariaDB est lancé
2. Vérifiez votre `DATABASE_URL` dans `.env`
3. Testez la connexion : `mysql -u root -p`

### ❌ Images ne s'affichent pas

**Solution :**
1. Vérifiez que le dossier `public/uploads` existe
2. Vérifiez les permissions : `chmod 755 public/uploads`

### ❌ Erreur NextAuth (Session)

**Solution :**
1. Vérifiez que `NEXTAUTH_SECRET` est défini dans `.env`
2. Générez un nouveau secret si besoin : `openssl rand -base64 32`

---

## Fonctionnalités disponibles

✅ **Authentification** - Inscription, connexion, déconnexion  
✅ **Pins** - Créer, afficher, rechercher  
✅ **Upload** - Images en local  
✅ **Grille Masonry** - Responsive (2-5 colonnes)  
✅ **Likes** - Système de likes sur les pins  
✅ **Recherche** - Chercher par titre/description  
✅ **Tableaux** - Créer des collections de pins  

---

## Prochaines améliorations

Voici ce que tu peux ajouter pour améliorer ton clone :

### Facile
- [ ] Ajouter des tags aux pins
- [ ] Page de détail d'un pin
- [ ] Améliorer le design mobile

### Moyen
- [ ] Système de commentaires
- [ ] Épingler un pin dans un tableau
- [ ] Profil utilisateur complet
- [ ] Pagination des pins

### Avancé
- [ ] Système de suivi d'utilisateurs
- [ ] Feed personnalisé basé sur les intérêts
- [ ] Notifications en temps réel
- [ ] Upload sur Cloudinary/AWS S3
- [ ] Optimisation des images avec Sharp

---

## Besoin d'aide ?

1. **Documentation Next.js** : https://nextjs.org/docs
2. **Documentation Prisma** : https://www.prisma.io/docs
3. **Documentation NextAuth** : https://next-auth.js.org

Bon développement ! 🎨✨
