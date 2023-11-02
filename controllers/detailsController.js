const asyncHandler = require("express-async-handler");
const {sendSMS} = require("../helper/smshelper")

const getDetails =asyncHandler(async(req,res)=>{
    const {email,phoneNumber,productId,productName,nationalId} =req.body
    if (!phoneNumber) {
        return res.status(400).json({
            status: "error",
            message: "Phone Number is required"
        });
    }
    // Call the sendSMSMiddleware
    try {
        // Set up the SMS message
        const message = `Hello ${nationalId}, your payment is being processed for product ${productName}.`;

        // Send SMS using the helper function
        const smsResult = await sendSMS(phoneNumber, message);

        res.status(200).json({
            status: "success",
            message: "Details entered successfully and payment processing message sent",
            smsResult
        });
    } catch (error) {
        console.error("Error", error);
        res.status(500).send("An error occurred while sending SMS");
    }
})

module.exports ={getDetails}