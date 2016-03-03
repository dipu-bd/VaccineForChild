var nodemailer = require('nodemailer');
var debug = require('debug')('VaccineForChild:mailer');

var smtpInfo = 'smtps://vaccineforchild@gmail.com:v2f3c4#4c3f2v@smtp.gmail.com';

module.exports.sendConfirmCode = function(email, code, callback) {

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpInfo);

    // e-mail data
    var mailOptions = {
        from: '"Vaccine For Child Mail" <vaccineforchild@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Confirm Code', // Subject line
        text: 'Your confirmation code is ' + code, // plaintext body
        html: '<h1>Vaccine For Child</h1><br/>' + // html body
        'Your confirmation code is: <br/><code>' + code + '</code>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, callback);
};
