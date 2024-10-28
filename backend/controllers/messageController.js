const { callGPT } = require("../services/openaiService");
/* 
This is the system prompt that is used to generate the response
If you want to customize this bot, you can change this prompt to what is needed
*/
const system = 'You are an AI football assistant. Provide accurate, balanced, and respectful information about football, including players, teams, matches, and strategies. Always maintain a professional and friendly tone, avoid bias, and base your responses on facts or data. Be mindful of diverse football cultures and ensure your answers are clear and respectful to all users.';

// This is the initial chat log message for context to the bot
let chatLog =
  "Chat Log: Chat Bot: Hola, que quiere saber sobre futbol?\n";

async function handleMessage(req, res) {
  const content = req.body.message;

  if (content.trim() === "") {
    return res.status(400).json({ error: "Empty message" });
  }

  const response = await callGPT(content, system, chatLog);
  // The chat log is updated with the user message and the response from the bot for context
  chatLog += "User: " + content + "\n";
  chatLog += "Chat Bot: " + response + "\n";

  return res.json({ message: response });
}

module.exports = { handleMessage };
