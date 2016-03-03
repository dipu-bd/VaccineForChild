(function () {
    var app = angular.module('home-directive', []);

    app.directive('homePage', function () {
            return {
                restrict: 'E',
                templateUrl: '/home',
                controllerAs: 'homeCtrl',
                controller: ['$http', '$compile', '$scope', HomeController]
            }
        }
    );

    function HomeController($http, $compile, $scope) {
        var accessModal = $('#access-modal');
        this.showRegister = function () {
            $http.get('/form/register').success(function (res) {
                accessModal.html($compile(res)($scope));
                accessModal.modal('show');
            });
        };
        this.showLogin = function () {
            $http.get('/form/login').success(function (res) {
                accessModal.html($compile(res)($scope));
                accessModal.modal('show');
            });
        };
        this.showConfirm = function () {
            $http.get('/form/confirm').success(function (res) {
                accessModal.html($compile(res)($scope));
                accessModal.modal('show');
            });
        }
    }
})();