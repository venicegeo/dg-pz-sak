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
        .controller('LoginController', ['$scope', '$sessionStorage', "discover", "toaster", "Auth", "CONST", LoginController]);

    function LoginController ($scope, $sessionStorage, discover, toaster, Auth, CONST) {
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
            if (angular.isUndefined($scope.apikey) || $scope.apikey === "") {
                toaster.pop('error', 'Error', 'Please enter an api key.');
                return;
            }
            if (angular.isUndefined($scope.username) || $scope.username === "") {
                toaster.pop('error', 'Error', 'Please enter a username.');
                return;
            }
            if (angular.isUndefined($scope.password) || $scope.password === "") {
                toaster.pop('error', 'Error', 'Please enter a password.');
                return;
            }
            pzlogger.async(
                CONST.informational,
                userProfileResponse.data.DN,
                "loginSuccess",
                "",
                "User " + userProfileResponse.data.username + " logged in successfully",
                false
            ).then(function () {
                //$scope.resourceData = html.data.data;
            }, function (){
                //toaster.pop('error', "Error", "There was an issue with your request.");
            });
            //Auth.id = $sessionStorage[CONST.auth].id;
            Auth[CONST.isLoggedIn] = CONST.loggedIn;
            Auth.encode($scope.apikey, "");
            Auth.setUser(
                userProfileResponse.data.username,
                userProfileResponse.data.DN);
            Auth.sessionId = uuid.generate();
            $sessionStorage[CONST.auth] = Auth;
            $location.path("/index");
            $rootScope.$emit('loggedInEvent');

        };

    }

})();