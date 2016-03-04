(function () {
    var app = angular.module('VaccineApp', ['home-directive', 'form-directive']);

    //
    // CONTROLLERS
    //
    app.controller('AppController', function ($http, $compile, $rootScope) {
        var $this = this;

        // load properties
        $rootScope.property = {pageTitle: "Vaccine For Child"};
        $http.get("api/property").success(function (res) {
            $rootScope.property = res;
        });

        // load user info
        $rootScope.user = {uname: '...'};
        $http.get("api/user").success(function (res) {
            $rootScope.user = res;
        });

        // create modal forms
        var loginForm = null;
        var registerForm = null;
        var confirmForm = null;
        var changePassForm = null;
        $this.showLogin = function () {
            document.showModal(loginForm, "Login", true);
            if (!loginForm) {
                $http.get('/forms/login.html').success(function (res) {
                    loginForm = $compile(res)($rootScope);
                    document.showModal(loginForm, "Change Password", true);
                });
            }
        };
        $this.showRegister = function () {
            document.showModal(registerForm, "Register", true);
            if (!registerForm) {
                $http.get('/forms/register.html').success(function (res) {
                    registerForm = $compile(res)($rootScope);
                    document.showModal(registerForm, "Change Password", true);
                });
            }
        };
        $this.showConfirm = function () {
            document.showModal(confirmForm, "Confirm Email", true);
            if (!confirmForm) {
                $http.get('/forms/confirm.html').success(function (res) {
                    confirmForm = $compile(res)($rootScope);
                    document.showModal(confirmForm, "Change Password", true);
                });
            }
        };
        $this.showChangePass = function () {
            document.showModal(changePassForm, "Change Password", true);
            if (!changePassForm) {
                $http.get('/forms/change-pass.html').success(function (res) {
                    changePassForm = $compile(res)($rootScope);
                    document.showModal(changePassForm, "Change Password", true);
                });
            }
        };
    });

})();
