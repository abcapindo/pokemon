var app = angular.module('pokemonApp', ['ngRoute', 'ui.bootstrap', 'chart.js']);

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// app.factory('colorFactory', function() {
//     return {
//         typeToColor: function(type) {
//             if
//         }
//     }
// })

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
                    name: pokemonList[x].name.capitalizeFirstLetter(),
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

app.controller('pkmnCtrl', function($scope, $http, $rootScope, $routeParams, $uibModal, $log) {
    $http.get('/api/search/pokemon/' + $routeParams["id"]).then(function(result) {
        $scope.name = result.data.name.capitalizeFirstLetter()
        $scope.id = result.data.id
        $scope.data = [
            result.data.attack.stat,
            result.data.defense.stat,
            result.data.special_attack.stat,
            result.data.special_defense.stat,
            result.data.speed.stat,
            result.data.hp.stat
        ]

        typeSort = function(list) {
            var types = []
            for (i in list) {
                types.push("images/types/" + list[i].name + ".png");
            }
            return types;
        }

        $scope.moveTypes = [{
            type: "Machine",
            list: result.data.machine
        }, {
            type: "Tutor Moves",
            list: result.data.tutorMoves
        }, {
            type: "Egg Moves",
            list: result.data.egg
        }];

        $scope.leveling = result.data.leveling;

        $scope.types = typeSort(result.data.types);
        $scope.abilities = result.data.abilities;
        $scope.color = result.data.types[0];

        $scope.animationsEnabled = true;

        $scope.open = function(id) {
            $log.log(id)
            $http.get('/api/move/' + id).then(function(result) {
                $scope.moveName = result.data.name

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: '',
                    resolve: {
                        data: function() {
                            return result.data;
                        }
                    }
                });
            });
        };
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
});

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, data) {
    $scope.data = data
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});
