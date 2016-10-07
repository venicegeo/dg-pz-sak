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

'use strict';

describe('Controller: HomeController', function () {

    var $httpBackend,
        loggerRequestHandler,
        uuidRequestHandler,
        workflowRequestHandler,
        searchRequestHandler,
        serviceControllerRequestHandler,
        gatewayRequestHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var HomeController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        // $cookies = $injector.get('$cookies');
        // $cookies.putObject('auth', '{isLoggedIn:true}');
        $httpBackend = $injector.get('$httpBackend');
        loggerRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-logger.int.geointservices.io/').respond(
            {
                "statusCode": 200,
                "type": "string",
                "data": "Hi. I'm pz-logger."
            }
        );
        uuidRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-uuidgen.int.geointservices.io/').respond(
            {
                "statusCode": 200,
                "data": "Hi. I'm pz-uuidgen."
            }
        );
        workflowRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-workflow.int.geointservices.io/').respond(
            {
                "statusCode": 200,
                "data": "Hi! I'm pz-workflow."
            }
        );
        searchRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-search-query.int.geointservices.io/').respond(
            "Hello Piazza Search Query! DSL-input endpoint at /api/v1/datafull"
        );
        serviceControllerRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-servicecontroller.int.geointservices.io/').respond(
            "servicecontroller ok"
        );
        gatewayRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/').respond(
            "Hello, Health Check here for pz-gateway."
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        HomeController = $controller('HomeController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get the running services', function () {
        scope.getRunningServices();
        $httpBackend.flush();
        expect(scope.services.loggerHost).toBe("pz-logger.int.geointservices.io");
    });

    it('should get health checks', function () {
        scope.getStatuses();
        $httpBackend.expectGET('/proxy/pz-logger.int.geointservices.io/');
        $httpBackend.expectGET('/proxy/pz-uuidgen.int.geointservices.io/');
        $httpBackend.expectGET('/proxy/pz-workflow.int.geointservices.io/');
        $httpBackend.expectGET('/proxy/pz-search-query.int.geointservices.io/');
        $httpBackend.expectGET('/proxy/pz-servicecontroller.int.geointservices.io/');
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/');
        $httpBackend.flush();
        expect(scope.loggerStatus).toBe("green");
        expect(scope.uuidStatus).toBe("green");
        expect(scope.workflowStatus).toBe("green");
        expect(scope.searchStatus).toBe("green");
        expect(scope.serviceControllerStatus).toBe("green");
        expect(scope.gatewayStatus).toBe("green");
    });

});