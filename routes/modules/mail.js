var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mail = {};

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user: 'notifications.message@gmail.com',
        pass: '8123424252'
    }
}));

var mailOptions = {
    from: 'notifications.message@gmail.com', // sender address
    to: 'notifications.message@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    //text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

mail.send = function  ( item , user ) {
    console.log(item, user)
    mailOptions.to = item.owner.mail;
    mailOptions.cc = user.mail;
    mailOptions.subject = 'Letsbuild Notification: Interest ' + item.appName;
    mailOptions.html = '<p>Hi '+ item.owner.uid +'</p>';
    mailOptions.html += '<p>'+ user.uid +' had expressed Interest in the app</p>';
    mailOptions.html += '<p><b>Cotribution Hours :</b> '+ user.hours +'</p>';
    mailOptions.html += '<p><b>Comments: </b>'+ user.aboutme +'</p>';
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });  
};

module.exports = mail;

