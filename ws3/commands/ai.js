const axios = require("axios");
const name = "ai";

module.exports = {
  name,
  description: "Generates an AI response based on your input",
  async run({ api, send, args }) {
    const prompt = args.join(" ");
    
    if (!prompt) return send(`Usage: ${api.prefix + name} [your input]`);

    try {
      const res = await axios.get('https://betadash-api-swordslush.vercel.app/gpt-4o-mini', {
        params: { ask: prompt }
      });

      if (!res || !res.data || res.data.code !== 200) throw new Error("Invalid response from API");

      const result = res.data.message;
      const maxMessageLength = 2000;
      if (result.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(result, maxMessageLength);
        for (const message of messages) {
          send(message);
        }
      } else {
        send(result);
      }

    } catch (error) {
      send("Error generating the response. Please try again or check your input.\n" + (error.message || error));
    }
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
