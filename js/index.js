angular.module('testApp',[]).controller('testCtrl', function($scope, $http) {
    debugger;
    var initUsuarios = function(){
        $http.get('api/usuarios')
        .then(function(response){
            $scope.usuarios = response.data;
        })

    }
});