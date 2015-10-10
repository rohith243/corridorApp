var user = {};
user.getDetails = function(req) {
    var attr = req.session.cas && req.session.cas.attributes;
    var user;
    if (attr) {
        user = {};
        user.firstname = attr.firstname[0];
        user.mail = attr.mail[0];
        user.lastname = attr.lastname[0];
        user.uid = attr.uid[0];
    }
    return user;
};
user.getAllDetails = function(req) {
    return (req.session.cas && req.session.cas.attributes || '');
};
user.checkMail = function ( req, email ) {
    var detail = user.getDetails();
    return detail && ( detail.mail === email );
};
module.exports = user;
