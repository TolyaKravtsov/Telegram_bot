const TelegramBot = require('node-telegram-bot-api');
const debug = require('./debug');
const config = require('./config');
const {logStart, UserName, getChatId} = require('./helper');

logStart();

const bot = new TelegramBot(config.token, {
    polling: true
});


bot.on('message', message => {
    if (message.text === 'Закрыть') {

        bot.sendMessage(getChatId(message), 'Закрываю клавиатуру', {
            reply_markup: {
                remove_keyboard: true
            }
        })

    }
});

bot.onText(/\/start/, message => {
    const text = `Добро пожаловать, ${UserName(message)}\n Выберите команду для начала работы`;
    bot.sendMessage(getChatId(message), text, {
        reply_markup: {
            keyboard: [
                [{
                    text: 'Узнать моё месторасположение',
                    request_location: true
                }],
                ['Закрыть'],
                [{
                    text: 'Узнать мой контакт',
                    request_contact: true
                }],
            ]
        }
    });
});
