angular.module('testApp', []).controller('testCtrl', function ($scope, $http, $timeout) {
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
    debugger
    if (JSON.stringify($scope.unUsuarioEditado)==JSON.stringify($scope.usuarioVacio)) {
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
          debugger
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
  // Asignar el objeto usuario completo al modelo nuevoUsuario, el cuál
  // actualiza automaticamente el form.
  $scope.nuevoUsuario = usuario;
  $scope.unUsuarioEditado = $scope.nuevoUsuario;

  /*$scope.usuarios.forEach(element => {
    if (element==usuario){
    id= element.id;
  }
  });*/

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

});