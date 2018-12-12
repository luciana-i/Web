<?php

define('ALGORITMO', 'HS512'); // Algoritmo de codificación/firma
define('SECRET_KEY', 'AS..-.DJKLds·ak$dl%Ll!3kj12l3k1sa4_ÑÑ312ñ12LK3Jj4DK5A6LS7JDLK¿?asDqiwUEASDL,NMQWIEUIO'); //String largo y "complicado"

require_once('jwt_helper.php');
require_once('config.php');

$bd = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);


$metodo = strtolower($_SERVER['REQUEST_METHOD']);
$comandos = explode('/', strtolower($_GET['value']));
$funcionNombre = $metodo . ucfirst($comandos[0]);

$parametros = array_slice($comandos, 1);
if (count($parametros) > 0 && $metodo == 'get')
  $funcionNombre = $funcionNombre . 'ConParametros';


if (function_exists($funcionNombre))
  call_user_func_array($funcionNombre, $parametros);
else
  header(' ', true, 400);
  

/// JWT

function postLogin()
{
  $loginData = json_decode(file_get_contents("php://input"), true);
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  $mail = $loginData['mail'];
  $query = mysqli_query($link, "SELECT usuario.id, contrasenia, mail, usuario.nombre, rol.rol FROM usuario INNER JOIN rol ON usuario.id_rol = rol.id WHERE mail = '$mail'");
  $contrasenia = '';
  $nombre = '';
  $rol = 0;
  $id = 0;
  while ($usuario = mysqli_fetch_assoc($query)) {

    $contrasenia = $usuario['contrasenia'];
    $nombre = $usuario['nombre'];
    $rol = $usuario['rol'];
    $id = $usuario['id'];

  }

  if ($query && $contrasenia == $loginData['contrasenia']) {
    $data = [
      'nombre' => $nombre,
      'mail' => $loginData['mail'],
      'rol' => $rol,
      'id' => $id,
    ];

    $jwt = JWT::encode(
      $data,      // Datos a codificar en el JWT
      SECRET_KEY, // Clave de coficicación/firma del token
      ALGORITMO   // Algoritmo usado para codificar/firmar el token
    );

    $arregloToken = ['jwt' => $jwt];

    header(' ', true, 200);
    header('Content-type: application/json');
    echo json_encode($arregloToken);
  } else {
    header(' ', true, 401);
  }
}

function getTexto()
{

  $authHeader = getallheaders();

  if (isset($authHeader['Authorization'])) {

    list($jwt) = sscanf($authHeader['Authorization'], 'Bearer %s');
    try {
      $token = JWT::decode($jwt, SECRET_KEY, ALGORITMO);

      header(' ', true, 200);
      header('Content-type: application/json');
      echo json_encode('Bienvenido a la pagina donde podrás compartir fotos con tus amigos, hazte nuevos amigos y comparte!');
    } catch (Exception $e) {
      header(' ', true, 401);
    }

  } else {
    header(' ', true, 401);
  }
}


///GET  

function getUsuarios()
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $query = mysqli_query($link, "SELECT * FROM usuario");
  $usuarios = [];
  while ($usuario = mysqli_fetch_assoc($query)) {
    $usuarios[] = $usuario;
  }
  header('Content-Type: application/json');
  print json_encode($usuarios);
  mysqli_free_result($query);
  mysqli_close($link);
}

function getUsuariosConParametros($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $query = mysqli_query($link, "SELECT * FROM usuario WHERE id = $id");

  if ($usuario = mysqli_fetch_assoc($query)) {
    header('Content-Type: application/json');
    print json_encode($usuario);
  } else {
    header(' ', true, 404);
  }
  mysqli_free_result($query);
  mysqli_close($link);
}
///POST

