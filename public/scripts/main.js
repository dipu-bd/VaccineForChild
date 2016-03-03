(function () {
    var app = angular.module('VaccineApp', ['home-directive']);
    app.user = {};

    //
    // CONTROLLERS
    //
    app.controller('AppController', function ($http, $document) {
        var $this = this;
        $http.get("api/property").success(function (res) {
            $this.property = res;
        });
        $http.get("api/user").success(function (res) {
            $this.user = res;
            app.user = res;
        });
    });

    app.controller('LoginController', function ($http, $window) {
        var $this = this;
        $this.error = null;
        $this.user = {uname: '', passwd: '', remember: false};

        $this.login = function () {
            $this.error = null;
            if ($this.user.uname == "") {
                $this.error = "Username can not be empty!";
            }
            else if ($this.user.passwd == "") {
                $this.error = "Password can not be empty!";
            } else {
                var submitButton = $('#submit-login-button');
                submitButton.attr("disabled", true);
                var req = $http.post('/auth/login', $this.user);
                req.success(function (res) {
                    $this.error = res.error;
                    if (!res.error) $window.location.href = '/';
                });
                req.error(function (err) {
                    $this.error = "Connection failed!";
                    submitButton.attr("disabled", false);
                });
            }
        };
    });

    app.controller('RegisterController', function ($http, $window) {
        var $this = this;
        $this.error = null;
        $this.user = {uname: '', email: '', passwd: '', password: ''};

        $this.register = function () {
            if ($this.user.uname == "") {
                $this.error = "Username can not be empty!";
            }
            else if (document.verifyEmail($this.user.email)) {
                $this.error = document.verifyEmail($this.user.email);
            }
            else if ($this.user.passwd != $this.user.password) {
                $this.error = "Password and retyped password did not match.";
            }
            else if (document.verifyPass($this.user.passwd)) {
                $this.error = document.verifyPass($this.user.passwd);
            }
            else {
                var regButton = $("register-user-button");
                regButton.attr('disabled', true);
                var req = $http.post('/auth/register', $this.user);
                req.success(function (res) {
                    $this.error = res.error;
                    if (!res.error) $window.location.href = '/';
                });
                req.error(function (err) {
                    $this.error = "Connection failed!";
                    regButton.attr('disabled', false);
                });
            }
        };
    });

    app.controller('ConfirmController', function ($http, $document) {
        var $this = this;
        $this.error = null;
        $this.user = {
            id: app.user.id,
            email: app.user.email,
            confirmed: app.user.confirmed,
            code: null,
            scode: null
        };
        $this.checkCode = function () {
            if ($this.user.code == $this.user.scode) {
                $http.post('/auth/confirm', $this.user).success(function (res) {
                    if (res.error)
                        $this.error = res.error;
                    else
                        app.user.confirmed = true;
                });
            }
        };
        $this.sendCode = function () {
            var req = $http.post('/auth/confirm', $this.user);
            var cofirmButton = $("#send-confirm-code-button");
            cofirmButton.attr("disabled", true);
            req.success(function (res) {
                if (res.error)
                    $this.error = res.error;
                else {
                    $this.user.scode = res.scode;
                    $("#send-confirm-code-button").html("Resend Code!");
                }
                cofirmButton.attr("disabled", false);
            });
            req.error(function (err) {
                $this.error = "Connection failed!";
                cofirmButton.attr("disabled", false);
            });
        };
    });
})();
