const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1767590786:AAHYXIdaGmTrJueFTQWUL6WNDknVGxinLww';

// super bot group chat id
const groupChatId = '-390254465';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);

module.exports = {
    sendMessageToSupperBotGroup: (message) => {
        console.log("sending message to super bot group...");
        bot.sendMessage(groupChatId, message, { parse_mode: "HTML" })
    }
}