function postUsuarios()
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $usuario = json_decode(file_get_contents('php://input'), true);
  $nombre = mysqli_real_escape_string($link, $usuario['nombre']);
  $mail = mysqli_real_escape_string($link, $usuario['mail']);
  $contrasenia = mysqli_real_escape_string($link, $usuario['contrasenia']);
  $q = ("INSERT INTO usuario (nombre, mail, contrasenia, id_rol) VALUES ('$nombre', '$mail', '$contrasenia', 2)");
  $query = mysqli_query($link, $q);
  if ($query) {
    header(' ', true, 201);
  } else {
    header(' ', true, 500);
  }
  mysqli_close($link);
}
///GET CON PARAMETROS///


function patchUsuarios($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $id = $id + 0;
  $usuario = json_decode(file_get_contents('php://input'), true);
  $nombre = mysqli_real_escape_string($link, $usuario['nombre']);
  $mail = mysqli_real_escape_string($link, $usuario['mail']);
  $contrasenia = mysqli_real_escape_string($link, $usuario['contrasenia']);

  $usuario = json_decode(file_get_contents('php://input'), true);

  $q = "UPDATE usuario SET nombre ='$nombre', mail='$mail', contrasenia='$contrasenia' WHERE id=$id";
  $query = mysqli_query($link, $q);
  if ($query) {
    header(' ', true, 201);
  } else {
    header(' ', true, 500);
  }
  mysqli_close($link);
}

function deleteUsuarios($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $id = $id + 0;
  $queryComentarios = "DELETE FROM comentario WHERE id_usuario=$id";
  $resComentarios = mysqli_query($link, $queryComentarios);
  $queryImagnes = "DELETE FROM imagen WHERE id_usuario=$id";
  $resImagenes = mysqli_query($link, $queryImagenes);
  $query = "DELETE FROM usuario WHERE id=$id";

  $res = mysqli_query($link, $query);
  if ($res || $resComentarios || $resImagenes) {
    header(' ', true, 201);
  } else {
    header(' ', true, 500);
  }
  mysqli_close($link);
} 

////COMENTARIOS:
function getComentarios()
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $query = mysqli_query($link, "SELECT * FROM comentario");
  $comentarios = [];
  while ($comentario = mysqli_fetch_assoc($query)) {
    $comentarios[] = $comentario;
  }
  header('Content-Type: application/json');
  print json_encode($comentarios);
  mysqli_free_result($query);
  mysqli_close($link);
}

function getComentariosConParametros($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  $id = $id + 0;
  mysqli_set_charset($link, 'utf8');
  $query = mysqli_query($link, "SELECT * FROM comentario WHERE id_imagen=$id");
  $comentarios = [];
  while ($comentario = mysqli_fetch_assoc($query)) {
    $comentarios[] = $comentario;
  }
  header('Content-Type: application/json');
  print json_encode($comentarios);
  mysqli_free_result($query);
  mysqli_close($link);
}

function postComentarios($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $comentario = json_decode(file_get_contents('php://input'), true);
  $id_usuario = mysqli_real_escape_string($link, $comentario['id_usuario']);
  $descripcion = mysqli_real_escape_string($link, $comentario['descripcion']);
  $fecha = mysqli_real_escape_string($link, $comentario['fecha']);
  $id_imagen = $id + 0;

  if (isset($comentario['path_comentario'])) {
    echo ("entro en el isset comentario");
    $path = mysqli_real_escape_string($link, $comentario['path_comentario']);
    $q = "INSERT INTO comentario (id_usuario, descripcion, id_imagen, path_comentario, fecha) VALUES ('$id_usuario', '$descripcion', '$id_imagen', '$path', '$fecha')";
  } else {
    $q = "INSERT INTO comentario (id_usuario, descripcion, id_imagen, fecha) VALUES ('$id_usuario', '$descripcion', '$id_imagen', '$fecha')";
  }
  $comentario = json_decode(file_get_contents('php://input'), true);

  $query = mysqli_query($link, $q);
  if ($query) {
    header(' ', true, 201);
  } else {
    header(' ', true, 500);
  }
  mysqli_close($link);
}

