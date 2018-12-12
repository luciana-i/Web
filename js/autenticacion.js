angular.module('miApp', ['ui.router', 'satellizer'])

	.controller('galeriaCtrl', function ($scope, $http, $auth, $state) {
		$scope.imagenes = [];
		var initImagenes = function () {
			$http.get('api/imagenes').then(function (response) {
				$scope.imagenes = response.data;
			})
		}
		initImagenes();
	})
	.controller('userCtrl', function ($scope, $http, $auth, $state) {
		$scope.usuarios = [];
		$scope.usuario = {
			nombre: '',
			mail: '',
			contrasenia: '',
			id_rol: ''
		};
		var initUsuarios = function () {
			$http.get('api/usuarios').then(function (response) {
				$scope.usuarios = response.data;
			})
		}
		$scope.eliminarUsuario = function (usuario) {
			$http.delete('api/usuarios/' + usuario.id)
				.then(function (response) {
					$timeout(function () {
						initUsuarios();
					}, 0);
				})
				.catch(function () {
					$timeout(function () {
						alert('Error borrando usuario');
					}, 0);
				});
		}
		$scope.guardarUsuarioEditado = function () {
			$http.patch('api/usuarios/' + $scope.usuario.id, $scope.usuario)
				.then(function (response) {
					$timeout(function () {
						initUsuarios();
					}, 0);

				})
				.catch(function () {
					$timeout(function () {
						alert('Error guardando usuario editado');
					}, 0);
				});

			$scope.cancelarUsuario = function () {
				$scope.usuario = {
					nombre: '',
					mail: '',
					contrasenia: '',
					id_rol: ''
				};
			}
			initUsuarios();
		}
		$scope.editarUsuario = function (usuario) {
			var id;
			$scope.nuevoUsuario = usuario;
			$scope.unUsuarioEditado = $scope.nuevoUsuario;

		}
	})

	.controller('muroCtrl', function ($scope, $http, $auth, $state) {
		$scope.rol = $auth.getPayload().rol;
		$scope.imagenesConComentarios = [];
		$scope.imagenes = [];
		$scope.imagenAux = {
			id_muro: '',
			id_usuario: '',
			path: '',
			url: '',
			fecha: ''
		};
		$scope.unaImagenVacia = {
			id_muro: '',
			id_usuario: '',
			path: '',
			url: '',
			fecha: ''
		};
		$scope.imagenEditada = {
			id_muro: '',
			id_usuario: '',
			path: '',
			url: '',
			fecha: ''
		};
		$scope.nuevaImagen = {
			id_muro: '',
			id_usuario: '',
			path: '',
			url: '',
			fecha: ''

		};
		///CONTROLLER DE COMENTARIOS
		$scope.comentarios = [];
		$scope.unComentarioEditado = {
			id_usuario: '',
			id_muro: '',
			descripcion: '',
			path_comentario: '',
			id_imagen: '',
			fecha: ''
		};
		$scope.nuevoComentario = {
			id_usuario: '',
			id_muro: '',
			descripcion: '',
			path_comentario: '',
			id_imagen: '',
			fecha: ''
		};
		$scope.unComentarioVacio = {
			id_usuario: '',
			id_muro: '',
			descripcion: '',
			path_comentario: '',
			id_imagen: '',
			fecha: ''
		};
		$scope.comentarioImagen = {
			id_usuario: '',
			id_muro: '',
			descripcion: '',
			path_comentario: '',
			id_imagen: '',
			fecha: ''
		};

		var initComentarios = function () {
			$http.get('api/comentarios').then(function (response) {
				$scope.comentarios = response.data;
			})
		}
		var fecha = function () {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!
			var yyyy = today.getFullYear();

			if (dd < 10) {
				dd = '0' + dd
			}

			if (mm < 10) {
				mm = '0' + mm
			}

			today = mm + '/' + dd + '/' + yyyy;
			return today;
		}

		$scope.guardarComentarioNuevo = function () {
			$scope.comentarioImagen['fecha'] = fecha;
			$scope.comentarioImagen.id_usuario = $auth.getPayload().id;
			if ($scope.unComentarioEditado === $scope.unComentarioVacio) {
				$http.post('api/comentarios ' + $scope.comentarioImagen.id, $scope.comentarioImagen)
					.then(function (response) {
						$timeout(function () {
							$scope.cancelarComentarioNuevo();
							initComentarios();
						}, 0);
					})
					.catch(function () {
						$timeout(function () {
							$scope.cancelarComentarioNuevo();
							alert('Error guardando nuevo Comentario');
						}, 0);
					});
			} else {
				$http.patch('api/comentarios/' + $scope.nuevoComentario.id, $scope.comentarioImagen)
					.then(function (response) {
						console.log(response.data);
						$timeout(function () {
							initComentarios();
						}, 0);
					})
					.catch(function () {
						$timeout(function () {
							alert('Error guardando comentarios editado');
						}, 0);
					});
			}

		}
		$scope.cancelarComentarioNuevo = function () {
			$scope.nuevoComentario = {
				id_usuario: '',
				id_muro: '',
				descripcion: '',
				path_comentario: '',
				id_imagen: ''
			};
		}


		$scope.editarComentario = function (Comentario) {

			$scope.nuevoComentario = Comentario;
			$scope.unComentarioEditado = $scope.nuevoComentario;

		}
		$scope.eliminarComentario = function (comentario) {
			$http.delete('api/Comentarios/' + comentario.id)
				.then(function (response) {
					$timeout(function () {
						initComentarios();
					}, 0);
				})
				.catch(function () {
					$timeout(function () {
						alert('Error borrando Comentario');
					}, 0);
				});
		}



		var initImagenes = function () {
			$http.get('api/imagenes').then(function (response) {
				$scope.imagenes = response.data;
			})
		}

		var MostrarImagenConComentarios = function () {
			debugger
			$http.get('api/imagenes/' + $auth.getPayload().id).then(function (response) {
				$scope.imagenesConComentarios = response.data;
			})
		}

		$scope.guardarImagenNueva = function () {
			const url = '/Web/api/index.php';
			const form = document.querySelector('form');
			// Listen for form submit
			form.addEventListener('submit', e => {
				e.preventDefault();
				// Gather files and begin FormData
				const files = document.querySelector('[type=file]').files;
				const formData = new FormData();
				// Append files to files array
				for (let i = 0; i < files.length; i++) {
					let file = files[i];

					formData.append('files[]', file);
				}

				/*   fetch(url, {
					   method: 'POST',
					   body: formData
				   }).then(response => {
					   console.log(response);
				   });*/

				if (JSON.stringify($scope.imagenEditada) == JSON.stringify($scope.unaImagenVacia)) { //si esta vacio es porque es nuevo
					$http.post('api/imagenes', $scope.nuevaImagen)
						.then(function (response) {
							$timeout(function () {
								$scope.cancelarImagenNueva();
								initImagenes();
							}, 0);
						})
						.catch(function () {
							$timeout(function () {
								$scope.cancelarImagenNueva();
								alert('Error guardando nueva imagen');
							}, 0);
						});
				} else {

					$http.patch('api/imagenes/' + id, $scope.nuevaImagen)
						.then(function (response) {
							$timeout(function () {
								initImagenes();
							}, 0);
						})
						.catch(function () {
							$timeout(function () {
								alert('Error guardando imagen editada');
							}, 0);
						});
				}
			});
		}


		$scope.cancelarImagenNueva = function () {
			$scope.nuevaImagen = {
				id_muro: '',
				id_usuario: '',
				path: '',
				url: ''
			};
		}

		$scope.editarImagen = function (imagen) {
			$scope.nuevaImagen = imagen;
			$scope.imagenEditada = $scope.nuevaImagen;
		}

		$scope.eliminarImagen = function (imagen) {
			$http.delete('api/imagenes/' + imagen.id)
				.then(function (response) {
					$timeout(function () {
						initImagenes();
					}, 0);
				})
				.catch(function () {
					$timeout(function () {
						alert('Error borrando imagen');
					}, 0);
				});
		}

		initImagenes();
		initComentarios();
		MostrarImagenConComentarios();
	})

	.controller('sistemaCtrl', function ($scope, $http, $auth, $state) {

		var initTexto = function () {
			$scope.texto = '';
			$scope.nombre = $auth.getPayload().nombre;

			$http.get('api/texto')
				.then(function (response) {
					$scope.texto = response.data;
				})
				.catch(function (response) {
					alert("Error del sistema");
				});
		}
		initTexto();
	})

	.run(function ($rootScope, $auth, $state) {
		$rootScope.rs_logout = function () {
			if (confirm("Desea salir del sistema?")) {
				$auth.logout();
				$auth.removeToken();
				$state.go('login');
			}
		}
	})

	.config(function ($stateProvider, $urlRouterProvider, $authProvider) {

		var rutaRelativa = window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/')) + '/';
		$authProvider.baseUrl = rutaRelativa;
		$authProvider.loginUrl = 'api/login';

		$stateProvider
			.state('main', {
				url: '/',
				templateUrl: 'vistas/login.html',
				controller: 'loginCtrl',
				resolve: {
					necesitaLogin: saltarSiLogueado
				},

			})
			.state('login', {
				url: '/login',
				templateUrl: 'vistas/login.html',
				controller: 'loginCtrl',
				resolve: {
					necesitaLogin: saltarSiLogueado
				},

			})
			.state('sistema', {
				url: '/sistema',
				templateUrl: 'vistas/sistema.html',
				controller: 'sistemaCtrl',
				resolve: {
					necesitaLogin: loginRequerido
				},
			})
			.state('galeria', {
				url: '/galeria',
				templateUrl: 'vistas/galeria.html',
				controller: 'galeriaCtrl',
				resolve: {
					necesitaLogin: loginRequerido
				},
			})
			.state('muro', {
				url: '/muro',
				templateUrl: 'vistas/muro.html',
				controller: 'muroCtrl',
				resolve: {
					necesitaLogin: loginRequerido
				},
			})
			.state('404', {
				url: '/404',
				templateUrl: 'vistas/404.html',
			})
			.state('users', {
				url: '/user',
				templateUrl: 'vistas/users.html',
				controller: 'userCtrl',
				resolve: {
					necesitaLogin: saltarSiUser
				}
			});

		$urlRouterProvider.otherwise("/404");

		function saltarSiLogueado($q, $auth) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				deferred.reject();
			} else {
				deferred.resolve();
			}
			return deferred.promise;
		}

		function saltarSiUser($q, $auth) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				if ($auth.getPayload().rol == 'user') {
					deferred.reject();
				} else {
					deferred.resolve();
				}
			} else {
				$location.path('/sistema');
			}
			return deferred.promise;
		}

		function loginRequerido($q, $auth, $location) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				deferred.resolve();
			} else {
				$location.path('/login');
			}
			return deferred.promise;
		}
	})