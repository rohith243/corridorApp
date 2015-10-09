var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mailConfig = require( './../confidentials/mail-config.js' );
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

mail.send = function  ( item , user ) {

    mailOptions.to = item.owner.mail;
    mailOptions.cc = user.mail;
    mailOptions.subject = 'Letsbuild Notification: Interest ' + item.appName;
    mailOptions.html = '<p>Hi '+ item.owner.uid +'</p>';
    mailOptions.html += '<p>'+ user.uid +' had expressed Interest in the app</p>';
    mailOptions.html += '<p><b>Cotribution Hours :</b> '+ user.hours +'</p>';
    mailOptions.html += '<p><b>Comments: </b>'+ user.aboutme +'</p>';
    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });  
};
module.exports = mail;

