if (typeof GLOBAL === 'undefined') {
    GLOBAL = {};
} else {
    if (GLOBAL.messages) {
        GLOBAL.messages.responseError = 'error inloading response';
    } else {
        GLOBAL.messages = {
            responseError: 'error inloading response'
        }
    }
}
angular.module('notificationConfig', ['ui-notification'])
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 3000,
            startTop: 50,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    });
