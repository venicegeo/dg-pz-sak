/*
 Copyright 2016, RadiantBlue Technologies, Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('LoginController', ['$scope', '$rootScope', '$sessionStorage', "$http", "discover", "toaster", "Auth", "CONST", "pzlogger", "uuid", "$location", LoginController]);

    function LoginController ($scope, $rootScope, $sessionStorage, $http, discover, toaster, Auth, CONST, pzlogger, uuid, $location) {
        $sessionStorage[CONST.auth] = Auth;
        var options = {
            backdrop: 'static',
            keyboard: false,
            show: true
        };
        // If you're not logged in and you didn't just logout
        if ($sessionStorage[CONST.auth][CONST.isLoggedIn] !== CONST.loggedIn) {
            $('#warningModal').modal(options);
        }

        $scope.login = function() {
            if (angular.isUndefined($scope.username) || $scope.username === "") {
                toaster.pop('error', 'Error', 'Please enter a username.');
                return;
            }
            if (angular.isUndefined($scope.password) || $scope.password === "") {
                toaster.pop('error', 'Error', 'Please enter a password.');
                return;
            }

            Auth.encode(
                $scope.username,
                $scope.password
            );

            $http({
                method: "GET",
                url: "/proxy/" + discover.securityHost + "/authentication",
                headers: {
                    "Authorization": "Basic " + Auth.id
                }
            }).then(function successCallback( html ) {

                $http({
                    method: "GET",
                    url: "/proxy/" + discover.securityHost + "/v2/key",
                    headers: {
                        "Authorization": "Basic " + Auth.id
                    }
                }).then(function successCallback( keyResponse ) {

                    if (keyResponse.data.uuid === null) {
                        Auth.encode(
                            $scope.username,
                            $scope.password
                        );
                        $http({
                            method: "POST",
                            url: "/proxy/" + discover.securityHost + "/v2/key",
                            headers: {
                                "Authorization": "Basic " + Auth.id
                            }
                        }).then(function successCallback( keyRequest ) {
                            console.log("needed to request a new key");
                            Auth.encode(keyRequest.data.uuid, "");
                        }).then(function errorCallback() {
                            console.log("error requesting key")
                            logout();
                        });
                    }

                    pzlogger.async(
                        CONST.informational,
                        html.data.userProfile.DN,
                        "loginSuccess",
                        "",
                        "User " + html.data.userProfile.username + " logged in successfully",
                        false
                    ).then(function () {
                        //$scope.resourceData = html.data.data;
                    }, function (){
                        //toaster.pop('error', "Error", "There was an issue with your request.");
                    });

                    Auth[CONST.isLoggedIn] = CONST.loggedIn;
                    if (keyResponse.data.uuid !== null) {
                        Auth.encode(keyResponse.data.uuid, "");
                    }
                    Auth.setUser(
                        html.data.userProfile.username,
                        html.data.userProfile.DN);
                    Auth.sessionId = uuid.generate();
                    $sessionStorage[CONST.auth] = Auth;
                    $location.path("/index");
                    $rootScope.$emit('loggedInEvent');

                }).then(function errorCallback( error ){
                    console.log("login.controller failed");
                    toaster.pop('error', "Error", "There was an issue retrieving your key.");
                });
            }, function errorCallback(response){
                console.log("login.controller failed");
                toaster.pop('error', "Error", "There was an issue logging in.");
            });

        };

    }

})();
