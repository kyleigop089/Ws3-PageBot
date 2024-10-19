const api = require('./api');
const prefix = api.prefix;

const getStarted = async (send) => send({
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: api.introduction,
        buttons: [
          {
            type: "postback",
            title: "Commands",
            payload: "HELP"
          },
          {
            type: "postback",
            title: "Prefix",
            payload: "PREFIX"
          }
        ]
      }
}});

const listenMessage = async (event, pageAccessToken) => {
  const senderID = event.sender.id;
  const message = event.message.text;
  if (!senderID || !message) return;
  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : {text}, pageAccessToken),
  [command, ...args] = (message || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(arg => arg.trim()),
    admin = api.admin.some(id => id === senderID);

  // Check if the message starts with the prefix
  if (message.toLowerCase().startsWith(prefix.toLowerCase())) {
    switch (command) {
      case "prefix": {
        return send(`Hello! My prefix is ${prefix}`);
      }
      default: {
        if (api.commands.some(cmd => cmd === command)) {
          const commandJs = require(api.cmdLoc + `/${command}`);
          if (commandJs.admin && !admin) {
            return send({
              text: `❌ Command ${command} is for admins only. Type or click (below) ${prefix}help to see available commands.`,
              quick_replies: [
                {
                  content_type: "text",
                  title: "/help",
                  payload: "HELP"
                }
              ]
            });
          }
          await (commandJs.run || (() => {}))({
              api,
              event,
              send,
              admin,
              args
          });
        } else {
          return send({
            text: `❌ Command${command ? ` ${command} ` : " "}doesn't exist! Type or click (below) ${prefix}help to see available commands.`,
            quick_replies: [
              {
                content_type: "text",
                title: "/help",
                payload: "HELP"
              }
           ]
          });
        }
      }
    }
  } else {
    // If no prefix, send a message that a prefix is needed
    return send({
      text: `❌ The command requires a prefix! Use: ${prefix} before your command.`,
      quick_replies: [
        {
          content_type: "text",
          title: `${prefix}help`,
          payload: "HELP"
        }
      ]
    });
  }
};

const listenPostback = async (event, pageAccessToken) => {
  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : {text}, pageAccessToken),
  senderID = event.sender.id, postbackPayload = event.postback.payload,
  payload = postbackPayload.toLowerCase().trim();
  
  if (!senderID || !payload) return;

  switch (payload) {
    case "get_started": {
      return getStarted(send);
    }
    case "prefix": {
      return send(`Hello! My prefix is ${prefix}`);
    }
    default: {
      const admin = api.admin.some(id => id === senderID);
      if (payload && api.commands.some(cmd => cmd === payload)) {
          const commandJs = require(api.cmdLoc + `/${payload}`);
          if (commandJs.admin && !admin) return send("This command is for admins only.");
          await (commandJs.run || (() => {}))({
          api,
          event,
          send,
          admin
        });
      } else return;
    }
  }
};

module.exports = async (event, pageAccessToken) => {
  if (event.message) listenMessage(event, pageAccessToken);
  else if (event.postback) listenPostback(event, pageAccessToken);
};
