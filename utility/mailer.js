var debug = require('debug')('VaccineForChild:mailer');
var nodemailer = require('nodemailer');

var smtpInfo = {
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    //service: "Gmail",
    auth: {
        user: "vaccinebd@gmail.com",
        pass: "1319131913"
    }
};

module.exports.sendEmail = function (email, messege, callback) {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpInfo);

    // create e-mail body
    var mailOptions = {
        from: "vaccinebd@gmail.com",
        to: email,
        subject: "Confirmation code",
        //html: '',
        text: messege
    };

    // send an email
    transporter.sendMail(mailOptions, callback);
};


module.exports.sendConfirmCode = function (email, code, callback) {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpInfo);

    // create e-mail body
    var mailOptions = {
        from: "vaccinebd@gmail.com",
        to: email,
        subject: "Confirmation code",
        //html: '',
        text: "Please use " + code + " as your confirmation code in VaccineForChild. \n\n Thanks!"
    };

    // send an email
    transporter.sendMail(mailOptions, callback);
};
