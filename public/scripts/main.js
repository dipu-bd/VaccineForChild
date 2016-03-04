(function () {
    var app = angular.module('VaccineApp', ['home-directive', 'form-directive']);

    app.run(function ($rootScope, $http) {
        // load properties
        $rootScope.loadProperties = function () {
            $rootScope.property = {pageTitle: "Vaccine For Child"};
            $http.get("api/property").success(function (res) {
                $rootScope.property = res;
            });
        };
        // load user info
        $rootScope.loadUserInfo = function () {
            $rootScope.user = {uname: '...'};
            $http.get("api/user").success(function (res) {
                $rootScope.user = res;
            })
        };
        // refresh page
        $rootScope.refreshPage = function () {
            $rootScope.loadProperties();
            $rootScope.loadUserInfo();
        };

        // pre-load
        $rootScope.refreshPage();
    });

    //
    // CONTROLLERS
    //
    app.controller('AppController', function ($http, $compile, $rootScope, $location) {

        $('#access-modal').on('hide.bs.modal', function () {
            window.location.hash = '';
        });

        var $this = this;
        var loginForm = null;
        var registerForm = null;
        var confirmForm = null;
        var changePassForm = null;
        // show modal forms
        $this.showLogin = function () {
            document.showModal(loginForm, "Login", true);
            if (!loginForm) {
                $http.get('/forms/login.html').success(function (res) {
                    loginForm = $compile(res)($rootScope);
                    document.showModal(loginForm, "Change Password", true);
                });
            }
            $location.hash('login');
        };
        $this.showRegister = function () {
            document.showModal(registerForm, "Register", true);
            if (!registerForm) {
                $http.get('/forms/register.html').success(function (res) {
                    registerForm = $compile(res)($rootScope);
                    document.showModal(registerForm, "Change Password", true);
                });
            }
            $location.hash('register');
        };
        $this.showConfirm = function () {
            document.showModal(confirmForm, "Confirm Email", true);
            if (!confirmForm) {
                $http.get('/forms/confirm.html').success(function (res) {
                    confirmForm = $compile(res)($rootScope);
                    document.showModal(confirmForm, "Change Password", true);
                });
            }
            $location.hash('confirm');
        };
        $this.showChangePass = function () {
            document.showModal(changePassForm, "Change Password", true);
            if (!changePassForm) {
                $http.get('/forms/change-pass.html').success(function (res) {
                    changePassForm = $compile(res)($rootScope);
                    document.showModal(changePassForm, "Change Password", true);
                });
            }
            $location.hash('change-pass');
        };
        $this.responseToHash = function () {
            switch ($location.hash()) {
                case 'login':
                    $this.showLogin();
                    break;
                case 'register':
                    $this.showRegister();
                    break;
                case 'confirm':
                    $this.showConfirm();
                    break;
                case 'change-pass':
                    $this.showChangePass();
                    break;
                default:
                    break;
            }
        };
        $this.responseToHash();
    });

})();
