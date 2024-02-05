const TelegramBot = require('node-telegram-bot-api');

const token = '6904460119:AAEPp6vAwWGPzP59-JigozQ2jJpXem2D8mw';
const webAppUrl = 'https://tranquil-moonbeam-6811fd.netlify.app/';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(
      chatId,
      'Заходи в наш интернет магазин по кнопке ниже',
      {
        reply_markup: {
          keyboard: [[{ text: 'Заполни форму', web_app: { url: webAppUrl } }]],
        },
      }
    );

    await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Сделать заказ', web_app: { url: webAppUrl } }],
        ],
      },
    });
  }
});
