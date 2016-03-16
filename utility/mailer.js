var nodemailer = require('nodemailer');
var debug = require('debug')('VaccineForChild:mailer');

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

module.exports.sendConfirmCode = function (email, code, callback) {

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpInfo);

    // e-mail data
    var mailOptions = {
        from: "vaccinebd@gmail.com",
        to: email,
        subject: "Confirmation code",
        text: "Your email confirmation code is: " + code + ". Thanks!"
        //html: '<html><body><h1>Vaccine For Child</h1><br/> Your confirmation code is: <br/><code>' + code + '</code></body></html>'
    };

    transporter.sendMail(mailOptions, callback);
};