(function () {
    var app = angular.module('home-directive', []);

    app.directive('navBar', function () {
        return {
            restrict: 'E',
            templateUrl: '/component/nav-bar.html'
        }
    });
    app.directive('homePage', function () {
        return {
            restrict: 'E',
            templateUrl: '/home'
        }
    });
    app.directive('bottomBar', function () {
        return {
            restrict: 'E',
            templateUrl: '/component/bottom-bar.html',
        }
    });

})();