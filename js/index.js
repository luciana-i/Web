angular.module('testApp',[]).controller('testCtrl', function($scope, $http) {
  $scope.usuarios= [];
    debugger
   // var initUsuarios = function(){
        $http.get('api/usuarios').then(function(response){
            console.log(response.data);
            $scope.usuarios = reresponse.data;
            debugger
        })

   // }
});