import express from 'express';
const router = express.Router();


import { fetchYoutubeData, getTitleLastVideo, getImageLastVideo, getIdLastVideo, get10Videos } from '../functions/youtube.js';


router.get('/youtube-data', async (req, res) => {

    try {
        const data = await fetchYoutubeData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données Youtube' });
    }

})

router.get('/youtube-last-title', async (req, res) => {

    try {
        const data = await getTitleLastVideo();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données Youtube' });
    }

})

router.get('/youtube-last-image', async (req, res) => {

    try {
        const data = await getImageLastVideo();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données Youtube' });
    }

})

router.get('/youtube-last-id', async (req, res) => {

    try {
        const data = await getIdLastVideo();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données Youtube' });
    }

})

router.get('/youtube-10-videos', async (req, res) => {

    try {
        const data = await get10Videos();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données Youtube' });
    }

})
export default router
