const mysql = require("mysql");
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'',
    database:'Creditors'
})

const sendEmail = (req, res) => {
    console.log("sending....")
    try {
        const { name, email, phoneNumber, nationalId, productId, productName } = req.body;
        const { files, idPhoto } = req.files;
        const pdfAttachments = files.filter((file) => file.mimetype === 'application/pdf');
        const imageAttachments = [idPhoto].concat(files.filter((file) => file.mimetype === 'image/jpeg'));
        console.log(req.body)
        console.log(files)
        console.log(idPhoto)

        let mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: "exampleme999@gmail.com",
            subject: `Application for${nationalId}`,
            html: ` 
                            <div>
                                <p>Name: ${name}</p>
                                <p>NationalId: ${nationalId}</p>
                                <p>Email address: ${email}</p>
                                <p>productID: ${productId}</p>
                                <p>productName: ${productName}</p>
                                <p>Phone Number: ${phoneNumber}</p>
                            </div>
                            `,
            attachments: [...pdfAttachments, ...imageAttachments].concat(idPhoto),
        }
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                res.json({
                    message: err
                }).status(400)
                console.log(err)
            } else {
                // If the email is sent successfully, save data to MySQL
                pool.getConnection((err, connection) => {
                    if (err) {
                        res.status(500).json({
                            message: err,
                            status: 'database_connection_error'
                        });
                        console.log(err);
                    } else {
                        const dbData = {
                            name,
                            email,
                            phoneNumber,
                            nationalId,
                            productId,
                            productName,
                            // Assuming 'files' and 'idPhoto' are file paths
                            files: files[0].path,
                            idPhoto: idPhoto[0].path
                        }
                        connection.query('INSERT INTO Aspiracredit SET ?', dbData, (err, rows) => {
                            connection.release();
                            if (err) {
                                res.status(500).json({
                                    message: err,
                                    status: 'database_insertion_error'
                                });
                                console.log(err);
                            } else {
                                res.status(200).json({
                                    message: `Email sent and user with the National id: ${nationalId} has been added`,
                                    status: 'success'
                                });
                                
                            }
                        });
                        console.log('Email Sent: ' + data.response);
                    }
                })
            }
        });

    } catch (error) {
        res.status(400).send(error)
    }


}

module.exports = { sendEmail }