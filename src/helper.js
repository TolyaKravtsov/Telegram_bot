module.exports = {

    logStart() {
        console.log("Bot has been started");
    },

    getChatId(message) {
        return message.chat.id
    },

    UserName(message){
      return message.from.first_name
    }

};
