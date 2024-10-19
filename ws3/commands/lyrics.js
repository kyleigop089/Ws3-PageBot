const axios = require("axios");
const name = "lyrics";

module.exports = {
  name,
  description: "Get song lyrics by title",
  async run({ api, send, args }) {
    const songTitle = args.join(" ");
    
    if (!songTitle) return send(`Usage: ${api.prefix + name} [song title]`);

    try {
      const res = await axios.get(`https://markdevs69v2-679r.onrender.com/api/lyrics/song`, {
        params: { title: songTitle }
      });

      if (!res || !res.data || !res.data.content) throw new Error("No lyrics found for this song.");

      const { title, artist, lyrics, url, song_thumbnail } = res.data.content;

      send({
        body: `🎵 *${title}* by *${artist}*\n\n${lyrics}\n\n🔗 Read more: ${url}`,
        attachment: {
          type: "image",
          payload: {
            url: song_thumbnail
          }
        }
      });

    } catch (error) {
      send("Error retrieving lyrics. Please try again or check your input.\n" + (error.message || error));
    }
  }
};
