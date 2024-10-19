const axios = require("axios");
const name = "lyrics";

module.exports = {
  name,
  description: "Get song lyrics by title",
  async run({ api, sendMessage, event, args }) {
    const songTitle = args.join(" ");

    if (!songTitle) return sendMessage(`Usage: ${api.prefix + name} [song title]`, event.threadID);

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

      // Send song title, artist, lyrics, and link
      sendMessage(
        `🎵 *${title}* by *${artist}*\n\n${trimmedLyrics}\n\n🔗 Read more: ${url}`,
        event.threadID
      );

      // Send song thumbnail as an image attachment
      sendMessage(
        {
          attachment: {
            type: "image",
            payload: { url: song_thumbnail }
          }
        },
        event.threadID
      );

    } catch (error) {
      sendMessage(
        "Error retrieving lyrics. Please try again or check your input.\n" + (error.message || error),
        event.threadID
      );
    }
  }
};
