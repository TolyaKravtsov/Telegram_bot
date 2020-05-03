const TelegramBot = require('node-telegram-bot-api');
const TelegramToken = '1140883126:AAGSkMlkUeLasZ_-NNN8ky52IIYQMsZZja0';
const travelPayOutsToken = 'da8dc06edc902027201164d412a9947e';
const baseURL = 'http://api.travelpayouts.com/'
const debug = require('./debug');
const axios = require('axios');
let CityObject = {};
let FindedCity;

console.log("Bot has been started");

const bot = new TelegramBot(TelegramToken, {
    polling: true
});

bot.onText(/\/start/, msg => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Клавиатура', {
        reply_markup: {
            keyboard: [
                ['Cписок рейсов'],
                ['Мои забронированные рейсы'],
                ['Моя информация'],
                ['Закрыть'],

            ]
        }
    });
})
bot.on("polling_error", (err) => console.log(err));
bot.on('message', msg => {

    const chatId = msg.chat.id;

    switch (msg.text) {
        case 'Закрыть':
            bot.sendMessage(chatId, 'Закрываю клавиатуру', {
                reply_markup: {
                    remove_keyboard: true
                }
            })
            break;
        case 'Моя информация':
            bot.sendMessage(chatId, 'Получаю информацию обо мне', {
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
            })
            break;
        case 'Cписок рейсов':
            bot.sendMessage(chatId, 'Открываю список рейсов', {
                reply_markup: {
                    keyboard: [
                        ['Ввести город отправления'],
                    ]
                }
            })
            break;
        case 'Ввести город отправления':
            bot.sendMessage(chatId, 'Введите город отправления')
            axios.get(`${baseURL}data/ru/cities.json`)
                .then(response => {
                    response.data.map((element, index) => {
                            CityObject = {
                                ...CityObject,
                                [element["name"]]: [element["code"]],
                            }

                        }
                    )
                        .then(
                            bot.on('message', msg => {

                                FindedCity = CityObject[msg.text];
                                console.log(FindedCity)

                                if (FindedCity) {
                                    bot.sendMessage(chatId, "Город записан");
                                }
                                if (FindedCity === undefined) {
                                    FindedCity = 'Минск'
                                }
                                bot.sendMessage(chatId, '...', {
                                    reply_markup: {
                                        keyboard: [
                                            ['Найти рейсы в заданном городе'],
                                        ]
                                    }
                                })
                            }))
                })
                .catch(error => {
                    console.log(error);
                })
            break;
        case "Найти рейсы в заданном городе":
            axios.get(`${baseURL}v1/city-directions?origin=${FindedCity}&currency=usd&token=${travelPayOutsToken}`)
                .then(response => {
                        Object.keys(response.data.data).map((element) => {
                            element = FindedCity;
                        })
                        let data = JSON.stringify(response.data.data, null, '\t');
                        bot.sendMessage(chatId, data);
                        console.log(data);
                    }
                ).catch(error => {
                console.log(error);
            })
    }

});