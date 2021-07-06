import fetch from 'node-fetch';
import { SLUGS_PAGE } from './config.js';

export const extractSlugs = async () => {
    const slugPattern = /slugifiedKey:"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    const collectionsSite = await fetch(SLUGS_PAGE).then(r=> r.text());
    const found = collectionsSite.matchAll(slugPattern);
    const slugs = [];
    for (const match of found) {
        slugs.push(match[1])
        console.debug(`Matched slug = ${match[1]}`)
    }
    console.debug(`Found ${slugs.length} slugs`)
    return slugs;
} 

