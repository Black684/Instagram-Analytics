async function test() {
    const response = await fetch(
        'http://localhost:3000/api/reels',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: 'https://www.instagram.com/reels/DaILcZ4oqi7/'
            })
        }
    );

    const data = await response.json();

    console.log('Status:', response.status);
    console.dir(data, { depth: null });
}

test();