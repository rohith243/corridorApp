var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mailConfig = require( './../confidentials/mail-config.json' );
var mail = {
    //dummy function 
    send: function() {
    
    } 
};
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user: mailConfig.mail,
        pass: mailConfig.pass
    }
}));

var mailOptions = {
    from: mailConfig.mail, // sender address
    to: '', // list of receivers
    subject: '', // Subject line
    //text: 'Hello world ✔', // plaintext body
    html: '' // html body
};

mail.send = function  ( item, user ) {
    console.log( 'sending mails' );
    mailOptions.to = item.owner.mail;
    mailOptions.cc = user.mail;
    mailOptions.subject = 'LetsBuild Notification: Interest ' + item.appName;
    mailOptions.html = '<p>Hi '+ ( item.owner.uid )+'</p>';
    mailOptions.html += '<p><b>'+ ( user.fullName || user.uid ) +'</b> has expressed interest in the app</p>';
    mailOptions.html += '<p><b>Contribution Hours :</b> '+ user.hours +'</p>';
    mailOptions.html += '<p><b>Comments: </b>'+ user.aboutme +'</p>';
    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });  
};
module.exports = mail;

