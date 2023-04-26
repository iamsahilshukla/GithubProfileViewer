angular.module('githubProfileViewer', ['ngRoute', 'ngMaterial'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'search-profiles.html',
                controller: 'SearchProfilesCtrl as search'
            })
            .when('/profile/:username', {
                templateUrl: 'view-profile.html',
                controller: 'ViewProfileCtrl as view'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .controller('SearchProfilesCtrl', function ($http, $location) {
        var vm = this;

        vm.searchUsername = '';
        vm.searchResults = [];

        vm.searchProfiles = function () {
            $http.get('https://api.github.com/search/users?q=' + vm.searchUsername)
                .then(function (response) {
                    vm.searchResults = response.data.items;
                });
        };

        vm.viewProfile = function (username) {
            var encodedUsername = encodeURIComponent(username);
            $location.path('/profile/' + encodedUsername);
        };

    })
    .controller('ViewProfileCtrl', function ($http, $routeParams) {
        var vm = this;

        vm.username = $routeParams.username;
        vm.profile = {};
        vm.repositories = [];
        console.log(vm.username);
        $http.get('https://api.github.com/users/' + vm.username)
            .then(function (response) {
                vm.profile = response.data;
            })
            .catch(function (error) {
                console.error(error);
            });


        $http.get('https://api.github.com/users/' + vm.username + '/repos')
            .then(function (response) {
                vm.repositories = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    });
