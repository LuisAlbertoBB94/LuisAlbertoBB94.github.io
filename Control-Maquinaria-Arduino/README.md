<!-- Encabezado con banner estilizado -->
<div align="center">
  <img src="https://github.com/microsoft/PowerBI-Embedded/raw/master/assets/PowerBI-Logo.png" width="180"/>
  <h1>馃搳 Power BI Dashboard Portfolio</h1>
  <p>Interactive data visualization solutions for business intelligence</p>
  <img src="https://img.shields.io/badge/Version-2.0-blue?style=flat&logo=powerbi" alt="Portfolio Version">
</div>

---
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

<h2>?? Descripción</h2>
<p>Sistema completo para monitoreo y control remoto de maquinaria de construcción mediante interfaz web y Arduino con módulos GSM/GPS. Desarrollado como trabajo de titulación en la Universidad Autónoma de Guerrero.</p>

<p><strong>Autores</strong>:<br>
Luis Alberto Barragán Bonilla<br>
Christopher Morales Martínez<br>
<strong>Director</strong>: Dr. Gustavo Adolfo Alonso Silverio</p>

<h2>??? Tecnologías Utilizadas</h2>
<h3>Hardware</h3>
<ul>
  <li>Arduino UNO</li>
  <li>Módulo GSM SIM900</li>
  <li>Módulo GPS Ublox NEO-6M</li>
  <li>Termopar tipo K con MAX6675</li>
  <li>Módulo Ethernet</li>
</ul>

<h3>Software</h3>
<ul>
  <li>Frontend: HTML5, CSS3, JavaScript (Google Maps API)</li>
  <li>Backend: PHP, MySQL</li>
  <li>Comunicación: Protocolo serial, Comandos AT</li>
</ul>

<h2>?? Funcionalidades Principales</h2>
<ul>
  <li>Monitoreo en tiempo real de ubicación GPS</li>
  <li>Medición de temperatura con termopar</li>
  <li>Control remoto de encendido/apagado</li>
  <li>Dashboard web con visualización de datos</li>
  <li>Sistema de autenticación de usuarios</li>
</ul>

<h2>?? Capturas del Sistema</h2>

<p><img src="./media/screenshots/login.png" alt="Interfaz de Login"><br>
<em>Pantalla de inicio de sesión</em></p>

<p><img src="./media/screenshots/dashboard.png" alt="Dashboard Principal"><br>
<em>Panel de control con datos en tiempo real</em></p>

<p><img src="./media/screenshots/BD.png" alt="Estructura de Base de Datos"><br>
<em>Esquema de la base de datos</em></p>

<h2>?? Instalación</h2>

<ol>
  <li><strong>Hardware</strong>:
    <ul>
      <li>Conectar módulos GSM, GPS y termopar al Arduino</li>
      <li>Alimentar con fuente de 12V regulada a 5V</li>
    </ul>
  </li>
  
  <li><strong>Software</strong>:
    <pre><code>git clone https://github.com/LuisAlbertoBB94/Control-Maquinaria-Arduino.git
mysql -u usuario -p < database/schema.sql</code></pre>
  </li>
  
  <li>Configurar credenciales en <code>web/includes/conexion.php</code></li>
</ol>

<h2>?? Configuración de conexión a base de datos</h2>

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
    die("Error de conexión: " . $e->getMessage());
}
?&gt;</code></pre>

<h2>?? Estructura básica de la base de datos</h2>

