const Africastalking = require("africastalking");

const africastalking = Africastalking({
    apiKey: process.env.API_KEY,
    username: 'africasmsApp'
});

const sendSMS = async (phoneNumber, message) => {
    try {
        // Send the message
        const result = await africastalking.SMS.send({
            to: phoneNumber,
            message: message
        });

        console.log(result);

        return {
            status: "success",
            data: { result }
        };
    } catch (error) {
        console.log("Error", error);
        throw new Error("An error occurred while sending the SMS");
    }
};

module.exports = { sendSMS };
