// URL de ton serveur WebSocket (modifie si nécessaire)
const socketUrl = "ws://localhost:3000";

// Initialisation de la connexion WebSocket
const reconnectInterval = 5000;

console.log("Lancement de l'extension Chrome");

if (typeof browser === "undefined") {
    var browser = chrome;
}
// let lastVideoId = "";

// Fonction pour afficher une notification pour Twitch
function showNotificationTwitch(stream) {
    console.log(stream);
    console.log("Notification pour le stream", stream); // Debug

    browser.notifications.create('twitch-streamer-alert', {
        type: 'basic',
        iconUrl: 'icons/icon48.png', // Modifie l'icône si besoin
        title: `${stream.user_name} est en live !`,
        message: `Regardez maintenant sur Twitch : ${stream.title}`,
        priority: 2
    });
}

function showNotificationYoutube(video) {
    console.log(video);
    console.log("Notification pour le stream", video); // Debug

    browser.notifications.create('new-video-alert', {
        type: 'basic',
        iconUrl: video.snippet.thumbnails.high.url, // Modifie l'icône si besoin
        title: `Nouvelle vidéo sur la chaine Youtube`,
        message: `${video.snippet.title}`,
        priority: 2
    })

}


// Gestion du clic sur la notification
browser.notifications.onClicked.addListener(function (notificationId) {
    if (notificationId === 'twitch-streamer-alert') {
        const twitchChannelUrl = 'https://www.twitch.tv/dogadprime';
        console.log('Ouverture de l\'URL Twitch:', twitchChannelUrl);
        browser.tabs.create({ url: twitchChannelUrl });
    }

    if (notificationId === 'new-video-alert') {

        (async () => {
            const youtubeChannelUrl = 'https://www.youtube.com/watch?v=';
            const storage = await browser.storage.local.get('lastVideoId').then((storage) => {
                return storage
            });
            console.log(storage.lastVideoId);
            const url = youtubeChannelUrl + storage.lastVideoId;
            console.log(url);
            browser.tabs.create({ url: url });
        })()



    }

});

function connectWebSocket() {
    console.log("Tentative de connexion WebSocket...");
    const ws = new WebSocket(socketUrl);

    // Événement lorsque la connexion WebSocket est ouverte
    ws.onopen = function () {
        console.log('Connexion WebSocket établie');
        ws.send(JSON.stringify({ checkStatus: 'checkStatus' }));
        ws.send(JSON.stringify({ checkStatus: 'checkLastVideo' }));
    };

    // Événement lorsqu'un message est reçu via WebSocket
    ws.onmessage = function (event) {
        console.log("Message reçu:", event.data); // Affiche le message reçu pour debug

        try {
            const parsedData = JSON.parse(event.data);
            console.log("Données parsées:", parsedData); // Debug

            const { platform, status } = parsedData;


            if (platform === 'twitch' && status === true) {
                const { streamData } = parsedData;
                console.log('Le streamer est en direct !');
                console.log('Détails du stream:', streamData);
                showNotificationTwitch(streamData);

            } else if (platform === 'youtube' && status === true) {
                (async () => {
                    const { videoData, last10VideoData } = parsedData;
                    console.log(videoData);
                    console.log(last10VideoData);

                    const videoId = videoData?.id?.videoId;

                    const storage = await browser.storage.local.get('lastVideoId').then((storage) => {
                        return storage
                    }) ?? { lastVideoId: "8a6c9310-d0d5-4c45-ae8d-1b626ace0121" }
                    console.log(videoId);
                    if (videoId !== storage?.lastVideoId && videoId != null && videoId !== undefined) {
                        await browser.storage.local.set({ lastVideoId: videoId }).then(() => {
                            console.log('videoId sauvegardé');
                        });

                        showNotificationYoutube(videoData)
                        console.log("Nouvelle video");
                    }


                })();
            }
        } catch (e) {
            console.error('Erreur lors du parsing des données:', e);
        }
    };

    // Événement lorsque la connexion WebSocket rencontre une erreur
    ws.onerror = function (error) {
        console.error('Erreur WebSocket:', error);
    };

    // Événement lorsque la connexion WebSocket est fermée
    ws.onclose = function () {
        console.log('Connexion WebSocket fermée, tentative de reconnexion dans 5 secondes...');
        setTimeout(connectWebSocket, reconnectInterval); // Tentative de reconnexion après 5 secondes
    };
}


connectWebSocket();