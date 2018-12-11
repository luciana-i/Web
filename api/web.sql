-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2018 a las 16:13:39
-- Versión del servidor: 10.1.36-MariaDB
-- Versión de PHP: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `web`
--


--- Usuarios

CREATE USER 'luciana1'@'localhost' IDENTIFIED BY 'luciana1';
GRANT USAGE ON *.* TO 'luciana1'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'luciana1'@'%' IDENTIFIED BY PASSWORD '*E96736F9911FD8AAEDFBCD90E6A796899B373E5D' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON `web`.* TO 'luciana1'@'%';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_muro` int(11) NOT NULL,
  `descripcion` varchar(500) COLLATE utf8_spanish_ci DEFAULT NULL,
  `path_comentario` varchar(200) COLLATE utf8_spanish_ci DEFAULT NULL,
  `id_imagen` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id`, `id_usuario`, `id_muro`, `descripcion`, `path_comentario`, `id_imagen`, `fecha`) VALUES
(1, 4, 1, 'Hola soy una descripcion de la bd', NULL, 1, '0000-00-00'),
(2, 4, 1, 'Hola soy otra descripcion de la bd', NULL, 1, '0000-00-00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

CREATE TABLE `imagen` (
  `id` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL,
  `id_muro` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `path` varchar(200) COLLATE utf8_spanish_ci DEFAULT NULL,
  `url` varchar(500) COLLATE utf8_spanish_ci DEFAULT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `imagen`
--

INSERT INTO `imagen` (`id`, `id_publicacion`, `id_muro`, `id_usuario`, `path`, `url`, `fecha`) VALUES
(1, 1, 0, 4, NULL, 'https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_1440,w_2560,x_0,y_0/dpr_2.0/c_limit,w_740/fl_lossy,q_auto/v1531451526/180712-Weill--The-Creator-of-Pepe-hero_uionjj ', '0000-00-00'),
(3, 3, 0, 4, NULL, 'https://i.dailymail.co.uk/i/pix/2017/12/12/21/4743A9B900000578-5172733-image-m-33_1513115818035.jpg ', '0000-00-00'),
(4, 2, 1, 4, NULL, 'http://www.crear-meme.com/public/img/memes_users/meme-english.jpg ', '0000-00-00'),
(5, 0, 0, 4, NULL, 'https://3.bp.blogspot.com/-zPA5onT8vDc/V7TrSEEsalI/AAAAAAAAATk/YY10-F9zjSEAX3qBreJ2o5xFEUU7F1suACLcB/s1600/661b3b2305aada261970d695fffbdce4.jpg', '0000-00-00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `muro`
--

CREATE TABLE `muro` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_publicacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `muro`
--

INSERT INTO `muro` (`id`, `id_usuario`, `id_publicacion`) VALUES
(1, 4, 1),
(2, 4, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicacion`
--

CREATE TABLE `publicacion` (
  `id` int(11) NOT NULL,
  `id_muro` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_imagen` int(11) NOT NULL,
  `id_comentario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `publicacion`
--

INSERT INTO `publicacion` (`id`, `id_muro`, `id_usuario`, `id_imagen`, `id_comentario`) VALUES
(1, 1, 4, 2, 1),
(2, 1, 4, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `rol` varchar(200) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `rol`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(500) COLLATE utf8_spanish_ci NOT NULL,
  `mail` varchar(500) COLLATE utf8_spanish_ci NOT NULL,
  `contrasenia` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `id_rol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `mail`, `contrasenia`, `id_rol`) VALUES
(1, 'luciana', 'luciana@luciana', '123', 1),
(4, 'pepe', 'pepe@pepe.com', '123', 2),
(6, 'jhon', 'jhon@jhon', '123', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_imagen` (`id_imagen`);

--
-- Indices de la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `muro`
--
ALTER TABLE `muro`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `muro`
--
ALTER TABLE `muro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `publicacion`
--
ALTER TABLE `publicacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id`);

--
-- Filtros para la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD CONSTRAINT `imagen_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
