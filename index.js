const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6904460119:AAEPp6vAwWGPzP59-JigozQ2jJpXem2D8mw';
const webAppUrl = 'https://tranquil-moonbeam-6811fd.netlify.app';
const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(
      chatId,
      'Заходи в наш интернет магазин по кнопке ниже',
      {
        reply_markup: {
          keyboard: [
            [{ text: 'Заполни форму', web_app: { url: webAppUrl + '/form' } }],
          ],
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

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(chatId, 'Thanks');
      await bot.sendMessage(chatId, 'Your country: ' + data?.country);
      await bot.sendMessage(chatId, 'Your street: ' + data?.street);

      setTimeout(async () => {
        await bot.sendMessage(
          chatId,
          'You receive all information in this bot'
        );
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  }
});

app.post('/web-data', async (req, res) => {
  const { queryId, products, totalPrice } = req.data;

  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Payment Successful',
      input_message_content: {
        message_text: `Thanks for buy for a sum ${totalPrice}`,
      },
    });
    return res.status(200).json({});
  } catch (error) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Payment Error',
      input_message_content: {
        message_text: `Payment Error`,
      },
    });
    return res.status(500).json({});
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
