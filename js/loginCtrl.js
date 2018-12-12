angular.module('miApp').controller('loginCtrl', function($scope, $auth, $state) {
	$scope.login = function(){
		$auth.login({"mail": $scope.mail, "contrasenia": $scope.contrasenia }) 
			.then(function(response) {
				$auth.setToken(response.data.jwt);
				$state.go('sistema');
			})
			.catch(function(response) {
				alert("Login incorrecto");
				$scope.mail = '';
				$scope.contrasenia = '';
			});
	};
});