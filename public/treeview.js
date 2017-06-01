/**
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

(function() {
  var app, deps;

  deps = ['angularBootstrapNavTree', 'angularSpinners', 'openlayers-directive',
      'toaster', 'ui.router', 'ngStorage', 'angularUtils.directives.dirPagination', 'ngRoute'];

  if (angular.version.full.indexOf("1.2") >= 0) {
    deps.push('ngAnimate');
  }

  app = angular.module('SAKapp', deps );

  app.factory('CONST', function() {
      var CONSTANTS = {
          fatal: 2,
          error: 3,
          warning: 4,
          notice: 5,
          informational: 6,
          debug: 7,
          isLoggedIn: "aiDfl3sFi0af9lkI4KL0D",
          loggedIn: "idoIk.de4lE39EaseuKL2",
          auth: "eJwoK3bw9C*1GickqW0pnQ1"
      };
      return CONSTANTS;
  });

    app.factory('uuid', [function() {
        var cryptoObj = window.crypto || window.msCrypto;
        var uuidGenerator = {
            generate: function() {
                var d = Date.now();
                if(window.performance && typeof window.performance.now === "function"){
                    d += performance.now(); //use high-precision timer if available
                }
                var array = new Uint32Array(32);
                cryptoObj.getRandomValues(array);
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var randomValue = array[0] / 10000000000;
                    array = array.slice(1, array.length);
                    var r = (d + randomValue*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                });
                return uuid;            }
        };
        return uuidGenerator;
    }]);

    app.factory('Auth',function($sessionStorage, CONST) {
      var auth = {
          id : "",
          sessionId : "",
          userStore : "",
          userDN: "",
          encode : undefined,
          setUser: undefined
      };
      auth[CONST.isloggedIn] = "aoifjakslfia(KDlaiLS";

      var setUser = function(user, dn) {
          auth.userStore = user;
          auth.userDN = dn;
          return;
      };
      auth.setUser = setUser;
      var encode = function(user, pass) {
          var decodedString = user + ":" + pass;
          auth.id = b64EncodeUnicode(decodedString);
          return auth.id;
      };
      auth.encode = encode;
      function b64EncodeUnicode(str) {
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
              return String.fromCharCode('0x' + p1);
          }));
      }
      if ((angular.isDefined($sessionStorage[CONST.auth]) &&
            $sessionStorage[CONST.auth][CONST.isLoggedIn] === CONST.loggedIn)) {
          auth.id = $sessionStorage[CONST.auth].id;
          auth.userStore = $sessionStorage[CONST.auth].userStore;
          auth.userDN = $sessionStorage[CONST.auth].userDN;
          auth.sessionId = $sessionStorage[CONST.auth].sessionId;
          auth[CONST.isLoggedIn] = CONST.loggedIn;
      }
      return auth;
  });

  app.controller('SAKappController', function($scope, $rootScope, $timeout, $http, Auth, CONST, $sessionStorage, $location, pzlogger) {
    $scope.auth = Auth;
    $scope.util = CONST;
    $scope.year = (new Date()).getFullYear();

    var idleTime = 0;
    var idleInterval;

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });

    function timerIncrement() {
      if (Auth[CONST.isLoggedIn] === CONST.loggedIn) {
        idleTime = idleTime + 1;
        if (idleTime > 14) {
            // Calling $scope.logout directly doesn't forward to the login page
            angular.element("#logoutButton").triggerHandler('click');
        }
      }
    }

    //Increment the idle time counter every minute.
    function startIdleTimer() {
        idleTime = 0;
        return setInterval(timerIncrement, 60000);
    }

    function stopIdleTimer() {
        clearInterval(idleInterval);
    }

    $rootScope.$on('loggedInEvent', function(event, args){
        idleInterval = startIdleTimer();
    });

    var tree, treedata_avm;
    $scope.my_tree_handler = function(branch) {
      var _ref;

    };


    treedata_avm = [
        {
            label: 'Home',
            onSelect: function(branch) {
                return $scope.bodyDiv = "app/home/home.tpl.html";
            }

        },
        {
        label: 'Access',
        onSelect: function(branch) {
                     return $scope.bodyDiv = "app/access/access.tpl.html";
                  },

        children: [
        {
        label: 'Admin',
          onSelect: function(branch) {
            return $scope.bodyDiv = "app/access/access.admin.tpl.html";
          }
        }
        ]

        },

      {
        label: 'Jobs',
        onSelect: function(branch) {
          return $scope.bodyDiv = "app/jobs/jobs.tpl.html";
        },

        children: [
          {
            label: 'Admin',
              onSelect: function(branch) {
                  return $scope.bodyDiv = "app/jobs/jobs.admin.tpl.html";
              }
          }
        ]

      },
        {
            label: 'Loader',
            onSelect: function(branch) {
                return $scope.bodyDiv = "app/ingester/ingester.tpl.html";
            },

            children: [
                {
                    label: 'Admin'
                }
            ]

        },
      {
        label: 'Logger',
        onSelect: function(branch) {
          return $scope.bodyDiv = "app/logger/logger.tpl.html";
        },

        children: [
          {
            label: 'Admin',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/logger/logger.admin.tpl.html";
            }
          }
        ]

      },
      {
        label: 'Name Server',
        onSelect: function(branch) {
          return $scope.bodyDiv = "app/name-server/name-server.tpl.html";
        },

        children: [
          {
            label: 'Admin'
          }
        ]
      },
        {
        label: 'Search',
                onSelect: function(branch) {
                     return $scope.bodyDiv = "app/search/search.tpl.html";
                  },

        children: [
        {
        label: 'Admin',
              onSelect: function(branch) {
                return $scope.bodyDiv = "app/search/search.admin.tpl.html";
              }
        }
        ]

        },
        {
        label: 'User Service Registry',
                onSelect: function(branch) {
                     return $scope.bodyDiv = "app/user-service-registry/user-service-registry.tpl.html";
                },

        children: [
        {
        label: 'Admin',
                onSelect: function(branch) {
                    return $scope.bodyDiv = "app/user-service-registry/user-service-registry.admin.tpl.html";
              }
        }
        ]

        },
        {
        label: 'Workflow',
          onSelect: function(branch) {
            branch.expanded = !branch.expanded;
          },

        children: [
            {
                label: 'Event Types',
                onSelect: function(branch) {
                    return $scope.bodyDiv = "app/workflow/eventtypes.tpl.html";
                }
            },
          {
            label: 'Events',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/events.tpl.html";
            }
          },
          {
            label: 'Alerts',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/alerts.tpl.html";
            }
          },
          {
            label: 'Triggers',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/triggers.tpl.html";
            }
          },
          {
            label: 'Admin',
            onSelect: function(branch) {
              return $scope.bodyDiv = "app/workflow/workflow.admin.tpl.html";
            }
          }
        ]

        },

      {
        label: 'WFS',
        onSelect: function(branch) {
          return $scope.bodyDiv = "app/wfs/wfs.tpl.html";
        }


      }, {
        label: 'WMS',
        onSelect: function(branch) {
          return $scope.bodyDiv = "app/wms/wms.tpl.html";
        }



      },
        {
            label: 'About',
            onSelect: function(branch) {
                return $scope.bodyDiv = "app/about/about.tpl.html";
            }

        }
    ];

    $scope.logout = function() {
        pzlogger.async(
            CONST.informational,
            Auth.userDN,
            "logoutSuccess",
            "",
            "User " + Auth.userStore + " logged out successfully",
            false
        ).then(function () {
            //$scope.resourceData = html.data.data;
        }, function (){
            //toaster.pop('error', "Error", "There was an issue with your request.");
        });

        Auth[CONST.isLoggedIn] = "aiefjkd39dkal3ladfljfk2kKA3kd";
        Auth.encode("null", "null");
        Auth.setUser("", "");
        Auth.sessionId = undefined;
        $sessionStorage[CONST.auth] = Auth;
        stopIdleTimer();
    };

    $scope.my_data = treedata_avm;

    $scope.my_tree = tree = {};
    $scope.try_async_load = function() {
      $scope.my_data = [];
      $scope.doing_async = true;

    };

      $http({
              method: "GET",
              url: "/banner.json"
          }
      ).then(function successCallback(response){
          $scope.bannerText = response.data.bannerText;
          $scope.bannerStyle={
              'background-color': response.data.bannerBackgroundColor,
              'color': response.data.bannerColor
          };
          if ($scope.bannerText != "") {
              $scope.pageStyle = {
                  'margin-bottom': '-40px',
                  'min-height': '99%'
              }
          } else {
              $scope.pageStyle = {}
          }
      }, function errorCallback(){
          console.log("banner info not set")
      });
  });

  app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1) : '';
    };
  });

  app.filter('utc', function() {
      return function(input) {
          // Multiply the result by 1000 because a unix timestamp is SECONDS since epoch
          return (!!input) ? moment.utc(input * 1000).toISOString() : '';
      };
  });

  app.filter('severity', function() {
      return function(input) {
          if (!!input) {
              switch (input) {
                  case 2: return 'Critical';
                  case 3: return 'Error';
                  case 4: return 'Warning';
                  case 5: return 'Notice';
                  case 6: return 'Info';
                  case 7: return 'Debug';
                  default: return '';
              }
          } else {
              return '';
          }
      };
  });

  app.config(function($stateProvider, $urlRouterProvider, $routeProvider)
  {
      $routeProvider
             .when('/geoaxis', {

                 template: '/login.html',
                 controller: function ($scope,$location,$rootScope,$http,discover,Auth,$sessionStorage,CONST,pzlogger,gateway,toaster, uuid) {
                     $rootScope.accesstoken = $location.search();
                     var redirectUrl = "https://" + discover.sak + "/geoaxis";
                     $http.post(
                         "/responseProxy?code=" + $rootScope.accesstoken.code + "&url=" + redirectUrl,
                         null
                     ).then(
                        function(res) {
                            $http.get(
                                "/profileProxy",
                                {
                                    "headers": {
                                        "Authorization": res.data.access_token
                                    }
                                }
                            ).then(function(userProfileResponse) {
                                // actually get the user's data here
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
                                    Auth.id = $sessionStorage[CONST.auth].id;
                                    Auth[CONST.isLoggedIn] = CONST.loggedIn;
                                    Auth.setUser(
                                        userProfileResponse.data.username,
                                        userProfileResponse.data.DN);
                                    Auth.sessionId = uuid.generate();
                                    $sessionStorage[CONST.auth] = Auth;
                                    $location.path("/index");
                                    $rootScope.$emit('loggedInEvent');
                                },
                            function(res){
                                // error
                                pzlogger.async(
                                    CONST.warning,
                                    $sessionStorage[CONST.auth].id,
                                    "loginFailure",
                                    "",
                                    "User login failed",
                                    false
                                ).then(function () {
                                    //$scope.resourceData = html.data.data;
                                }, function (){
                                    //toaster.pop('error', "Error", "There was an issue with your request.");
                                });
                                Auth[CONST.isLoggedIn] = "aiefjkd39dkal3ladfljfk2kKA3kd";
                                Auth.encode("null", "null");
                                Auth.setUser("", "");
                                Auth.sessionId = undefined;
                                $sessionStorage[CONST.auth] = Auth;
                                $scope.logoutMessage = "An error occurred during login";
                                $location.path("/login");
                            });
                        },
                        function(res){
                            // error
                            pzlogger.async(
                                CONST.warning,
                                $sessionStorage[CONST.auth].id,
                                "loginFailure",
                                "",
                                "User login failed",
                                false
                            ).then(function () {
                                //$scope.resourceData = html.data.data;
                            }, function (){
                                //toaster.pop('error', "Error", "There was an issue with your request.");
                            });
                            Auth[CONST.isLoggedIn] = "aiefjkd39dkal3ladfljfk2kKA3kd";
                            Auth.encode("null", "null");
                            Auth.setUser("", "");
                            Auth.sessionId = undefined;
                            $sessionStorage[CONST.auth] = Auth;
                            $scope.logoutMessage = "An error occurred during login";
                            $location.path("/login");
                        });
               }
             })
             .when('/', {
                 template: 'login.html',
                 controller: function (Auth,CONST,$location) {
                     // What to do with the response from second request
                     if (Auth[CONST.isLoggedIn] === CONST.loggedIn) {
                         $location.path("/index");
                     } else {
                         $location.path("/login");
                     }
                 }
             });

      $stateProvider
      // available for anybody
          .state('login',{
              url : '/login',
              templateUrl : '/login.html',
              controller: 'LoginController'
          })
          // just for authenticated
          .state('index',{
              url : '/index',
              templateUrl : '/index.html',
              data : {requireLogin : true }
          });
  });


    app.run(function ($rootScope, $state, $location, Auth, CONST) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {

            var shouldLogin = toState.data !== undefined
                && toState.data.requireLogin
                && Auth[CONST.isLoggedIn] !== CONST.loggedIn;

            // NOT authenticated - wants any private stuff
            if (shouldLogin) {
                $state.go('login');
                event.preventDefault();
                return;
            }


            // authenticated previously
            if (Auth[CONST.isLoggedIn] === CONST.loggedIn) {
                var shouldGoToIndex = fromState.name === ""
                    && toState.name !== "login";
                    // Used to be index, but that caused problems with tabs && toState.name !== "index";

                if (shouldGoToIndex) {
                    // Used to be index, but that caused problems with tabs $state.go('index');
                    $state.go('login');
                    event.preventDefault();
                }
                return;
            }

            // Unauthenticated previously
            var shouldGoToLogin = fromState.name === ""
                && toState.name !== "login";

            if (shouldGoToLogin) {
                $state.go('login');
                event.preventDefault();
            }

            // unmanaged
        });
    });



  app.factory('discover', [function() {
    var hostname;
    if (window.location.hostname == "localhost") {
        hostname = config.defaultDomain;
    } else {
        var firstDotIndex = window.location.hostname.indexOf(".");
        hostname = window.location.hostname.substring(firstDotIndex);
    }

    var CORE_SERVICE = "core-service";
    var discover = {
          loggerHost : "pz-logger" + hostname,
          loggerType : CORE_SERVICE,
          loggerPort : "",
          workflowHost : "pz-workflow" + hostname,
          workflowType : CORE_SERVICE,
          workflowPort : "",
          searchHost : "pz-search-query" + hostname,
          searchType : CORE_SERVICE,
          searchPort : "",
          serviceControllerHost : "pz-servicecontroller" + hostname,
          serviceControllerType : CORE_SERVICE,
          serviceControllerPort : "",
          gatewayHost : "pz-gateway" + hostname,
          gatewayType : CORE_SERVICE,
          gatewayPort : "",
          accessHost : "pz-access" + hostname,
          accessType : CORE_SERVICE,
          accessPort : "",
          jobsHost : "pz-jobmanager" + hostname,
          jobsType : CORE_SERVICE,
          jobsPort : "",
          securityHost : "pz-idam" + hostname,
          securityType : CORE_SERVICE,
          securityPort : "",
          swaggerUI : "pz-swagger" + hostname,
          docs : "pz-docs" + hostname,
          sak : "pz-sak" + hostname
    };
    return discover;

  }]);

    app.factory('settings', [function() {
        var settings = {
            elasticSearchLimit : 10000
        };
        return settings;
    }]);

  app.factory('gateway', ['$http', 'discover', 'Auth',  function($http, discover, Auth) {
      var gateway = {
          async: function(method, endPoint, body, params, fixTransform) {
              var httpObject = {
                  method: method,
                  url: "/proxy/" + discover.gatewayHost + endPoint,
                  headers: {
                      "Authorization": "Basic " + Auth.id
                  }
              };
              if (angular.isDefined(body)) {
                  angular.extend(httpObject, {
                      data: body
                  });
              }
              if (angular.isDefined(params)) {
                  angular.extend(httpObject, {
                      params: params
                  });
              }
              if (fixTransform) {
                  angular.extend(httpObject, {
                      transformResponse: function(value){
                          return value;
                      }
                  });
              }
              var promise = $http(httpObject);
              return promise;
          }
      };
      return gateway;
  }]);

    app.factory('pzlogger', ['$http', 'discover',  function($http, discover) {
        var pzlogger = {
            async: function(severity, actor, action, actee, message, fixTransform) {
                var httpObject = {
                    method: "POST",
                    url: "/proxy/" + discover.loggerHost + "/syslog"
                };
                var body = {
                        "severity": severity,
                        "facility": 1,
                        "version": 1,
                        "timeStamp": moment().utc().toISOString(),
                        "application": "pz-sak",
                        "hostName": discover.sak,
                        "process": "sak-nginx",
                        "auditData": {
                            "actor": actor,
                            "action": action,
                            "actee": actee
                        },
                        "message": message
                    };

                if (angular.isDefined(body)) {
                    angular.extend(httpObject, {
                        data: body
                    });
                }
                if (fixTransform) {
                    angular.extend(httpObject, {
                        transformResponse: function(value){
                            return value;
                        }
                    });
                }
                var promise = $http(httpObject);
                return promise;
            }
        };
        return pzlogger;
    }]);


}).call(this);
