let streamerName = "dogadprime";

async function checkStreamerLive() {
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = 'kvz6tk6vcknv9fqggojqx2ih91r6fm';
    const url = `https://api.twitch.tv/helix/streams?user_login=${streamerName}`;

    console.log('Vérification du statut du streamer:', streamerName);

    try {
        const response = await fetch(url, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('Réponse de l\'API Twitch reçue:', response);

        const data = await response.json();
        console.log('Données de l\'API Twitch:', data);

        if (data.data && data.data.length > 0) {
            const stream = data.data[0];
            console.log(`${stream.user_name} est en live avec le titre: ${stream.title}`);

            chrome.storage.local.get(['streamerOnline'], function (result) {
                console.log('Statut précédent du streamer (streamerOnline):', result.streamerOnline);

                if (result.streamerOnline !== true) {
                    console.log('Le streamer n\'était pas en live, affichage de la notification');
                    showNotification(stream);

                    chrome.storage.local.set({ streamerOnline: true }, function () {
                        console.log('Statut du streamer mis à jour en "live".');
                    });
                } else {
                    console.log('Le streamer est déjà signalé en live, aucune nouvelle notification.');
                }
            });
        } else {
            console.log('Le streamer n\'est pas en live.');
            chrome.storage.local.set({ streamerOnline: false }, function () {
                console.log('Statut du streamer mis à jour en "hors-ligne".');
            });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du statut du streamer :', error);
    }
}

function showNotification(stream) {
    console.log('Affichage de la notification pour:', stream.user_name);

    chrome.notifications.create('twitch-streamer-alert', {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: `${stream.user_name} est en live !`,
        message: `Regardez maintenant sur Twitch : ${stream.title}`,
        priority: 2
    }, function (notificationId) {
        console.log('Notification créée avec l\'ID:', notificationId);
    });
}

chrome.notifications.onClicked.addListener(function (notificationId) {
    console.log('Notification cliquée avec l\'ID:', notificationId);
    if (notificationId === 'twitch-streamer-alert') {
        const twitchChannelUrl = 'https://www.twitch.tv/dogadprime';
        console.log('Ouverture de l\'URL Twitch:', twitchChannelUrl);
        chrome.tabs.create({ url: twitchChannelUrl });
    }
});

chrome.alarms.create('checkStream', { periodInMinutes: 1 });
console.log('Alarme créée pour vérifier le statut du streamer toutes les 1 minute.');

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkStream') {
        console.log('Alarme déclenchée, vérification du statut du streamer...');
        checkStreamerLive();
    }
});

chrome.storage.local.get(['streamerOnline'], function (result) {
    if (result.streamerOnline === undefined) {
        console.log('Statut du streamer non défini, initialisation à false.');
        chrome.storage.local.set({ streamerOnline: false });
    }
});
