angular.module('testApp',[]).controller('testCtrl', function($scope, $http, $timeout) {
  $scope.usuarios= [];
  $scope.unUsuarioEditado = { nombre: '', mail: '',  contrasenia: ''};
  $scope.nuevoUsuario = { nombre: '', mail: '',  contrasenia: '', id_rol: 2};

  var initUsuarios= function (){
        $http.get('api/usuarios').then(function(response){
            $scope.usuarios = response.data;        
        })
      }


      $scope.guardarUsuarioNuevo = function () {
        debugger
        $http.post('api/usuarios', $scope.nuevoUsuario )
          .then(function(response){
            $timeout(function() {
              $scope.cancelarUsuarioNuevo();
              initUsuarios();
            }, 0);
          })
          .catch(function(){
            $timeout(function() {
              $scope.cancelarUsuarioNuevo();
              alert('Error guardando nuevo usuario');
            }, 0);
          });
      }
      $scope.cancelarUsuarioNuevo = function () {
        $scope.nuevaPelicula = { nombre: '', mail: '',  contrasenia: '', id_rol: 2};
      }


      $scope.editar = function (usuario) {
      var id;
       $scope.usuarios.forEach(element => {
         if (element==usuario){
         id= element.id;
        }
       });
       $http.patch('api/usuarios/'+id, usuario )
          .then(function(response){
            $timeout(function() {
              initUsuarios();
            }, 0);
       })
          .catch(function(){
            $timeout(function() {
              alert('Error guardando usuario editado');
            }, 0);
          });
      }
      $scope.eliminar = function(usuario){
        var id;
        $scope.usuarios.forEach(element => {
          if (element==usuario){
          id= element.id;
          }
          
        });
        $http.delete('api/usuarios/'+ id)
            .then(function(response){
              $timeout(function() {
                initUsuarios();
              }, 0);
        })
            .catch(function(){
              $timeout(function() {
                alert('Error borrando usuario');
              }, 0);
        });
      }
    
initUsuarios();
 
});