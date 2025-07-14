<!DOCTYPE html>
<html>
<head>
<title>README - Sistema de Control de Maquinaria con Arduino</title>
<style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
  }
  h1, h2, h3 {
    color: #2c3e50;
  }
  code {
    background-color: #f4f4f4;
    padding: 2px 5px;
    border-radius: 3px;
    font-family: monospace;
  }
  pre {
    background-color: #f8f8f8;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10px auto;
    border: 1px solid #ddd;
  }
  .highlight {
    background-color: #ffffcc;
    padding: 2px;
  }
</style>
</head>
<body>

<h1>?? Sistema de Control y Monitoreo de Maquinaria con Arduino</h1>

<p><img src="./media/screenshots/dashboard.png" alt="Banner del Proyecto"></p>

<h2>?? Descripci車n</h2>
<p>Sistema completo para monitoreo y control remoto de maquinaria de construcci車n mediante interfaz web y Arduino con m車dulos GSM/GPS. Desarrollado como trabajo de titulaci車n en la Universidad Aut車noma de Guerrero.</p>

<p><strong>Autores</strong>:<br>
Luis Alberto Barrag芍n Bonilla<br>
Christopher Morales Mart赤nez<br>
<strong>Director</strong>: Dr. Gustavo Adolfo Alonso Silverio</p>

<h2>??? Tecnolog赤as Utilizadas</h2>
<h3>Hardware</h3>
<ul>
  <li>Arduino UNO</li>
  <li>M車dulo GSM SIM900</li>
  <li>M車dulo GPS Ublox NEO-6M</li>
  <li>Termopar tipo K con MAX6675</li>
  <li>M車dulo Ethernet</li>
</ul>

<h3>Software</h3>
<ul>
  <li>Frontend: HTML5, CSS3, JavaScript (Google Maps API)</li>
  <li>Backend: PHP, MySQL</li>
  <li>Comunicaci車n: Protocolo serial, Comandos AT</li>
</ul>

<h2>?? Funcionalidades Principales</h2>
<ul>
  <li>Monitoreo en tiempo real de ubicaci車n GPS</li>
  <li>Medici車n de temperatura con termopar</li>
  <li>Control remoto de encendido/apagado</li>
  <li>Dashboard web con visualizaci車n de datos</li>
  <li>Sistema de autenticaci車n de usuarios</li>
</ul>

<h2>?? Capturas del Sistema</h2>

<p><img src="./media/screenshots/login.png" alt="Interfaz de Login"><br>
<em>Pantalla de inicio de sesi車n</em></p>

<p><img src="./media/screenshots/dashboard.png" alt="Dashboard Principal"><br>
<em>Panel de control con datos en tiempo real</em></p>

<p><img src="./media/screenshots/BD.png" alt="Estructura de Base de Datos"><br>
<em>Esquema de la base de datos</em></p>

<h2>?? Instalaci車n</h2>

<ol>
  <li><strong>Hardware</strong>:
    <ul>
      <li>Conectar m車dulos GSM, GPS y termopar al Arduino</li>
      <li>Alimentar con fuente de 12V regulada a 5V</li>
    </ul>
  </li>
  
  <li><strong>Software</strong>:
    <pre><code>git clone https://github.com/LuisAlbertoBB94/Control-Maquinaria-Arduino.git
mysql -u usuario -p < database/schema.sql</code></pre>
  </li>
  
  <li>Configurar credenciales en <code>web/includes/conexion.php</code></li>
</ol>

<h2>?? Configuraci車n de conexi車n a base de datos</h2>

<p>Editar el archivo <code>web/includes/conexion.php</code>:</p>

<pre><code>&lt;?php
$host = 'localhost';    // Servidor de base de datos
$dbname = 'maquinaria'; // Nombre de la base de datos
$username = 'root';     // Usuario MySQL
$password = '';         // Contrase?a MySQL

try {
    $conexion = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexi車n: " . $e->getMessage());
}
?&gt;</code></pre>

<h2>?? Estructura b芍sica de la base de datos</h2>

<pre><code>CREATE TABLE `maquinaria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `latitud` varchar(20) NOT NULL,
  `longitud` varchar(20) NOT NULL,
  `temperatura` float NOT NULL,
  `estado` tinyint(1) NOT NULL COMMENT '1=Encendido, 0=Apagado',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;</code></pre>

<h2>?? Configuraci車n de Arduino</h2>

<p>Los sketches principales son:</p>

<ol>
  <li><code>EnvioDatos.ino</code> - Para enviar datos de sensores</li>
  <li><code>RecibeDatos.ino</code> - Para recibir comandos de control</li>
</ol>

<h3>Configuraci車n b芍sica en ambos sketches:</h3>

<pre><code>// Configuraci車n GSM
#define SIM900_RX_PIN 7
#define SIM900_TX_PIN 8
SoftwareSerial SIM900(SIM900_RX_PIN, SIM900_TX_PIN);

// Configuraci車n GPS
#define GPS_RX_PIN 11
#define GPS_TX_PIN 10
SoftwareSerial serialgps(GPS_RX_PIN, GPS_TX_PIN);

// Configuraci車n termopar
#define thermoDO  3
#define thermoCS  4
#define thermoCLK 5
MAX6675 thermocouple(thermoCLK, thermoCS, thermoDO);</code></pre>

<h2>?? Configuraci車n del servidor web</h2>

<p>Requisitos:</p>
<ul>
  <li>PHP 7.0 o superior</li>
  <li>MySQL 5.6+</li>
  <li>Servidor Apache o Nginx</li>
  <li>Habilitada la comunicaci車n serial (para COM en Windows o /dev/tty* en Linux)</li>
</ul>

<h2>?? Demo</h2>
<p><a href="./media/demo.mp4">Ver video demostrativo</a></p>

<h2>?? Documentaci車n T谷cnica</h2>
<p>El sistema utiliza:</p>
<ul>
  <li>Protocolo NMEA para datos GPS</li>
  <li>Comandos AT para comunicaci車n GSM</li>
  <li>API de Google Maps para geolocalizaci車n</li>
  <li>MySQL para almacenamiento de datos hist車ricos</li>
</ul>

<h2>?? Licencia</h2>
<p>Proyecto acad谷mico desarrollado para la Universidad Aut車noma de Guerrero. Todos los derechos reservados.</p>

<hr>

<p><em>"Sistema para el control y monitoreo de maquinaria de construcci車n a trav谷s de Arduino y m車dulos GSM/GPS" - 2018</em></p>

</body>
</html>