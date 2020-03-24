bot.on('message', msg => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Клавиатура', {
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
    if (msg.text === 'Закрыть') {

        bot.sendMessage(chatId, 'Закрываю клавиатуру', {
            reply_markup: {
                remove_keyboard: true
            }
        })

    }

});
