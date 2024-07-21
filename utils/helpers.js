
const nodemailer = require('nodemailer');

const success = function(res,success,code,message,body) {
    return res.status(code).json({
        success,
        code,
        message,
        body: body ? body : null,
    });
};
const error = function(res,code,message) {
    return res.status(code).json({
        success: false,
        code,
        message
    });
}

const sendEmail = function(msg,email,subject) {
    let transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "9df763c2ff1192",
            pass: "6e9afe04b33818"
         }
        });
        // Message object
    let message = {
        from: 'dreamcompany@yopmail.com',

        // Comma separated list of recipients
        to: email,

        // Subject of the message
        subject: subject || "Testing email",

        // plaintext body
        text: msg,

        // HTML body
        // html:
        //     '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
        //     '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',

        // An array of attachments
     
    };
        transport.sendMail(message, (error, info) => {
            if (error) {
                console.error('Error occurred:', error);
                return false;
            }else{
                console.log('Message sent successfully:', info.response);
                return true;
            }
        })
}

module.exports = {success,error,sendEmail};
