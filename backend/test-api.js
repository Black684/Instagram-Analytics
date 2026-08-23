require('dotenv').config();

const url = 'https://api.scrapecreators.com/v1/instagram/post';
const instagramUrl = 'https://www.instagram.com/reels/DaILcZ4oqi7/';

async function test() {
    const response = await fetch(
        `${url}?url=${encodeURIComponent(instagramUrl)}`,
        {
            headers: {
                'x-api-key': process.env.SCRAPECREATORS_API_KEY,
            },
        }
    );

    console.log('Status:', response.status);

    const data = await response.json();

    console.dir(data, { depth: null });
}

test();