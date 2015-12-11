define([
  'angular',
  'jquery',
  'modules/socket'
], 
function(
    angular,
    $,
    socket
){


    socket = socket.getSocket();    
    
    var commentingTo;
    var innerCommentTo;
    angular.module( 'letsBuild' )
    .directive('comments', [function() {
        return {
            templateUrl:  './partials/comments-section.html',
            restict: 'E',
            scope: {
            },
            replace: true,
            controller: 'commentsController'
        };
    }])
    .controller( 'commentsController', [
        '$scope',
        'navMenu',
        '$stateParams',        
        function( $scope, navMenu, $stateParams ) {
            $scope.comments = [];
            $scope.postComment = function( e, value, item, innerItem ) {
                e.preventDefault();
                if( !GLOBAL.user ) {
                    navMenu.openMenu(e, true);
                    return
                }
                var comment = {};
                comment.comment = value;
                comment.pageId = $stateParams.id;
                comment.commenter = GLOBAL.user;
                $scope.comments.push( comment );
                $scope.newcomment = '';
                socket.emit( 'post-comment', {
                    obj: comment
                } );
            };
            

            if( socket ){
                //socket.emit( 'req-feeds', { from: 0, to: 50 } );
                socket.emit( 'req-comments', {
                    pageId: $stateParams.id
                } );

                //remove the earlier binded on for socket 
                socket.off( 'res-comments' );
                socket.on( 'res-comments', function( res ) {
                    $scope.comments = res;
                    $scope.$apply();
                } );
            }
            
        }
    ] )
    .directive( 'comment', function() {
        return {
            templateUrl:  './partials/comment-partial.html',
            restict: 'E',
            scope: {
                item: '=',
                allComments: '=',
                index: '='
            },
            replace: true,
            controller: 'commentController'
        };
    } )
    .controller( 'commentController', [
        '$scope',
        '$stateParams',
        'navMenu',
        function(
            $scope,
            $stateParams,
            navMenu
        ) {
            $scope.user = GLOBAL.user;
            $scope.removeComment = function( e, index ) {
                if( !GLOBAL.user ) {
                    navMenu.openMenu(e, true);
                    return
                }

                e.preventDefault();
                $scope.allComments.splice( index, 1 );
                socket.emit( 'req-remove-comment', {
                   commentId: $scope.item.id
                } );
            };

            $scope.replyComment = function( e, item ) {
                e.preventDefault();
                if( commentingTo ) {
                    commentingTo.showCommentForm = false;
                }  
                commentingTo = item; 
                commentingTo.showCommentForm = true;
                innerCommentTo = false;
                $scope.userTarget = item.commenter;
            };

            $scope.postReplyComment = function(e, value, item) {
                
                e.preventDefault();

               
                if( !GLOBAL.user ) {
                    navMenu.openMenu(e, true);
                    return
                }
                var comment = {};
                comment.comment = value;
                comment.commenter = GLOBAL.user;
                comment.pageId = $stateParams.id;
                comment.commentId = commentingTo.id;

                //console.log( comment.commentId );    
                
                if( innerCommentTo && innerCommentTo.createdAt ) {
                    comment.commentTo = innerCommentTo.createdAt;
                    comment.target = innerCommentTo.commenter;
                }
                comment.id = +new Date();
                comment.createdAt = +new Date();
                item.children = item.children || [];
                item.children.push( comment );
                item.showCommentForm = false;

                socket.emit( 'post-inner-comment', {
                    obj: comment
                } );

            };
        } 
    ] )
    .directive( 'innerComment', function() {
        return {
            templateUrl:  './partials/inner-comment-partial.html',
            restict: 'E',
            scope: {
                item: '=',
                allComments: '=',
                index: '=',
                parentComment:'='
            },
            replace: true,
            controller: 'innerCommentController'
        };
    } )
    .controller( 'innerCommentController', [
        '$scope',
        'navMenu',
        function(
            $scope,
            navMenu
        ) {
            $scope.user = GLOBAL.user;
            $scope.removeInnerComment = function( e, index ) {
                e.preventDefault();
                if( !GLOBAL.user ) {
                    navMenu.openMenu(e, true);
                    return
                }
                
                $scope.allComments.splice( index, 1 );
                socket.emit( 'req-remove-inner-comment', {
                   commentId: $scope.parentComment.id,
                   createdAt: $scope.item.createdAt 
                } );
            };

            $scope.replyComment = function( e, item ) {
                e.preventDefault();
                if( commentingTo ) {
                    commentingTo.showCommentForm = false;
                }
                commentingTo = $scope.parentComment;
                commentingTo.showCommentForm = true;
                $scope.$parent.$parent.userTarget = item.commenter;
                innerCommentTo = item;
            };
        } 
    ] )
    
});

