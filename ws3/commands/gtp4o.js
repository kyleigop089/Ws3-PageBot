const axios = require('axios');

const gothicFont = {
  A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
  S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹", 
  a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
  j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
  s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
  0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
};

const convertToGothic = (text) => {
  return text.split('').map(char => gothicFont[char] || char).join('');
};

module.exports = {
  name: 'gpt4o',
  description: 'Get a response from GPT-4o in Gothic font',
  async run({ api, send, args }) {
    const query = args.join(' ');

    if (!query) {
      return send('Please provide a query, for example: gpt4o what is chilli');
    }

    const apiUrl = `${api.api_josh}/api/gpt-4o?q=${encodeURIComponent(query)}&uid=1`;

    try {
      send('🟡 Searching for your answer...');
      
      const response = await axios.get(apiUrl);
      const gpt4oResponse = response.data.result || 'No response from GPT-4o.';

      const gothicResponse = convertToGothic(gpt4oResponse);

      send(gothicResponse);

    } catch (error) {
      console.error('Error:', error);
      send('❌ An error occurred while fetching the response. Please try again later.');
    }
  }
};
