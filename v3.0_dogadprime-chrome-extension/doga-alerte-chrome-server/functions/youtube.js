import dotenv from 'dotenv';
dotenv.config();
import { youtubeCache } from '../cache/cache.js';
import fetch from 'node-fetch';


const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const idYoutube = process.env.YOUTUBE_CHANNEL_ID;
const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&channelId=${idYoutube}&part=snippet,id&order=date&maxResults=10&type=video`


export const fetchYoutubeData = async () => {

    const youtubeLastVideo = youtubeCache.get("youtubeLastVideo");
    const youtube10Videos = youtubeCache.get("youtube10Videos");
    console.log(youtubeLastVideo);

    if (youtubeLastVideo !== undefined && youtube10Videos !== undefined) {

        console.log('Données depuis le cache');
        return { youtubeLastVideo, youtube10Videos };
    }

    try {
        const response = await fetch(youtubeApiUrl)
        const data = await response.json();

        youtubeCache.set("youtubeLastVideo", data.items[0]);
        youtubeCache.set("youtube10Videos", data.items);
        console.log("Données depuis l'api");
        return {
            youtubeLastVideo: data.items[0],
        }

    } catch (error) {
        console.error('Erreur lors de la création des données:', error);
        return error;
    }


}

export const getTitleLastVideo = async () => {
    const youtubeLastVideo = youtubeCache.get("youtubeLastVideo");

    if (youtubeLastVideo !== undefined || youtubeLastVideo !== null) {

        return youtubeLastVideo.snippet.title;
    }

    return null
}

export const getImageLastVideo = async () => {
    const youtubeLastVideo = youtubeCache.get("youtubeLastVideo");

    if (youtubeLastVideo !== undefined || youtubeLastVideo !== null) {

        return youtubeLastVideo.snippet.thumbnails.high.url;
    }

    return null
}

export const getIdLastVideo = async () => {
    const youtubeLastVideo = youtubeCache.get("youtubeLastVideo");

    if (youtubeLastVideo !== undefined || youtubeLastVideo !== null) {

        return youtubeLastVideo.id.videoId;
    }

    return null
}

export const get10Videos = async () => {

    const youtube10Videos = youtubeCache.get("youtube10Videos");

    if (youtube10Videos !== undefined || youtube10Videos !== null) {
        return youtube10Videos;
    }

    return null
}