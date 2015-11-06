var user = require( '../../modules/user' );
var disableAllMethodsBut = require( '../../modules/disable-all-methods-but');

module.exports = function(Todo) {
    
    disableAllMethodsBut( Todo, [] );
    Todo.publishedTodos = function( req, res, cb ) {
        Todo.find({
          // find locations near the provided GeoPoint
          where: { isPublished: true }
        }, function(err, res ) {      
          cb( null, res );
        } );
    };

    Todo.remoteMethod('publishedTodos', {
        returns: {arg: 'apps', root: true},
        http: { verb: 'GET' },
        accepts:[
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });


    Todo.myTodos = function(req, res, cb) {
        
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( [] );
            return;
        }
        Todo.find({
          where: {'owner.mail': udetails.mail }
        }, function(err, res ) {      
          cb( null, res );
        } );

    };

    Todo.remoteMethod('myTodos', {
        returns: {arg: 'apps', root: true},
        http: { verb: 'GET' },
        accepts:[
            { arg: 'req', type: 'object', 'http': {source: 'req'}},
            { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });


    Todo.createTodo = function( data, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 403;
            res.json( {
                error: '_invalid_user'
            } );
            return;
        }
        var setObj = data;
        setObj.owner = udetails;
        setObj.createdAt = +new Date();
        Todo.create( setObj , function(err, res ) {      
          cb( null, res );
        } );
    };

    Todo.remoteMethod('createTodo', {
        returns: {arg: 'todo', root: true},
        accepts:[
          { arg: 'data', type: 'object', 'http': {source: 'body'} },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });



    Todo.updateTodo = function( data, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }
        var id = data.id;
        Todo.findById( id, function( err, doc ) {
            var setObj = data;
            setObj.lastUpdatedBy = udetails;
            setObj.lastUpdatedAt = +new Date();
            if(  udetails.mail !== doc.owner.mail || udetails.admin ) {
                res.statusCode = 404;
                res.json( {
                    error: '_unauthorized_user'
                } );
                return;
            }
            doc.updateAttributes( data, function( err, res ) {
                cb( null, res );
            } );
            
        } );
        
    };

    Todo.remoteMethod('updateTodo', {
        returns: {arg: 'todo', root: true},
        accepts:[
          { arg: 'data', type: 'object', 'http': {source: 'body'} },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ]
    });


    Todo.deleteTodo = function( id, req, res, cb ) {
        udetails = user.getDetails( req );
        if( !udetails ) {
            res.statusCode = 404;
            res.json( {
                error: '_not_loggedin'
            } );
            return;
        }

        Todo.findById( id, function( err, doc ) {
            if(  udetails.mail !== doc.owner.mail ) {
                res.statusCode = 404;
                res.json( {
                    error: '_unauthorized_user'
                } );
                return;
            }
            Todo.destroyById( id, function( err, res ) {
                cb( null, res );
            } );
        } );
        
    };

    Todo.remoteMethod('deleteTodo', {
        returns: {arg: 'todo', root: true},
        accepts:[
          { arg: 'id', type: 'string', required: true },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ],
        http: { verb: 'GET' }
    });


    Todo.getTodo = function(id, req, res, cb ) {
        
        var udetails = user.getDetails( req );
        Todo.findById( id, function(err, doc ) {
          if( !doc ) {
            res.statusCode = 404;
            res.json( {
                error: '_item_not_found'
            } );
            return;
          } 
          if( doc.isPublished ||  udetails&&udetails.mail === doc.owner.mail ) {
            cb( null, doc)
          } else {
            res.statusCode = 403;
            res.json( {
                error: '_invalid_user'
            } );
            return;
          }
        } );
    };

    Todo.remoteMethod('getTodo', {
        returns: {arg: 'apps', root: true},
        http: { verb: 'GET' },
        accepts:[
          { arg: 'id', type: 'string', required: true },
          { arg: 'req', type: 'object', 'http': {source: 'req'}},
          { arg: 'res', type: 'object', 'http': {source: 'res'}}
        ],
        http: { verb: 'GET' }
    });

};
