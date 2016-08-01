var myapp = angular.module('sortableApp', ['ui.sortable']);


myapp.controller('sortableController', function ($scope) {
    var tmpList = [{ text: 'A', value: 'Images/1.jpg' },
                   { text: 'B', value: 'Images/2.jpg' },
                   { text: 'C', value: 'Images/3.jpg' },
                   { text: 'D', value: 'Images/4.jpg' },
                   { text: 'E', value: 'Images/5.jpg' },
                   { text: 'F', value: 'Images/6.jpg' },
    ];


    $scope.list = tmpList;


    $scope.sortingLog = [];

    $scope.sortableOptions = {
        handle: '> .myHandle',
        update: function (e, ui) {
            var logEntry = tmpList.map(function (i) { return i.value; }).join(', ');
            $scope.sortingLog.push('Update: ' + logEntry);
        },
        stop: function (e, ui) {
            // this callback has the changed model
            var logEntry = tmpList.map(function (i) { return i.value; }).join(', ');
            $scope.sortingLog.push('Stop: ' + logEntry);
        }
    };
});