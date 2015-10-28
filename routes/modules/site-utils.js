var utils = {};
utils.getSetObject = function(data, cname, isRequiredValidation) {
    var obj = {};
    var objupdated = false;
    var key;
    var map = {
        appstore: ['name', 'category', 'src', 'srcLg', 'infotext', 'href', 'desc'],
        letsbuild: [
            'appName',
            'shortDesc',
            'longDesc',
            'category',
            'solution',
            'vedioLink',
            'links',
            'proposedTeam',
            'contributors',
            'public',
            'status',
            'invites',
            'imgurl',
            'isPublish',
            'effort'          
        ],
        featureConfig: [ 'featureText', 'list', 'featureKey', 'open' ]
    };
    var requiredMap = {
        letsbuild: [
           'appName',
           'solution'
        ]
    };
    for (var len = map[cname].length - 1; len >= 0; len--) {
        key = map[cname][len];
        if (typeof data[key] !== 'undefined') {
            objupdated = true;
            obj[key] = data[key];
        }
    }

    if( isRequiredValidation  ) {
        obj.errorFields = [];
        for( key in requiredMap[ cname ] ) {
            if( !obj[ requiredMap[ cname ][ key ] ] ) {
                obj.errorFields.push( requiredMap[ cname ][ key ] );
            } 
        }
    }

    if ( objupdated ) {
        utils.validateVideoLink( obj );
        return obj;
    } else {
        return false;
    }
};

utils.validateVideoLink = function ( obj ) {
    var regex = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/i;

    if( obj.vedioLink ) {
        if( !regex.test( obj.vedioLink ) )  {
            obj.vedioLink = false;
        }
    }
};

module.exports = utils;