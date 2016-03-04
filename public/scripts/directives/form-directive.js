(function () {
    var app = angular.module('form-directive', []);

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
                    submitButton.attr("disabled", false);
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
            var emailVerify = document.verifyEmail($this.user.email);
            var passVerify = document.verifyPass($this.user.passwd);
            if ($this.user.uname == "") {
                $this.error = "Username can not be empty!";
            }
            else if (emailVerify) {
                $this.error = emailVerify;
            }
            else if ($this.user.passwd != $this.user.password) {
                $this.error = "Password and retyped password did not match.";
            }
            else if (passVerify) {
                $this.error = passVerify;
            }
            else {
                var regButton = $("register-user-button");
                regButton.attr('disabled', true);
                var req = $http.post('/auth/register', $this.user);
                req.success(function (res) {
                    $this.error = res.error;
                    if (!res.error) $window.location.href = '/';
                    regButton.attr('disabled', false);
                });
                req.error(function (err) {
                    $this.error = "Connection failed!";
                    regButton.attr('disabled', false);
                });
            }
        };
    });

    app.controller('ConfirmController', function ($http, $rootScope) {
        var $this = this;
        $this.error = null;
        $this.user = {
            id: $rootScope.user.id,
            email: $rootScope.user.email,
            confirmed: $rootScope.user.confirmed,
            code: null,
            scode: null
        };

        var checkButton = $("#confirm-check-button");
        var cofirmButton = $("#send-confirm-code-button");

        var handleError = function() {
            $this.error = "Connection failed!";
            cofirmButton.attr("disabled", false);
            checkButton.attr('disabled', false);
        }
        $this.checkCode = function () {
            $this.error = null;
            if ($this.user.code == $this.user.scode) {
                cofirmButton.attr("disabled", true);
                checkButton.attr('disabled', true);
                var req = $http.post('/auth/confirm', $this.user);
                req.success(function (res) {
                    cofirmButton.attr("disabled", false);
                    checkButton.attr('disabled', false);
                    if (res.error) $this.error = res.error;
                    else {
                        app.user.confirmed = true;
                        $("#access-modal").modal('hide');
                    }
                });
                req.error(handleError());
            }
        };

        $this.sendCode = function () {
            cofirmButton.attr("disabled", true);
            checkButton.attr('disabled', true);
            var req = $http.post('/auth/confirm', $this.user);
            req.success(function (res) {
                if (res.error)
                    $this.error = res.error;
                else {
                    $this.user.scode = res.scode;
                    $("#send-confirm-code-button").html("Resend Code!");
                }
                cofirmButton.attr("disabled", false);
                checkButton.attr('disabled', false);
            });
            req.error(handleError());
        };
    });

    app.controller('ChangePassController', function ($http, $rootScope) {
        var $this = this;
        $this.error = null;
        $this.user = {id: $rootScope.user.id, old: '', passwd: '', password: ''};

        $this.changePass = function () {
            var passVerify = document.verifyPass($this.user.passwd);
            if ($this.user.passwd != $this.user.password) {
                $this.error = "Password and retyped password did not match.";
            }
            else if (passVerify) {
                $this.error = passVerify;
            } else {
                var changePassButton = $('#change-pass-button');
                changePassButton.attr("disabled", true);
                var req = $http.post('/auth/change-pass', $this.user);
                req.success(function (res) {
                    $this.error = res.error;
                    if (!res.error) $("#access-modal").modal('hide');
                    changePassButton.attr("disabled", false);
                });
                req.error(function (err) {
                    $this.error = "Connection failed!";
                    changePassButton.attr("disabled", false);
                });
            }
        };
    });

})();