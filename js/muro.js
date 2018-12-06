angular.module('muroApp', []).controller('muroCtrl', function ($scope, $http, $timeout) {

  $scope.imagenes = [];

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
  /* ///CONTROLLER DE COMENTARIOS
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

  var initComentarios = function () {
    $http.get('api/comentarios').then(function (response) {
      $scope.comentarios = response.data;
    })
  }


  $scope.guardarComentarioNuevo = function () {

    if ($scope.unComentarioEditado == $scope.unComentarioVacio) {
      $http.post('api/comentarios ', $scope.nuevoComentario)
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
    } else {////NO ANDA EL PATCH :(
      $http.patch('api/comentarios/' + $scope.nuevoComentario.id, $scope.nuevoComentario)
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


  $scope.editar = function (Comentario) {
    $scope.nuevoComentario = Comentario;
    $scope.unComentarioEditado = $scope.nuevoComentario;

  }
  $scope.eliminar = function (comentario) {
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

  initComentarios();
  */


  var initImagenes = function () {
    $http.get('api/imagenes').then(function (response) {
      $scope.imagenes = response.data;

    })
  }

  $scope.guardarImagenNueva = function () {
    debugger
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
      $http.patch('api/imagenes/' + $scope.nuevaImagen.id, $scope.nuevaImagen)
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
  }


  $scope.cancelarImagenNueva = function () {
    $scope.nuevaImagen = {
      id_muro: '',
      id_usuario: '',
      path: '',
      url: ''
    };
  }

  $scope.editar = function (imagen) {
    $scope.nuevaImagen = imagen;
    $scope.imagenEditada = $scope.nuevaImagen;
  }

  $scope.eliminar = function (imagen) {
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

});