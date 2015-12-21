var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var siteConfig = require( './confidentials/site-config' );
var mailConfig = siteConfig.mailConfig || {};

var mail = {
    //dummy function 
    send: function() {
    
    } 
};


var getTransporter = function() {
    return nodemailer.createTransport(smtpTransport({
            service: 'Gmail',
            auth: {
                user: mailConfig.mail,
                pass: mailConfig.pass
            }
        }
    ));
}

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
    mailOptions.subject = 'Let\'s Build Notification: Interest ' + item.appName;
    mailOptions.html = '<p>Hi '+ ( item.owner.firstName || item.owner.uid )+'</p>';
    mailOptions.html += '<p><b>'+ ( user.firstName || user.uid ) +'</b> has expressed interest in the app</p>';
    mailOptions.html += '<p><b>Contribution Hours :</b> '+ user.hours +'</p>';
    mailOptions.html += '<p><b>Comments: </b>'+ user.aboutme +'</p>';
    getTransporter().sendMail(mailOptions, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });  
};
mail.notifyProposedTeam = function  ( item, existingTeam, updatingTeam  ) {
    //check if proposed member deleted
    for( var i=0; i < existingTeam.length; i++ ) {
        var deleted = true;
        for( var j=0;j<updatingTeam.length;j++ ) {
            if( existingTeam[i].mail === updatingTeam[ j ].mail ) {
                deleted = false;
                break;
            }
        }
        if( deleted ) {
            if( existingTeam[i].mail === item.owner.mail ) {
                //donot notify the owner ( to avoid sending mail to owner same person)
                continue;
            }
            console.log( 'deleting', existingTeam[i].mail );
            mailOptions.to = existingTeam[i].mail;
            mailOptions.cc = item.owner.mail;
            mailOptions.subject = 'Let\'s Build Notification: ' + item.appName;
            mailOptions.html = '<p>Hi '+ ( existingTeam[i].firstName )+',</p>';
            mailOptions.html += '<p> you have removed from proposed Team of <b>'+  item.appName+'</b></p>';
            getTransporter().sendMail(mailOptions, function(error, info){
                if(error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            })        
        }
    }
    //check if proposed member added
    for( var i=0; i < updatingTeam.length; i++ ) {
        var newMem = true;
        for( var j=0;j<existingTeam.length;j++ ) {
            if( updatingTeam[i].mail === existingTeam[ j ].mail ) {
                newMem = false;
                break;
            }
        }
        if( newMem ) {
            if( updatingTeam[i].mail === item.owner.mail ) {
                //donot notify the owner ( to avoid sending mail to owner same person)
                continue;
            }
            console.log( 'adding', updatingTeam[i].mail );
            mailOptions.to = updatingTeam[i].mail;
            mailOptions.cc = item.owner.mail;
            mailOptions.subject = 'Let\'s Build Notification: ' + item.appName;
            mailOptions.html = '<p>Hi '+ ( updatingTeam[i].firstName )+',</p>';
            mailOptions.html += '<p> you have added in proposed Team of <b>'+  item.appName+'</b></p>';
            getTransporter().sendMail(mailOptions, function(error, info){
                if(error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            })        
        }
    }

};
module.exports = mail;

