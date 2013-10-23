<?php
date_default_timezone_set('America/Chicago');

$dbHost = 'localhost';
$dbUser = 'adept_scholar';
$dbPass = 'my_password';
$dbName = 'adept_scholar';

$sqlConnection = @ mysqli_connect($dbHost, $dbUser, $dbPass) or sqlDie("<p>(E) Cannot connect to $dbHost!</p>");
mysqli_select_db($sqlConnection, $dbName) or sqlDie("<p>(E) Cannot open database, $dbName</p>");

unset($dbHost, $dbUser, $dbPass, $dbName);

?>
