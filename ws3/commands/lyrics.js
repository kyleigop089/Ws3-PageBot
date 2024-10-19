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

      // Trim lyrics if they exceed 2000 characters
      const maxLyricsLength = 2000;
      let trimmedLyrics = lyrics;
      if (lyrics.length > maxLyricsLength) {
        trimmedLyrics = lyrics.substring(0, maxLyricsLength) + "...";
      }

      // Send the image first (if available)
      if (song_thumbnail) {
        await send({
          attachment: {
            type: "image",
            payload: {
              url: song_thumbnail
            }
          }
        });
      }

      // Then send the lyrics
      const lyricsMessage = `🎵 *${title}* by *${artist}*\n\n${trimmedLyrics}\n\n🔗 Read more: ${url}`;
      await send(lyricsMessage);

    } catch (error) {
      send("Error retrieving lyrics. Please try again or check your input.\n" + (error.message || error));
    }
  }
};
