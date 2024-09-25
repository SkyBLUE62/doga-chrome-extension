import dotenv from 'dotenv';
dotenv.config();
import { twitchCache } from '../cache/cache.js';
import fetch from 'node-fetch';

const streamerName = 'dogadprime';

const clientId = process.env.TWITCH_CLIENT_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;
const twitchApiUrl = `https://api.twitch.tv/helix/streams?user_login=${streamerName}`;
let isStreamerOnline = false;

export const fetchTwitchData = async () => {

    const cachedData = await twitchCache.get("streamerDataCurrent");
    console.log("cache: " + cachedData);
    if (cachedData !== undefined) {
        console.log("trigger cache data");
        return cachedData;
    }

    try {
        const response = await fetch(twitchApiUrl, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("trigger API");
        const currentlyOnline = data.data && data.data.length > 0;
        twitchCache.set("streamerDataCurrent", data.data[0]);

        if (currentlyOnline && !isStreamerOnline) {
            console.log("trigger isOnline");
            console.log("data cached: " + twitchCache.get("streamerDataCurrent"));
            isStreamerOnline = true;
            return data.data[0];

        } else if (!currentlyOnline) {

            twitchCache.set("streamerDataCurrent", {
                error: "Streamer pas en ligne",
                status: false
            });
            isStreamerOnline = false;
            return {
                error: "Streamer pas en ligne",
                status: false
            };
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données Twitch:', error);
        return error;
    }
};


export const getTitle = () => {

    const cachedData = twitchCache.get("streamerDataCurrent");

    if (cachedData !== undefined || cachedData !== null) {

        return cachedData.title;
    }

    return null

}

export const getUsername = () => {
    const cachedData = twitchCache.get("streamerDataCurrent");

    if (cachedData !== undefined || cachedData !== null) {

        return cachedData.user_name;
    }

    return null
}

export const isOnline = () => {
    const cachedData = twitchCache.get("streamerDataCurrent");
    if (cachedData !== undefined || cachedData !== null) {
        if (cachedData.user_name) {
            return true
        } else {
            return false
        }

    }
}