angular.module('miApp', ['ui.router', 'satellizer'])

	.controller('featuresCtrl', function ($scope, $http, $auth, $state) {
		var initTexto = function () {
			$scope.texto = 'Texto de features';
			$scope.nombre = 'Loco Features';
		}

		initTexto();
	})
	.controller('muroCtrl', function ($scope, $http, $auth, $state) {
			$scope.rol = $auth.getPayload().rol;
			 
			if ($auth.getPayload().rol == "admin") {
				$scope.usuarios = [];
				$scope.unUsuarioEditado = {
					nombre: '',
					mail: '',
					contrasenia: '',
					id_rol: ''
				};
				$scope.nuevoUsuario = {
					nombre: '',
					mail: '',
					contrasenia: '',
					id_rol: 2
				};
				$scope.usuarioVacio = {
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


				$scope.guardarUsuarioNuevo = function () {
					 
					if (JSON.stringify($scope.unUsuarioEditado) == JSON.stringify($scope.usuarioVacio)) {
						$http.post('api/usuarios', $scope.nuevoUsuario)
							.then(function (response) {
								$timeout(function () {
									$scope.cancelarUsuarioNuevo();
									initUsuarios();
								}, 0);
							})
							.catch(function () {
								$timeout(function () {
									$scope.cancelarUsuarioNuevo();
									alert('Error guardando nuevo usuario');
								}, 0);
							});
					} else {
						$http.patch('api/usuarios/' + $scope.nuevoUsuario.id, $scope.nuevoUsuario)
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
					}
				}


				$scope.cancelarUsuarioNuevo = function () {
					$scope.nuevoUsuario = {
						nombre: '',
						mail: '',
						contrasenia: '',
						id_rol: ''
					};
				}

				$scope.editarUsuario = function (usuario) {
					var id;
					$scope.nuevoUsuario = usuario;
					$scope.unUsuarioEditado = $scope.nuevoUsuario;

				}
				$scope.eliminarUsuario = function (usuario) {
					var id;
					$scope.usuarios.forEach(element => {
						if (element == usuario) {
							id = element.id;
						}

					});
					$http.delete('api/usuarios/' + id)
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

				initUsuarios();
			}

			$scope.imagenesConComentarios = [];
			$scope.imagenes = [];
			$scope.imagenAux = {
				id_muro: '',
				id_usuario: '',
				path: '',
				url: ''
			};
			$scope.unaImagenVacia = {
				id: '',
				id_muro: '',
				id_usuario: '',
				path: '',
				url: ''
			};
			$scope.imagenEditada = {
				id: '',
				id_muro: '',
				id_usuario: '',
				path: '',
				url: ''
			};
			$scope.nuevaImagen = {
				id_muro: '',
				id_usuario: '',
				path: '',
				url: ''
			};
			///CONTROLLER DE COMENTARIOS
			$scope.comentarios = [];
			$scope.unComentarioEditado = {
				id_usuario: '',
				id_muro: '',
				descripcion: '',
				path_comentario: '',
				id_imagen: ''
			};
			$scope.nuevoComentario = {
				id_usuario: '',
				id_muro: '',
				descripcion: '',
				path_comentario: '',
				id_imagen: ''
			};
			$scope.unComentarioVacio = {
				id_usuario: '',
				id_muro: '',
				descripcion: '',
				path_comentario: '',
				id_imagen: ''
			};
			$scope.comentarioImagen = {
				id_usuario: '',
				id_muro: '',
				descripcion: '',
				path_comentario: '',
				id_imagen: ''
			};

			var initComentarios = function () {
				$http.get('api/comentarios').then(function (response) {
					$scope.comentarios = response.data;
				})
			}


			$scope.guardarComentarioNuevo = function () {
				$scope.comentarioImagen.id_usuario=$auth.getPayload().id;
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
			.state('features', {
				url: '/features',
				templateUrl: 'vistas/features.html',
				controller: 'featuresCtrl',
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
		};

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

;
/*
			
			
			
			
	

*/