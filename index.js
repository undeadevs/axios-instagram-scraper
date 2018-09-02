const Axios = require('axios');
const formatNumbers = require(`./formatNumbers`);

module.exports = {
    getProfile: async function (user){
        const userInfoSource = await Axios.get(`https://www.instagram.com/${user}/`);
          
        // userInfoSource.data contains the HTML from Axios
        const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1);
             
        const userInfo = JSON.parse(jsonObject);
             
        const uInfo = userInfo.entry_data.ProfilePage[0].graphql.user;
        const username = userInfo.entry_data.ProfilePage[0].graphql.user.username;
        const pfp = userInfo.entry_data.ProfilePage[0].graphql.user.profile_pic_url_hd;
        const fullname = userInfo.entry_data.ProfilePage[0].graphql.user.full_name;
        const followers = formatNumbers(userInfo.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count, `0`, `.`, `,`);
        const following = formatNumbers(userInfo.entry_data.ProfilePage[0].graphql.user.edge_follow.count, `0`, `.`, `,`);
        const post = formatNumbers(userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.count, `0`, `.`, `,`);
   
        const postimage = [];
        const postcaption = [];
        const npost = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(0,1);
        for (let media of npost) {
            const node = media.node
                   
            // Process only if is an image
            if ((node.__typename && node.__typename !== 'GraphImage')) {
                continue
            }
       
            // Push the thumbnail src in the array
            await postimage.push(node.display_url);
   
            const capt = node.edge_media_to_caption.edges[0];
   
            for (let media of [capt]) {
                const node = media.node
   
                await postcaption.push(node.text);
            }
        }
        var info = {
            username: username,
            full_name: fullname,
            profile_picture: pfp,
            followers: followers,
            following: following,
            post_count: post,
            recent_post: {
                image: postimage,
                caption: postcaption
            }
        }
        return info;
} 
}