const axios = require("axios");
const name = "spotify";

module.exports = {
  name,
  description: "Search for a Spotify track using a keyword",
  async run({ api, send, args }) {
    const searchQuery = args.join(" ");
    
    if (!searchQuery) return send(`Usage: ${api.prefix + name} [music title]`);

    try {
      const res = await axios.get('https://hiroshi-api.onrender.com/tiktok/spotify', {
        params: { search: searchQuery }
      });

      if (!res || !res.data || res.data.length === 0) throw new Error("No results found");

      const { name, track, download, image } = res.data[0];

      send({
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: name,
                image_url: image,
                subtitle: `Track: ${name}`,
                buttons: [
                  {
                    type: "web_url",
                    url: track,
                    title: "Listen on Spotify"
                  },
                  {
                    type: "web_url",
                    url: download,
                    title: "Download MP3"
                  }
                ]
              }
            ]
          }
        }
      });

    } catch (error) {
      send("Error retrieving the Spotify track. Please try again or check your input.\n" + (error.message || error));
    }
  }
};
