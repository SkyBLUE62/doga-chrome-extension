// simulateExtension.js
const io = require('socket.io-client');

// URL de ton serveur WebSocket
const socketUrl = 'http://localhost:3000';

// Connexion au serveur WebSocket
const socket = io(socketUrl);

// Événement lorsque le serveur envoie un message de bienvenue
socket.on('welcome', (data) => {
    console.log('Message de bienvenue du serveur :', data.message);
});

// Événement lorsque le serveur envoie une mise à jour du statut du streamer
socket.on('platformNotification', (data) => {
    console.log(data);
    const { platform, status, streamData } = data;
    if (platform == 'twitch' && status == true) {
        console.log('Le streamer est en direct !');
        console.log('Détails du stream :', data.streamData);
    } else {
        console.log('Le streamer n\'est pas en direct.');
    }

});

// Gestion des erreurs de connexion
socket.on('connect_error', (error) => {
    console.error('Erreur de connexion :', error);
});
