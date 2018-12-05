angular.module('testApp', []).controller('testCtrl', function ($scope, $http, $timeout) {
  $scope.usuarios = [];
  $scope.unUsuarioVacio = {
    nombre: '',
    mail: '',
    contrasenia: ''
  };
  $scope.usuarioEditado = {
    nombre: '',
    mail: '',
    contrasenia: ''
  };
  $scope.nuevoUsuario = {
    nombre: '',
    mail: '',
    contrasenia: '',
    id_rol: 2
  };

  var initUsuarios = function () {
    $http.get('api/usuarios').then(function (response) {
      $scope.usuarios = response.data;

    })
  }

  $scope.guardarUsuarioNuevo = function () {
    // acá, tenes que diferenciar entre un usuario nuevo, y algo que ya cargaste con anterioridad

    // id = '' ? post : patch (TENES que saber que es lo que estas modificando)
    // PATCH api/usuarios/id/objetoUsuarioIncompleto
    if ($scope.usuarioEditado == $scope.unUsuarioVacio) {//si esta vacio es porque es nuevo
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
  $scope.usuarioEditado = {
    nombre: '',
    mail: '',
    contrasenia: '',
    id_rol: ''
  };
}

$scope.editar = function (usuario) {
  $scope.nuevoUsuario = usuario;
  $scope.usuarioEditado = $scope.nuevoUsuario;
}

$scope.eliminar = function (usuario) {
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

});