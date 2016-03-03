(function () {
    var app = angular.module('VaccineApp', []);

    //
    // CONTROLLERS
    //
    app.controller('AppController', ['$http', function ($http) {
        var $scope = this;
        $http.get("api/property").success(function (res) {
            $scope.property = res;
        });
    }]);

    //
    // DIRECTIVES
    //
    app.directive('homePage', function () {
        return {
            restrict: 'E',
            templateUrl: '/home'
        };
    });

})();
