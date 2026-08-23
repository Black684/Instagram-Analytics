const { getInstagramReel } = require('./instagram');
const saveInstagramReel = require('./instagramService');

const instagramUrl =
    'https://www.instagram.com/reels/DaILcZ4oqi7/';

async function test() {
    try {
        console.log('Получаем данные из Instagram...');

        const reel = await getInstagramReel(instagramUrl);

        console.log('Данные получены:');
        console.dir(reel, { depth: null });

        console.log('\nСохраняем в PostgreSQL...');

        const result = await saveInstagramReel(
            reel,
            instagramUrl
        );

        console.log('\nРезультат:');
        console.log(result);

    } catch (error) {
        console.error('\nError:', error.message);
    }
}

test();