angular.module('miApp').controller('loginCtrl', function ($scope, $auth, $state, $http, $timeout) {
	$scope.nuevoUsuario = {
		nombre: '',
		mail: '',
		contrasenia: '',
		id_rol: 2
	};
	$scope.login = function () {
		$auth.login({
				"mail": $scope.mail,
				"contrasenia": $scope.contrasenia
			})
			.then(function (response) {
				$auth.setToken(response.data.jwt);
				$state.go('sistema');
			})
			.catch(function (response) {
				alert("Login incorrecto");
				$scope.mail = '';
				$scope.contrasenia = '';
			});
	};
	$scope.register = function () {
		$http.post('api/usuarios', $scope.nuevoUsuario)
			.then(function (response) {
				$timeout(function () {
					$scope.nuevoUsuario.nombre = '';
					$scope.nuevoUsuario.mail = '';
					$scope.nuevoUsuario.contrasenia = '';
					alert("Usuario creado, por favor inicia sesion");
				}, 0);
			})
			.catch(function () {
				$timeout(function () {
					$scope.cancelarUsuarioNuevo();
					alert('Error guardando nuevo usuario');
				}, 0);
			});

	};
});