function patchComentarios($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $id = $id + 0;
  $comentario = json_decode(file_get_contents('php://input'), true);
  $id_usuario = mysqli_real_escape_string($link, $comentario['id_usuario']);
  $id_muro = mysqli_real_escape_string($link, $comentario['id_muro']);
  $descripcion = mysqli_real_escape_string($link, $comentario['descripcion']);
  $id_imagen = mysqli_real_escape_string($link, $comentario['id_imagen']);
  $fecha = mysqli_real_escape_string($link, $comentario['fecha']);

  if (isset($comentario['path_comentario'])) {
    var_dump("entro en el if");
    die;
    $path = mysqli_real_escape_string($link, $comentario['path_comentario']);
    $q = "UPDATE comentario SET id_usuario='$id_usuario', id_muro='$id_muro', descripcion='$descripcion', id_imagen='$id_imagen', path_comentario='$path', fecha='$fecha' WHERE id=$id";
  } else {
    var_dump("entro en el else");
    die;
    $q = "UPDATE comentario SET id_usuario='$id_usuario', id_muro='$id_muro', descripcion='$descripcion', id_imagen='$id_imagen', fecha='$fecha' WHERE id=$id";
  }
  $comentario = json_decode(file_get_contents('php://input'), true);

  $query = mysqli_query($link, $q);
  if ($query) {
    header(' ', true, 201);
  } else {
    header(' ', true, 500);
  }
  mysqli_close($link);
}

function deleteComentarios($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $id = $id + 0;
  $query = "DELETE FROM comentario WHERE id=$id";
  $res = mysqli_query($link, $query);
  if ($res) {
    header(' ', true, 201);
  } else {
    header(' ', true, 500);
  }
  mysqli_close($link);
}

///IMAGEN

function getImagenes()
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $query = mysqli_query($link, "SELECT * FROM imagen");
  $imagenes = [];
  while ($imagen = mysqli_fetch_assoc($query)) {
    $imagenes[] = $imagen;
  }
  header('Content-Type: application/json');
  print json_encode($imagenes);
  mysqli_free_result($query);
  mysqli_close($link);
}

function postImagenes()
{
  if (isset($_FILES['files'])) {
    $errors = [];
    $path = '../uploads/';
    $extensions = ['jpg', 'jpeg', 'png', 'gif'];

    $all_files = count($_FILES['files']['tmp_name']);

    for ($i = 0; $i < $all_files; $i++) {
      $file_name = $_FILES['files']['name'][$i];
      $file_tmp = $_FILES['files']['tmp_name'][$i];
      $file_type = $_FILES['files']['type'][$i];
      $file_size = $_FILES['files']['size'][$i];
      $file_ext = strtolower(end(explode('.', $_FILES['files']['name'][$i])));

      $file = $path . $file_name;


      if (!in_array($file_ext, $extensions)) {
        $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
      }

      if ($file_size > 2097152) {
        $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
      }

      if (empty($errors)) {
        move_uploaded_file($file_tmp, $file);
      }
    }

    if ($errors) print_r($errors);
    $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
    if (!$link) {
      header(' ', true, 500);
      print mysqli_error();
      die;
    }
    mysqli_set_charset($link, 'utf8');

    $imagen = json_decode(file_get_contents("php://input"), true);
    $id_usuario = mysqli_real_escape_string($link, $imagen['id_usuario']);
    $id_muro = mysqli_real_escape_string($link, $imagen['id_muro']);
    $fecha = mysqli_real_escape_string($link, $imagen['fecha']);

    $query = mysqli_query($link, "INSERT INTO imagen (id_usuario, id_muro, path, fecha ) VALUES ('$id_usuario', '$id_muro', '$file', '$fecha')");

    $imagen = json_decode(file_get_contents('php://input'), true);

    $query = mysqli_query($link, $q);
    if ($query) {
      header(' ', true, 201);
    } else {
      header(' ', true, 500);
    }
    mysqli_close($link);
    
  }else{
    $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
    if (!$link) {
      header(' ', true, 500);
      print mysqli_error();
      die;
    }
    mysqli_set_charset($link, 'utf8');
    $imagen = json_decode(file_get_contents('php://input'), true);
  
    $id_usuario = mysqli_real_escape_string($link, $imagen['id_usuario']);
    $id_muro = mysqli_real_escape_string($link, $imagen['id_muro']);
    $fecha = mysqli_real_escape_string($link, $imagen['fecha']);
   /* if (($imagen['path']) != '') {
      echo ("entro en el isset path");
      $path = mysqli_real_escape_string($link, $imagen['path']);
      $q = "INSERT INTO imagen (id_usuario, id_muro, path ) VALUES ('$id_usuario', '$id_muro', '$path')";
    } else {*/
      echo ("entro en el isset url");
      $url = mysqli_real_escape_string($link, $imagen['url']);
      $q = "INSERT INTO imagen (id_usuario, id_muro, url, fecha) VALUES ('$id_usuario', '$id_muro', '$url', '$fecha')";
      
 //   }
    $imagen = json_decode(file_get_contents('php://input'), true);

    $query = mysqli_query($link, $q);
    if ($query) {
      header(' ', true, 201);
    } else {
      header(' ', true, 500);
    }
    mysqli_close($link);
  }
}

