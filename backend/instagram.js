require('dotenv').config();

const API_URL = 'https://api.scrapecreators.com/v1/instagram/post';

async function getInstagramReel(instagramUrl) {
    const response = await fetch(
        `${API_URL}?url=${encodeURIComponent(instagramUrl)}`,
        {
            headers: {
                'x-api-key': process.env.SCRAPECREATORS_API_KEY,
            },
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Instagram API error');
    }

    const media = data.data.xdt_shortcode_media;

    return {
        instagramId: media.id,
        shortcode: media.shortcode,

        username: media.owner.username,
        name: media.owner.full_name,
        avatar: media.owner.profile_pic_url,

        caption:
            media.edge_media_to_caption?.edges?.[0]?.node?.text || '',

        thumbnail: media.thumbnail_src,

        views: media.video_play_count || 0,
        likes: media.edge_media_preview_like?.count || 0,
        comments: media.comment_count || 0,

        duration: media.video_duration || 0,

        publishedAt: new Date(
            media.taken_at_timestamp * 1000
        ),
    };
}

module.exports = { getInstagramReel };