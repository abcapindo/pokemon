var app = angular.module('pokemonApp', ['ngRoute', 'ui.bootstrap', 'chart.js']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/table.html',
            controller: 'tableCtrl'
        })
        .when('/pokemon/:id', {
            templateUrl: '/templates/pokemon.html',
            controller: 'pkmnCtrl'
        })
}]);

app.controller('tableCtrl', function($scope, $http, $rootScope) {
    $scope.sortBy = 0;
    $scope.start = 0;
    $scope.step = 10;
    $scope.maxSize = 10;
    $scope.asc = false;

    $scope.updateList = function(sortBy) {
        $scope.sortBy = sortBy;
        $scope.start = 0;
        $scope.currentPage = 1;
        $scope.sort();
    }

    $scope.sort = function() {
        var query = '/api/pokemon/' + $scope.start + "/" + $scope.step + "/" + $scope.sortBy;

        $http.get(query).then(function(result) {
            result = result.data
            pokemonList = result.list
            $rootScope.totalItems = result.hits
            var newList = []
            for (x in pokemonList) {
                newList.push({
                    name: pokemonList[x].name,
                    id: pokemonList[x].id,
                    attack: pokemonList[x].attack.stat,
                    defense: pokemonList[x].defense.stat,
                    special_attack: pokemonList[x].special_attack.stat,
                    special_defense: pokemonList[x].special_defense.stat,
                    speed: pokemonList[x].speed.stat,
                    hp: pokemonList[x].hp.stat,
                    types: typeSort(pokemonList[x].types)
                })
            }
            $scope.pokemonList = newList;
        });
    }

    typeSort = function(list) {
        var types = []
        for (i in list) {
            types.push("images/types/" + list[i].name + ".png");
        }
        return types;
    }

    $scope.currentPage = 1;

    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        var page = $scope.currentPage;
        var step = $scope.step;
        var newStart = page * step - 10;
        $scope.start = newStart;
        $scope.step = 10;
        $scope.sort();
    };

});

app.controller('pkmnCtrl', function($scope, $http, $rootScope, $routeParams) {
    $http.get('/api/search/pokemon/' + $routeParams["id"]).then(function(result) {
        // $scope.pkmnImage = "images/" + result.data.id + ".png"
        $scope.name = result.data.name
        $scope.id = result.data.id
        $scope.data = [
            result.data.attack.stat,
            result.data.defense.stat,
            result.data.special_attack.stat,
            result.data.special_defense.stat,
            result.data.speed.stat,
            result.data.hp.stat
        ]

    });

    $scope.chartOptions = {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: 5
                }
            }]
        }
    }
    $scope.labels = ['attack', 'defense', 'special attack', 'special defense', 'speed', 'hp'];
})
