#!/bin/bash

echo "🚀 Installation de Pinterest Clone..."
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installez Node.js 18+ et réessayez."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Vérifier si MySQL est accessible
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL n'est pas détecté. Assurez-vous que MySQL/MariaDB est installé et en cours d'exécution."
fi

echo "📦 Installation des dépendances..."
npm install

echo ""
echo "📝 Configuration de l'environnement..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Fichier .env créé. N'oubliez pas de le configurer avec vos informations !"
    echo ""
    echo "Vous devez modifier .env avec :"
    echo "  - Votre URL de base de données MySQL"
    echo "  - Un secret NextAuth (générez-le avec: openssl rand -base64 32)"
    echo ""
else
    echo "ℹ️  Le fichier .env existe déjà"
fi

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "Prochaines étapes :"
echo "1. Configurez votre fichier .env"
echo "2. Créez votre base de données MySQL : CREATE DATABASE pinterest_clone;"
echo "3. Lancez : npm run db:push"
echo "4. Démarrez le serveur : npm run dev"
echo ""
