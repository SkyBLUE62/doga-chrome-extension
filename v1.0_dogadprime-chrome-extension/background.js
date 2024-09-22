let streamerName = "dogadprime";


async function checkStreamerLive() {
    const clientId = 'YOUR_CLIENT_ID';
    const accessToken = 'YOUR_ACCESS_TOKEN';
    const url = `https://api.twitch.tv/helix/streams?user_login=${streamerName}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });


        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const stream = data.data[0];


            chrome.storage.local.get(['streamerOnline'], function (result) {

                if (result.streamerOnline !== true) {

                    showNotification(stream);

                    chrome.storage.local.set({ streamerOnline: true });
                }
            });
        } else {

            chrome.storage.local.set({ streamerOnline: false });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du statut du streamer :', error);
    }
}

function showNotification(stream) {
    chrome.notifications.create('twitch-streamer-alert', {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: `${stream.user_name} est en live !`,
        message: `Regardez maintenant sur Twitch : ${stream.title}`,
        priority: 2
    });
}

chrome.alarms.create('checkStream', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkStream') {
        checkStreamerLive();
    }
});

chrome.storage.local.get(['streamerOnline'], function (result) {
    if (result.streamerOnline === undefined) {
        chrome.storage.local.set({ streamerOnline: false });
    }
});
