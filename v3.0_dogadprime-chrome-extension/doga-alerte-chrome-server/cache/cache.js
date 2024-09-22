import NodeCache from 'node-cache';

export const twitchCache = new NodeCache({
    stdTTL: 30
})

export const youtubeCache = new NodeCache({
    stdTTL: 930
})