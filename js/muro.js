angular.module('muroApp', []).controller('muroCtrl', function ($scope, $http, $timeout) {
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
debugger
    if ($scope.unComentarioEditado === $scope.unComentarioVacio) {
      $http.post('api/comentarios '+ $scope.comentarioImagen.id, $scope.comentarioImagen)
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
    debugger
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

  initComentarios();

  var initImagenes = function () {
    $http.get('api/imagenes').then(function (response) {
      $scope.imagenes = response.data;
    })
  }

  var MostrarImagenConComentarios = function () {
    $http.get('api/imagenes/' + 4).then(function (response) {
      $scope.imagenesConComentarios = response.data;
    })
  }

  $scope.guardarImagenNueva = function (id) {

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
      debugger
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
  /*  $scope.nuevaImagen["id"] = imagen["id"];
    $scope.nuevaImagen["id_usuario"] = imagen["id_usuario"];
    $scope.nuevaImagen["path"] = imagen["path"];
   // delete imagen["comentarios"];
   debugger
    imagen.forEach(item => {  delete item.comentarios;
    });*/

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
});