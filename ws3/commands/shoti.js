const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { get } = require("https");
const name = "shoti";

module.exports = {
  name,
  description: "Sends a random Shoti video",
  async run({ api, event }) {
    try {
      const res = await axios.get("https://betadash-shoti-yazky.vercel.app/shotizxx", {
        params: { apikey: "shipazu" }
      });

      if (!res || !res.data || !res.data.shotiurl) {
        throw new Error("Invalid response from API");
      }

      const { shotiurl, title, username, nickname, region, duration } = res.data;

      const videoPath = path.join(__dirname, "shoti.mp4");

      const downloadVideo = (url, dest, cb) => {
        const file = fs.createWriteStream(dest);
        get(url, (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close(cb);
          });
        }).on("error", (err) => {
          fs.unlink(dest, () => {});
          cb(err.message);
        });
      };

      downloadVideo(shotiurl, videoPath, async (error) => {
        if (error) {
          return api.sendMessage(`Failed to download video: ${error}`, event.threadID, event.messageID);
        }

        const message = {
          body: `📹 Title: ${title}\n👤 Username: ${username}\n💬 Nickname: ${nickname}\n📍 Region: ${region}\n⏱️ Duration: ${duration} seconds`,
          attachment: fs.createReadStream(videoPath)
        };

        api.sendMessage(message, event.threadID, event.messageID, () => {
          fs.unlink(videoPath, () => {}); // Delete the video file after sending
        });
      });

    } catch (error) {
      api.sendMessage(`Error retrieving the video: ${error.message || error}`, event.threadID, event.messageID);
    }
  }
};
