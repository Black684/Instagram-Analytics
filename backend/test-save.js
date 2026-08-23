require('dotenv').config();

const saveInstagramReel = require('./instagramService');

const instagramData = {
    instagramId: '3929441005331458235',
    shortcode: 'DaILcZ4oqi7',
    username: 'tezeze_art',
    name: 'Tezeze',
    avatar: 'https://example.com/avatar.jpg',
    caption: 'Letsgooo #animation #originalstory #originalcharacter #oc #originalseries',
    thumbnail: 'https://example.com/thumbnail.jpg',
    views: 427522,
    likes: 44268,
    comments: 171,
    duration: 10.842,
    publishedAt: '2026-06-28T11:25:37.000Z'
};

const instagramUrl = 'https://www.instagram.com/reels/DaILcZ4oqi7/';

async function test() {
    try {
        const result = await saveInstagramReel(
            instagramData,
            instagramUrl
        );

        console.log(result);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

test();