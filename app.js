var mainApp = angular.module('app', ['ngRoute' , 'ngAnimate', 'chart.js']);
// Controller for game
mainApp.controller('ctrl', function($scope, $http, $routeParams) {
    $http.get("http://pokeapi.co/api/v2/pokemon/1").then(function(result) {
      $scope.name = result.data['name'];
      $scope.labels = ["HP", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];
      var stat = result.data['stats']
      $scope.data = [[stat[5]['base_stat'], stat[4]["base_stat"], stat[3]["base_stat"], stat[2]['base_stat'], stat[1]['base_stat'], stat[0]['base_stat']]];
      $scope.image = result.data["sprites"]["front_default"];
    });
});
