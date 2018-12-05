<?php
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

  $query = "DELETE FROM usuario WHERE id=$id";

  $res = mysqli_query($link, $query);
  if ($res) {
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

function postComentarios()
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
  $id_muro = mysqli_real_escape_string($link, $comentario['id_muro']);
  $descripcion = mysqli_real_escape_string($link, $comentario['descripcion']);
  $id_imagen = mysqli_real_escape_string($link, $comentario['id_imagen']);

  if (isset($comentario['path_comentario'])) {
    echo ("entro en el isset comentario");
    $path = mysqli_real_escape_string($link, $comentario['path_comentario']);
    $q = "INSERT INTO comentario (id_usuario, id_muro, descripcion, id_imagen, path_comentario) VALUES ('$id_usuario', '$id_muro', '$descripcion', '$id_imagen', '$path')";
  } else {
    $q = "INSERT INTO comentario (id_usuario, id_muro, descripcion, id_imagen) VALUES ('$id_usuario', '$id_muro', '$descripcion', '$id_imagen')";
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
  $id_comentario = mysqli_real_escape_string($link, $comentario['id_comentario']);

  if (isset($comentario['path_comentario'])) {
    $path = mysqli_real_escape_string($link, $comentario['path_comentario']);
    $q = "UPDATE comentario SET id_usuario='$id_usuario', id_muro='$id_muro, descripcion='$descripcion, id_comentario='$id_comentario, path_comentario='$path' WHERE id=$id";
  } else {
    $q = "UPDATE comentario SET id_usuario='$id_usuario', id_muro='$id_muro, descripcion='$descripcion, id_comentario='$id_comentario' WHERE id=$id";
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



function getImagen()
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


function getMuro($id)
{
  $link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);
  if (!$link) {
    header(' ', true, 500);
    print mysqli_error();
    die;
  }
  mysqli_set_charset($link, 'utf8');
  $query = mysqli_query($link, "SELECT * FROM muro WHERE id_usuario=$id");
  header('Content-Type: application/json');
  print json_encode($query);
  mysqli_free_result($query);
  mysqli_close($link);
}
?>