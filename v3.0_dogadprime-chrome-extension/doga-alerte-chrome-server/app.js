import express from 'express';
import cors from 'cors';
import twitchRoutes from './routes/twitchRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';

const app = express();
const port = 3000;

app.use(cors({
    origin: '*', // Permet toutes les origines
    methods: 'GET,POST,PUT,DELETE', // Méthodes HTTP autorisées
    allowedHeaders: 'Content-Type,Authorization' // En-têtes autorisés
}));


app.use('/api', [twitchRoutes, youtubeRoutes]);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})