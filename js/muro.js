angular.module('muroApp', []).controller('muroCtrl', function ($scope, $http, $timeout) {
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

  var initComentarios = function () {
    $http.get('api/comentarios').then(function (response) {
      $scope.comentarios = response.data;
    })
  }


  $scope.guardarComentarioNuevo = function () {

    $http.post('api/comentarios ', $scope.nuevoComentario)
      .then(function (response) {
        $timeout(function () {
          $scope.cancelarComentarioNuevo();
          initComentarios();
        }, 0);
        debugger
      })
      .catch(function () {
        $timeout(function () {
          $scope.cancelarComentarioNuevo();
          alert('Error guardando nuevo Comentario');
        }, 0);
      });
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


  $scope.editar = function (Comentario) {
    var id;
    $scope.Comentarios.forEach(element => {
      if (element == Comentario) {
        id = element.id;
      }
    });
    $http.patch('api/Comentarios/' + id, Comentario)
      .then(function (response) {
        $timeout(function () {
          initComentarios();
        }, 0);
      })
      .catch(function () {
        $timeout(function () {
          alert('Error guardando Comentario editado');
        }, 0);
      });
  }
  $scope.eliminar = function (Comentario) {
    var id;
    $scope.Comentarios.forEach(element => {
      if (element == Comentario) {
        id = element.id;
      }

    });
    $http.delete('api/Comentarios/' + id)
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

  initComentarios();

});