function patchImagenes($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $id = $id + 0;
  $imagen = json_decode(file_get_contents('php://input'), true);
  $id_usuario = mysqli_real_escape_string($link, $imagen['id_usuario']);
  $fecha = mysqli_real_escape_string($link, $imagen['fecha']);

  if (isset($imagen['path'])) {
    echo ("entro en el if");
    $path = mysqli_real_escape_string($link, $imagen['path']);
    $q = "UPDATE imagen SET id_usuario='$id_usuario', path='$path', fecha='$fecha' WHERE id=$id";
  } else {
    echo ("entro en el else");
    $url = mysqli_real_escape_string($link, $imagen['url']);
    $q = "UPDATE imagen SET id_usuario='$id_usuario', url='$url, fecha='$fecha' 'WHERE id=$id";
  }
  $imagen = json_decode(file_get_contents('php://input'), true);

  $query = mysqli_query($link, $q);
  if ($query) {
    header(' ', true, 201);
  } else {
    header(' ', true, 500);
  }
  mysqli_close($link);
}

function deleteImagenes($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $id = $id + 0;
  $queryIntermedia = "DELETE FROM comentario WHERE id_comentario=$id";
  $resIntermedia = mysqli_query($link, $queryIntermedia);
  $query = "DELETE FROM imagen WHERE id=$id";
  $res = mysqli_query($link, $query);
  if ($res || $resIntermedia) {
    header(' ', true, 201);
  } else {
    header(' ', true, 500);
  }
  mysqli_close($link);
}

function getImagenesConParametros($id) ///iMAGENES CON COMENTARIOS
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $id = $id + 0;
  $query = mysqli_query($link, "SELECT imagen.id, path, url, usuario.nombre, usuario.id as id_usuario, imagen.fecha FROM imagen INNER JOIN usuario ON imagen.id_usuario = usuario.id WHERE id_usuario=$id");
  $imagenes = [];
  $comentarios = [];
  while ($imagen = mysqli_fetch_assoc($query)) {
    $id_imagen = $imagen['id'] + 0;
    $queryComentarios = mysqli_query($link, "SELECT comentario.id , path_comentario, descripcion, fecha, usuario.nombre FROM comentario INNER JOIN usuario ON comentario.id_usuario = usuario.id WHERE id_imagen = $id_imagen");
    while ($realComentarios = mysqli_fetch_assoc($queryComentarios)) {
      array_push($comentarios, $realComentarios);
      $imagen['comentarios'] = $comentarios;
    }
  //  array_push($imagenes[$imagen]['comentarios'], $comentarios);  
    $imagenes[] = $imagen;

  }
  header('Content-Type: application/json');
  print json_encode($imagenes);
  mysqli_free_result($query);
  mysqli_close($link);
}
?>