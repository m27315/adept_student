<?php
// global variables
$sqlConnection = '';
$sqlStatement = '';
$sqlResult = '';
$currentTime = '';
$currentTimeSQL = '';

// load dependencies
require 'config.php';
require 'functions.php';

$currentTime = time();
$currentTimeSQL = date('Y-m-d H:i:s', $currentTime);

// normalize input, although still unsafe for direct SQL usage
$_CLEAN_INPUT = array();
foreach (array($_POST, $_GET) as $tbl) {
	global $sqlConnection;
	foreach ($tbl as $k => $v) {
		if (get_magic_quotes_gpc()) $v = stripslashes($v);
		$_CLEAN_INPUT[$k] = mysqli_real_escape_string($sqlConnection, htmlspecialchars($v, ENT_QUOTES));
	}
}
$seriesId = getSeriesId(getInput('series'));
$lessonId = getLessonId(getInput('lesson'));
$pageId = getPageId($lessonId, getInput('page'));

if (getInput('series')) {
	echo "<p>series = $seriesId</p>\n";
} else {
	echo "<p>No series</p>\n";
}
?>
