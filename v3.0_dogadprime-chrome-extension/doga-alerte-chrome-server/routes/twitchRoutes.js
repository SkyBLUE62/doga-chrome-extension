// routes/twitchRoutes.js
import express from 'express';

import { fetchTwitchData, getTitle, getUsername, isOnline } from '../functions/twitch.js';

const router = express.Router();

// Route pour obtenir les données Twitch
router.get('/twitch-data', async (req, res) => {
    try {
        const data = await fetchTwitchData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données Twitch' });
    }
});


router.get('/twitch-title', async (req, res) => {
    try {
        const data = await getTitle();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création des données' });
    }
})

router.get('/twitch-username', async (req, res) => {
    try {
        const data = await getUsername();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création des données' });
    }
})

router.get('/twitch-online', async (req, res) => {
    try {
        const data = await isOnline();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création des données' });
    }
})


export default router;