<pre><code>CREATE TABLE `maquinaria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `latitud` varchar(20) NOT NULL,
  `longitud` varchar(20) NOT NULL,
  `temperatura` float NOT NULL,
  `estado` tinyint(1) NOT NULL COMMENT '1=Encendido, 0=Apagado',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;</code></pre>

<h2>?? Configuración de Arduino</h2>

<p>Los sketches principales son:</p>

<ol>
  <li><code>EnvioDatos.ino</code> - Para enviar datos de sensores</li>
  <li><code>RecibeDatos.ino</code> - Para recibir comandos de control</li>
</ol>

<h3>Configuración básica en ambos sketches:</h3>

<pre><code>// Configuración GSM
#define SIM900_RX_PIN 7
#define SIM900_TX_PIN 8
SoftwareSerial SIM900(SIM900_RX_PIN, SIM900_TX_PIN);

// Configuración GPS
#define GPS_RX_PIN 11
#define GPS_TX_PIN 10
SoftwareSerial serialgps(GPS_RX_PIN, GPS_TX_PIN);

// Configuración termopar
#define thermoDO  3
#define thermoCS  4
#define thermoCLK 5
MAX6675 thermocouple(thermoCLK, thermoCS, thermoDO);</code></pre>

<h2>?? Configuración del servidor web</h2>

<p>Requisitos:</p>
<ul>
  <li>PHP 7.0 o superior</li>
  <li>MySQL 5.6+</li>
  <li>Servidor Apache o Nginx</li>
  <li>Habilitada la comunicación serial (para COM en Windows o /dev/tty* en Linux)</li>
</ul>

<h2>?? Demo</h2>
<p><a href="./media/demo.mp4">Ver video demostrativo</a></p>

<h2>?? Documentación Técnica</h2>
<p>El sistema utiliza:</p>
<ul>
  <li>Protocolo NMEA para datos GPS</li>
  <li>Comandos AT para comunicación GSM</li>
  <li>API de Google Maps para geolocalización</li>
  <li>MySQL para almacenamiento de datos históricos</li>
</ul>

<h2>?? Licencia</h2>
<p>Proyecto académico desarrollado para la Universidad Autónoma de Guerrero. Todos los derechos reservados.</p>

<hr>

<p><em>"Sistema para el control y monitoreo de maquinaria de construcción a través de Arduino y módulos GSM/GPS" - 2018</em></p>

</body>
</html>
## 馃専 Featured Dashboards

### 馃搱 Ventas Globales
[![Descargar Reporte](https://img.shields.io/badge/Descargar_PBIX-FF9E0F?style=for-the-badge&logo=powerbi)](./Ventas.pbix)

<p align="center">
  <a href="./Ventas.pbix">
    <img src="./Ventas-preview.jpg" width="85%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border: 1px solid #eee;">
  </a>
</p>

**Descripci贸n**:  
An谩lisis de ventas internacionales con desglose por pa铆s, continente y per铆odo (2025-2027).

---

### 馃帗 Cursos BD - An谩lisis Clientes
[![Descargar Reporte](https://img.shields.io/badge/Descargar_PBIX-FF9E0F?style=for-the-badge&logo=powerbi)](./BD_cursos.pbix)

<p align="center">
  <a href="./BD_cursos.pbix">
    <img src="./BD_cursos_page-0001.jpg" width="85%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border: 1px solid #eee;">
  </a>
</p>

**Descripci贸n**:  
Reporte de capacitaci贸n corporativa (2019-2021) con an谩lisis de clientes, cursos y jornadas.


---

### 馃捈 Facturaci贸n Clientes
[![Descargar Reporte](https://img.shields.io/badge/Descargar_PBIX-FF9E0F?style=for-the-badge&logo=powerbi)](./Facturas.pbix)

<p align="center">
  <a href="./Facturas.pbix">
    <img src="./Facturas-preview.jpg" width="85%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border: 1px solid #eee;">
  </a>
</p>

**Descripci贸n**:  
An谩lisis de facturaci贸n por cliente, sector y concepto.



---

## 馃洜锔?C贸mo Utilizar

1. Haz clic en el bot贸n **Descargar PBIX**
2. Abre el archivo en Power BI Desktop (versi贸n 2.120+ recomendada)
3. Actualiza conexiones de datos si es necesario (Ctrl+Alt+R)
4. Explora los filtros interactivos:
   - Selectores por per铆odo
   - Filtros por categor铆a/cliente
   - Segmentaciones geogr谩ficas

<div align="center" style="margin-top: 40px;">
  <a href="https://github.com/LuisAlbertoBB94/Data-Analyst-Portfolio">
    <img src="https://img.shields.io/badge/鈫恄Volver_al_Portafolio-217346?style=for-the-badge&logo=github">
  </a>
</div>
