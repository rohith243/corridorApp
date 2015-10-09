var utils = {};
utils.getSetObject = function(data, cname) {
    var obj = {};
    var objupdated = false;
    var map = {
        appstore: ['name', 'category', 'src', 'srcLg', 'infotext', 'href', 'desc'],
        letsbuild: [
            'name',
            'src',
            'status',
            'effort',
            'percentageOfCompletion',
            'category',
            'href',
            'division',
            'shortDesc',
            'longDesc',
            'techDetails',
            'vedioLink',
            'minimumBid',
            'team',
            'proposedTeam',
            'appName',
            'shortDesc',
            'longDesc',
            'proposedTeam',
            'links',
            'solution',
            'contributors',
            'isPublish',
            'public',
            'invites',
            'imgurl',
            'interests',
            'likes'
        ],
        globals: ['name', 'type', 'value']
    };
    for (var len = map[cname].length - 1; len >= 0; len--) {
        var key = map[cname][len];
        if (typeof data[key] !== 'undefined') {
            objupdated = true;
            obj[key] = data[key];
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