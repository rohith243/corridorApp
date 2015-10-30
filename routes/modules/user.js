var siteConfig = require( './../confidentials/site-config' );
var user = {};
user.getDetails = function(req) {

    var attr = req.session.cas && req.session.cas.attributes;
    var user;
    
    if (attr) {
        user = {};
        user.firstName = attr.firstname[0];
        user.mail = attr.mail[0];
        user.lastName = attr.lastname[0];
        user.uid = attr.uid[0];
        user.admin = siteConfig.admin.indexOf( user.mail ) !== -1;
    }
    return user;
};
user.getAllDetails = function(req) {
    return (req.session.cas && req.session.cas.attributes || '');
};
user.checkMail = function ( req, email ) {
    var detail = user.getDetails( req );
    return detail && ( detail.mail === email );
};

user.getConfig = function() {
    return siteConfig;
};

user.setConfig = function( obj ) {
    var fs = require('fs');
    var path = require('path');
    var data = obj.data;
    fs.writeFile( path.join(__dirname, './../confidentials/site-config.json' ) , JSON.stringify( data, null, '  ' ), 'utf8' , function(err) {
        if( err ) {
            obj.res.statusCode = '500';
            obj.res.json( {
                error: '_file_write_error'
            } );
            return;
        }
        siteConfig = data;
        obj.callback()
        return;
    }); 
};

user.checkFeatureConfig = function( doc, udetails ) {

    if( !doc ) {
        return false;
    }

    if( doc.open === 'all' )
        return true;
    else if( doc.open === 'none' ) 
        return false;    
    else if( doc.list ) {
        if( udetails &&  udetails.mail )
            return doc.list.indexOf( udetails.mail ) !== -1;
    } else {
        return false;
    }

    return false;
};


module.exports = user;
