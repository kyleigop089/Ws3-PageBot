const axios = require("axios");
const name = "ai";

module.exports = {
  name,
  description: "Generates an AI response based on your input",
  async run({ api, send, args }) {
    const prompt = args.join(" ");
    
    if (!prompt) return send(`Usage: ${api.prefix + name} [your input]`);

    send("Please wait while I process your request...");

    try {
      const res = await axios.get('https://betadash-api-swordslush.vercel.app/gpt-4-0613', {
        params: { ask: prompt }
      });

      if (!res || !res.data || res.data.code !== 200) throw new Error("Invalid response from API");

      const result = res.data.message;
      send(result);

    } catch (error) {
      send("Error generating the response. Please try again or check your input.\n" + (error.message || error));
    }
  }
};
