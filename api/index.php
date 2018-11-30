<?php
require_once('config.php');

$bd = mysqli_connect(DBHOST, DBUSER, DBPASS, DBBASE);

$metodo = strtolower($_SERVER['REQUEST_METHOD']);
$comandos = explode('/', strtolower($_GET['value']));
$funcionNombre = $metodo.ucfirst($comandos[0]);

$parametros = array_slice($comandos, 1);
if(count($parametros) >0 && $metodo == 'get')
	$funcionNombre = $funcionNombre.'ConParametros';


if(function_exists($funcionNombre))
	call_user_func_array ($funcionNombre, $parametros);
else
  header(' ', true, 400);
  
///GET  

function getUsuarios(){
    $link=mysqli_connect(DBHOST,DBUSER,DBPASS,DBBASE);
    if(!$link){
		header(' ',true,500); 
		print mysqli_error();
		die;
    }
    mysqli_set_charset($link, 'utf8');
    $query=mysqli_query($link,"SELECT * FROM usuario");
    $usuarios=[];
    while($usuario=mysqli_fetch_assoc($query)){
            $usuarios[]=$usuario;
    }
    header('Content-Type: application/json');
    print json_encode($usuarios);
    mysqli_free_result($query);
    mysqli_close($link);
}

///POST

function postUsuarios(){
  $link=mysqli_connect(DBHOST,DBUSER,DBPASS,DBBASE);
    if(!$link){
    header(' ',true,500); 
    print mysqli_error();
    die;
    }
  mysqli_set_charset($link, 'utf8');
  $usuario=json_decode(file_get_contents('php://input'), true);
  $nombre=mysqli_real_escape_string($link, $usuario['nombre']);
  $mail=mysqli_real_escape_string($link, $usuario['mail']);
  $contrasenia=mysqli_real_escape_string($link, $usuario['contrasenia']);
  $q=("INSERT INTO usuario (nombre, mail, contrasenia) VALUES ('$nombre', '$mail', '$contrasenia')");
  $query=mysqli_query($link,$q);  
  if ($query){
    header(' ', true, 201);
  }else{
    header (' ', true, 500);
  }
  mysqli_close($link);
  }
///GET CON PARAMETROS///
/*
  function getUsuarioConParametros($id){
    $link=mysqli_connect(DBHOST,DBUSER,DBPASS,DBBASE);
    if (!$link){
      header(' ',true, 500);
      print mysqli_error();
      die;
    }
    mysqli_set_charset($link,'utf8');
    $query= mysqli_query($link,"SELECT * FROM usuario WHERE id = $id");
    
    if ($usuario=mysqli_fetch_assoc($query)) {
    header('Content-Type: application/json');
    print json_encode($usuario);
    }
    else
    {
      header(' ',true,404);
    }
    mysqli_free_result($query);
    mysqli_close($link);
  }

  function patchUsuario($id){
    $link=mysqli_connect(DBHOST,DBUSER,DBPASS,DBBASE);
    if(!$link){
    header(' ',true,500); 
    print mysqli_error();
    die;
    }
    mysqli_set_charset($link, 'utf8');
    $usuario=json_decode(file_get_contents('php://input'), true);
    $q=("SELECT * FROM usuario WHERE id=='$id'");
    $query=mysqli_query($link,$q);  
    if ($query){
      header(' ', true, 201);
    }else{
      header (' ', true, 500);
    }
    mysqli_close($link);
  }

  function deleteUsuario($id){
    $link=mysqli_connect(DBHOST,DBUSER,DBPASS,DBBASE);
    if(!$link){
      header(' ',true,500);
      print mysqli_error();
      die;
    }
    mysqli_set_charset($link,'utf8');
    $id=$id+0;

    $query="DELETE FROM usuario WHERE id=$id";
      
    $res=mysqli_query($link,$query);
    if($res){
      header (' ', true,201);
    }
    else{
      header (' ',true,500);
    }
    mysqli_close($link);
  } 
 */
  function getImagen(){
    $link=mysqli_connect(DBHOST,DBUSER,DBPASS,DBBASE);
    if(!$link){
    header(' ',true,500); 
    print mysqli_error();
    die;
    }
    mysqli_set_charset($link, 'utf8');
    $query=mysqli_query($link,"SELECT * FROM imagen");
    $imagenes=[];
    while($imagen=mysqli_fetch_assoc($query)){
            $imagenes[]=$imagen;
    }
    header('Content-Type: application/json');
    print json_encode($imagenes);
    mysqli_free_result($query);
    mysqli_close($link);
  }

  function getComentario(){
    $link=mysqli_connect(DBHOST,DBUSER,DBPASS,DBBASE);
    if(!$link){
    header(' ',true,500); 
    print mysqli_error();
    die;
    }
    mysqli_set_charset($link, 'utf8');
    $query=mysqli_query($link,"SELECT * FROM comentario");
    $comentarios=[];
    while($comentario=mysqli_fetch_assoc($query)){
            $comentarios[]=$comentario;
    }
    header('Content-Type: application/json');
    print json_encode($comentarios);
    mysqli_free_result($query);
    mysqli_close($link);
  }
  function getMuro($id){
    $link=mysqli_connect(DBHOST,DBUSER,DBPASS,DBBASE);
    if(!$link){
    header(' ',true,500); 
    print mysqli_error();
    die;
    }
    mysqli_set_charset($link, 'utf8');
    $query=mysqli_query($link,"SELECT * FROM muro WHERE id_usuario=$id");
    header('Content-Type: application/json');
    print json_encode($query);
    mysqli_free_result($query);
    mysqli_close($link);
  }




  ?>