const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clientId = process.env.TWITCH_CLIENT_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;
const idYoutube = process.env.YOUTUBE_CHANNEL_ID;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

const streamerName = 'pooksc2';
const twitchApiUrl = `https://api.twitch.tv/helix/streams?user_login=${streamerName}`;
const lastVideoYoutubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&channelId=${idYoutube}&part=snippet,id&order=date&maxResults=10&type=video`

let isStreamerOnline = false;
let streamerDataCurrent = null;

let lastVideoUploadId = ""
let last10VideoData = ""
let lastVideoData = ""

async function checkStreamerLive() {
    try {
        const response = await fetch(twitchApiUrl, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        const currentlyOnline = data.data && data.data.length > 0;
        console.log("trigger");
        if (currentlyOnline && !isStreamerOnline) {
            broadcast({
                platform: 'twitch',
                status: true,
                streamData: data.data[0]
            });
            isStreamerOnline = currentlyOnline;
            streamerDataCurrent = {
                platform: 'twitch',
                status: true,
                streamData: data.data[0]
            };
            console.log("StreamerDataCurrent: ", streamerDataCurrent);
            console.log("Le streamer est en direct. Notification envoyée.");
        } else if (currentlyOnline == false) {
            isStreamerOnline = false;
            streamerDataCurrent = null;
            console.log("Le streamer n'est pas en direct. Notification envoyée.");
        }

    } catch (error) {
        console.error('Erreur lors de la vérification du statut du streamer :', error);
    }
}


async function checkLastVideoYoutube() {
    console.log("start checkLastVideoYoutube");

    try {

        const response = await fetch(lastVideoYoutubeUrl);
        const data = await response.json();
        console.log("videoytb: ", data);
        const videoId = data.items[0].id.videoId;

        console.log(videoId);

        if (videoId != lastVideoUploadId) {
            lastVideoUploadId = videoId;
            last10VideoData = data.items
            lastVideoData = data.items[0]
            broadcast({
                platform: 'youtube',
                status: true,
                videoData: data.items[0],
                last10VideoData: last10VideoData
            });
        }

    } catch (error) {
        console.log("Error: ", error);

    }


}

wss.on('connection', (ws) => {
    console.log('Un client est connecté');

    ws.send(JSON.stringify({ message: 'Bienvenue sur le serveur WebSocket' }));

    ws.on('message', (message) => {

        try {
            const data = JSON.parse(message);
            const { checkStatus } = data
            if (checkStatus == "checkStatus") {

                console.log(streamerDataCurrent);
                ws.send(JSON.stringify({
                    type: 'statusUpdate',
                    platform: 'twitch',
                    status: isStreamerOnline,
                    streamData: isStreamerOnline ? streamerDataCurrent["streamData"] : null
                }));
            }

            if (checkStatus == "checkLastVideo") {
                console.log("trigger");
                ws.send(JSON.stringify({
                    type: 'statusUpdate',
                    platform: 'youtube',
                    status: true,
                    videoData: lastVideoData,
                    last10VideoData: last10VideoData
                }));
            }

        } catch (error) {
            console.error('Erreur lors du traitement du message:', error);

        }
        console.log('Message reçu :', message);
    });

    ws.on('close', () => {
        console.log('Un client s\'est déconnecté');
    });
});

server.listen(3000, () => {
    console.log('Serveur en écoute sur le port 3000');
});

function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

setInterval(checkStreamerLive, 1 * 60 * 1000);
setInterval(checkLastVideoYoutube, 60 * 60 * 1000);