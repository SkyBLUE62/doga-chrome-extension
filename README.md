Extension Chrome pour Notifications Twitch
==========================================

Cette extension Chrome envoie des notifications lorsqu'un streamer spécifié est en direct sur Twitch.

Fonctionnalités
---------------

*   Vérifie périodiquement si le streamer est en direct sur Twitch.
    
*   Envoie une notification si le streamer commence un nouveau stream.
    
*   La notification vous permet d'accéder directement à la chaîne Twitch du streamer.
    

Prérequis
---------

*   **Google Chrome** ou un navigateur basé sur Chromium (Brave, Edge, etc.).
    
*   **Compte Twitch** pour utiliser l'API Twitch (Client-ID et Token d'accès).
    

Installation
------------

### Étape 1 : Préparer les Fichiers

Assurez-vous que vous avez les fichiers nécessaires dans un seul dossier. Vous devriez avoir au minimum les fichiers suivants :

*   manifest.json
    
*   background.js
    
*   icons/icon48.png
    

### Étape 2 : Activer le Mode Développeur dans Chrome

1.  Ouvrez Google Chrome.
    
2.  Accédez à chrome://extensions/ dans la barre d'adresse.
    
3.  Activez le **Mode développeur** en haut à droite.
    

### Étape 3 : Charger l'Extension

1.  Cliquez sur **Charger l'extension non empaquetée**.
    
2.  Sélectionnez le dossier contenant les fichiers de l'extension.
    

### Étape 4 : Configuration

1.  **Obtenez vos identifiants Twitch** :
    
    *   Vous aurez besoin d'un Client-ID et d'un Token d'accès pour l'API Twitch.
        
    *   Vous pouvez obtenir ces informations en créant une application sur Twitch Developer Console.
        
2.  **Modifier le Fichier background.js** :
    
    *   Ouvrez background.js.
        
    *   Remplacez les valeurs des variables clientId et accessToken par vos propres identifiants Twitch.
        
3.  **Tester l'Extension** :
    
    *   Assurez-vous que l'extension est activée dans la page chrome://extensions/.
        
    *   La première vérification peut prendre jusqu'à 1 minute (selon l'intervalle configuré).
        

Débogage
--------

*   **Console de Débogage** : Utilisez la console dans les outils de développement de Chrome (Ctrl+Shift+I ou Cmd+Option+I sur Mac) pour afficher les logs de débogage ajoutés dans le code.