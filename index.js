const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    getProfile: async function (username) {
        const scrapedPage = await axios.get(`https://www.picuki.com/profile/${username}`);
        const $ = cheerio.load(scrapedPage.data);
        let fullname = $('h1.profile-name-bottom').text();
        let avatar = decodeURIComponent($('.profile-avatar').children('img').attr('src').replace('/hosted-by-instagram/url=', '')).replace(/\|\|/g, '/').replace('s150x150', 's320x320');
        let followers = $('span.followed_by').text().replace(/,/g,'.');
        let following = $('span.follows').text().replace(/,/g,'.');
        let postCount = $('span.total_posts').text();
        let recentPost = {
            image: decodeURIComponent($('img.post-image').attr('src').replace('/hosted-by-instagram/url=', '')).replace(/\|\|/g, '/'),
            caption: $('img.post-image').attr('alt')
        }
        return {
            username,
            fullname,
            avatar,
            followers,
            following,
            postCount,
            recentPost
        };
    }
}