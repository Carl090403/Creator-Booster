

Ce dépôt héberge le code source d'une plateforme SaaS complète de production industrielle, combinant l'automatisation de contenu propulsée par l'IA et une plateforme dynamique de gestion de carrière. Conçue selon une approche de développement moderne, l'application repose sur une architecture Full-Stack découplée, Serverless et hautement scalable, optimisée pour le web mobile et l'international.

🛠️ Analyse Approfondie de l'Architecture Logicielle
L'application est structurée en couches distinctes afin de maximiser la séparation des préoccupations (Separation of Concerns) et de garantir une maintenance isolée du frontend et du backend.

1. Présentation & Expérience Utilisateur (Client-Side)
Framework & Outillage : Écosystème React propulsé par Vite.

Gestion de l'État Global (State Management) : Architecture centralisée avec Zustand. Il orchestre les sessions utilisateurs (user), la synchronisation asynchrone des crédits et la mise à cache locale de l'historique de l'UI.

Système de Design Responsif : Interface développée en Mobile-First avec Tailwind CSS et les primitives accessibles de Shadcn UI. L'application propose une expérience immersive en mode sombre (Dark Mode), des tableaux de bord adaptatifs et un système de navigation fluide (Sidebar) pensé pour les créateurs nomades.

Micro-Interactions Vectorielles : Utilisation de Framer Motion (motion/react) pour gérer l'affichage dynamique des résultats via des animations physiques et des cycles de vie d'éléments rigoureux (AnimatePresence).

2. Couche API & Orchestration Serverless (Backend-Side)
Architecture Serverless (FaaS) : Le backend est entièrement propulsé par les Serverless Functions de Vercel (Node.js). L'application s'affranchit de la gestion de serveurs physiques ou de conteneurs monolithiques : chaque point de terminaison d'API (comme /api/generate) s'exécute à la demande de manière isolée, garantissant une scalabilité automatique face aux pics de charge.

Orchestration LLM & Génération Structurée : Communication avancée avec les modèles de langage d'OpenAI. L'intelligence du backend réside dans la conception de couches de prompts (Prompt Engineering) strictes :

Pour les Hooks Viraux et Scripts Vidéo, l'API applique des structures de validation qui forcent le LLM à répondre sous la forme d'un objet JSON typé (découpé en sections avec minutage et notes visuelles).

Pour le Calendrier 30 Jours, le système bascule sur un flux textuel brut linéaire optimisé pour la lisibilité de masse.

3. Persistance des Données & Gestion Décentralisée (BaaS)
Infrastructure Cloud : Firebase Ecosystem.

Firebase Authentication : Gestion sécurisée des cycles de vie des sessions (OAuth et chiffrement des identifiants par mot de passe).

Cloud Firestore : Base de données NoSQL distribuée globalement. Elle stocke les profils utilisateurs, les configurations métiers (comme le système hybride Custom Niche Mode permettant d'outrepasser les niches statiques pour taper du texte libre) et l'historique complet des générations permettant la fonctionnalité "Revoir" du Dashboard sans surcoût d'appel LLM.

4. Fintech, Monétisation & Accessibilité Mondiale
Système de Tokenomics Restrictif : Intégration d'un Paywall logiciel strict géré par un service de validation croisé client/serveur (creditService). Chaque outil consomme un montant algorithmique de jetons précis, bloquant instantanément l'accès via une modale d'interception en cas de solde nul.

Passerelle de Paiement Universelle (Chariow & Moneroo) : Pour contourner les restrictions géographiques des processeurs traditionnels comme Stripe, le système intègre des passerelles de paiement alternatives comme Chariow et Moneroo.

Paiement Global : Cette architecture permet d'accepter les cartes de crédit internationales, les portefeuilles numériques ainsi que les solutions de Mobile Money locales.

Architecture Événementielle (Webhooks) : Le rechargement des soldes de crédits est sécurisé par l'écoute de Webhooks asynchrones qui valident l'intégrité de la transaction avant l'incrémentation en base de données.

5. Algorithmes d'Optimisation & d'Export Spécifiques
Moteur d'Export Vectoriel Anti-Crash : Remplacement des moteurs de capture d'écran graphiques (html2canvas) – qui échouent sur les fonctionnalités CSS modernes de Tailwind (comme les fonctions de couleur oklab() ou oklch()) – par une implémentation logicielle pure via jsPDF.

L'algorithme extrait la chaîne textuelle brute, calcule de manière dynamique les retours à la ligne selon la grille standard d'une page A4 (largeur maximale de 180mm), gère la pagination et l'interlignage à la volée. Le PDF généré est ultra-léger, vectoriel, prêt pour l'impression (texte noir sur fond blanc économique) et permet la sélection de texte par l'utilisateur final.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
