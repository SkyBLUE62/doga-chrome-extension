// background.js


if (typeof browser === "undefined") {
    var browser = chrome;
}
const API_URL_TWITCH = 'YOUR_API_URL';
const API_URL_YOUTUBE = 'YOUR_API_URL';

browser.runtime.onInstalled.addListener(function () {
    browser.storage.local.set({ isOnline: false });
    browser.storage.local.set({ startedAt: false });
    browser.storage.local.set({ idVideoLast: false });
    browser.storage.local.set({ twitchNotification: true });
    browser.storage.local.set({ youtubeNotification: true });
});


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message reçu dans le background :", request);
    if (request.type === "GET_STORAGE") {
        browser.storage.local.get(["twitchNotification", "youtubeNotification"], (result) => {
            console.log("Données récupérées du storage :", result);
            sendResponse(result);
        });
        return true; // Pour les réponses asynchrones
    } else if (request.type === "SET_STORAGE") {
        browser.storage.local.get([request.data.key], (result) => {
            const newValue = !result[request.data.key]; // Inverse la valeur actuelle
            browser.storage.local.set({ [request.data.key]: newValue }, () => {
                console.log("Valeur mise à jour :", newValue);
                sendResponse({ success: true, newValue });
            });
        });
        return true; // Pour les réponses asynchrones

    } else if (request.type === "IS_ONLINE") {
        browser.storage.local.get(["isOnline"], (result) => {
            console.log(result);
            sendResponse(result)
        });
        return true; // Pour les réponses asynchrones
    }
});


async function getIsOnline() {
    const result = await browser.storage.local.get('isOnline');
    const isOnline = result.isOnline !== undefined ? result.isOnline : false;
    return isOnline;
}

async function getStartedAt() {
    const result = await browser.storage.local.get('startedAt');
    const startedAt = result.startedAt !== undefined ? result.startedAt : false;
    return startedAt;
}

async function getStorageIdVideoLast() {
    const result = await browser.storage.local.get('idVideoLast');
    const idVideoLast = result.idVideoLast !== undefined ? result.idVideoLast : false;
    return idVideoLast;
}

async function getStorageTwitchNotification() {
    const result = await browser.storage.local.get('twitchNotification');
    const twitchNotification = result.twitchNotification !== undefined ? result.twitchNotification : false;
    return twitchNotification;
}

async function getStorageYoutubeNotification() {
    const result = await browser.storage.local.get('youtubeNotification');
    const youtubeNotification = result.youtubeNotification !== undefined ? result.youtubeNotification : false;
    return youtubeNotification;
}


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

async function isOnlineCheck() {
    try {
        const response = await fetch(API_URL_TWITCH, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        if (data.status == false) {
            await browser.storage.local.set({ twitchData: null });
        }

        const isOnline = await getIsOnline();
        const currentlyOnline = data.id ? true : false;

        const startedAt = data.started_at;
        const startedAtStorage = await getStartedAt();

        if ((currentlyOnline && !isOnline && startedAtStorage != startedAt)
            || (currentlyOnline == true && isOnline == true && startedAtStorage != startedAt)) {
            await browser.storage.local.set({ twitchData: data });
            const notificationTwitch = await getStorageTwitchNotification();
            await chrome.action.setIcon({
                path: {
                    "16": "icons/icon16-on.png",
                }
            });
            if (notificationTwitch) {
                showNotificationTwitch(data);
                console.log("Notification envoyée");
                console.log(data);
                await browser.storage.local.set({ isOnline: true });
                await browser.storage.local.set({ startedAt: startedAt });
            } else {
                console.log("en live mais pas de notification");
                await browser.storage.local.set({ isOnline: true });
                await browser.storage.local.set({ startedAt: startedAt });
            }

        } else if (!currentlyOnline) {
            await chrome.action.setIcon({
                path: {
                    "16": "icons/icon16-offline.png",
                }
            });
            await browser.storage.local.set({ isOnline: false });
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


async function lastVideoCheck() {

    try {

        const response = await fetch(API_URL_YOUTUBE, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const { youtubeLastVideo } = data
        console.log(data);
        const idVideoLast = await getStorageIdVideoLast()
        console.log("idVideoLast", idVideoLast);
        if (youtubeLastVideo) {
            const { id } = youtubeLastVideo
            console.log("id", id.videoId);
            if (!idVideoLast) {
                console.log("aucun idVideoLast");
                await browser.storage.local.set({ idVideoLast: id.videoId });
                return;
            }
            if (idVideoLast != id.videoId) {
                const notificationYoutube = await getStorageYoutubeNotification();
                console.log("notificationYoutube", notificationYoutube);
                await browser.storage.local.set({ idVideoLast: id.videoId });
                if (notificationYoutube) {
                    console.log("Nouveau vidéo");
                    showNotificationYoutube(youtubeLastVideo);
                }
            }

        }


    } catch (error) {
        console.error('Error fetching data:', error);
    }


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
            const videoId = await getStorageIdVideoLast()
            const url = youtubeChannelUrl + videoId;
            browser.tabs.create({ url: url });
        })()

    }

});

isOnlineCheck();
setInterval(isOnlineCheck, 0.15 * 60 * 1000);

lastVideoCheck();
setInterval(lastVideoCheck, 1 * 60 * 1000);
