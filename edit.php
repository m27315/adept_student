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
$sectionId = getSectionId(getInput('section'));
$lessonId = getLessonId(getInput('lesson'));
$pageId = getPageId($lessonId, getInput('page'));

$action = strtolower(getInput('submit'));
if (is_numeric(getInput('series'))) {
	if (is_numeric(getInput('lesson'))) {
		if (is_numeric(getInput('page'))) {
			$target = 'page';
		} else {
			$target = 'lesson';
		}
	} else {
		$target = 'series';
	}
} else {
	$target = 'index';
}

switch ($target) {
	case 'page':
		$lessonOrdinalId = getLessonOrdinalId($lessonId);
		$pageOrdinalId = getPageOrdinalId($pageId);

		if ($action) {
			echo "<ul>\n";
			foreach($_POST as $k => $v) {
				echo "<li>" . htmlentities($k,ENT_QUOTES) . " = " . htmlentities($v,ENT_QUOTES) . "</li>\n";
			}
			echo "</ul>\n";
			// save incoming changes from POST
		}

		// adjust page to display next, based on action target
		switch ($action) {
			case 'insert':
				break;
			case 'previous':
				break;
			case 'next':
				break;
			case 'append':
				break;
		}

		printEditablePage($lessonOrdinalId, $pageId, $pageOrdinalId);

		break;

	case 'series':

		$seriesOrdinalId = getSeriesOrdinalId($seriesId);

		if ($action == 'save') {
			echo "<ul>\n";
			foreach($_POST as $k => $v) {
				echo "<li>" . htmlentities($k,ENT_QUOTES) . " = " . htmlentities($v,ENT_QUOTES) . "</li>\n";
			}
			echo "</ul>\n";

			// save incoming changes from POST
			$title = getInput('series_title');
			$description = getInput('series_description');
			$footer = getInput('series_footer');
			executeSQL("UPDATE series SET updated='$currentTimeSQL',title='$title',description='$description',footer='$footer' WHERE series_id=$seriesId");

			$sectionOrdinalId = 1;
			$sectionIds = array();
			foreach(explode(',',getInput('section_order')) as $postOrderId) {
				if (is_numeric($postOrderId)) {
					$title = getInput("section_$postOrderId");
					$description = getInput("description_$postOrderId");
					$footer = getInput("footer_$postOrderId");
					$sectionId = getInput("section_id_$postOrderId");
					if (is_numeric($sectionId) && getFromSQL("SELECT 1 FROM sections WHERE section_id=$sectionId")) {
						executeSQL("UPDATE sections SET updated='$currentTimeSQL',title='$title',description='$description',footer='$footer',series_id=$seriesId,ordinal=$sectionOrdinalId WHERE section_id=$sectionId");
					} else {
						executeSQL("INSERT INTO sections VALUES(NULL,'$currentTimeSQL','$currentTimeSQL','$title','$description','$footer',$seriesId,$sectionOrdinalId)");
						$sectionId = mysqli_insert_id($sqlConnection);
					}
					$sectionIds[] = $sectionId;
					++$sectionOrdinalId;
				}
			}
			executeSQL("DELETE FROM sections WHERE series_id=$seriesId AND section_id NOT IN(" . implode(',',$sectionIds) . ')');
		}

		printEditableSeries($seriesId, $seriesOrdinalId);
		break;

	case 'index':
	default:
		if ($action == 'save') {
			/*
			echo "<ul>\n";
			foreach($_POST as $k => $v) {
				echo "<li>" . htmlentities($k,ENT_QUOTES) . " = " . htmlentities($v,ENT_QUOTES) . "</li>\n";
			}
			echo "</ul>\n";
			*/
			
			// save incoming changes from POST
			setConfig('updated', $currentTimeSQL);
			setConfig('title', getInput('index_title'));
			setConfig('description', getInput('index_description'));
			setConfig('footer', getInput('index_footer'));
			setConfig('global_meta', getInput('global_meta'));
			setConfig('global_header', getInput('global_header'));
			setConfig('global_footer', getInput('global_footer'));
			
			$seriesOrdinalId = 1;
			$seriesIds = array();
			foreach(explode(',',getInput('series_order')) as $postOrderId) {
				if (is_numeric($postOrderId)) {
					$title = getInput("series_$postOrderId");
					$description = getInput("description_$postOrderId");
					$footer = getInput("footer_$postOrderId");
					$seriesId = getInput("series_id_$postOrderId");
					if (is_numeric($seriesId) && getFromSQL("SELECT 1 FROM series WHERE series_id=$seriesId")) {
						executeSQL("UPDATE series SET updated='$currentTimeSQL',title='$title',description='$description',footer='$footer',ordinal=$seriesOrdinalId WHERE series_id=$seriesId");
					} else {
						executeSQL("INSERT INTO series VALUES(NULL,'$currentTimeSQL','$currentTimeSQL','$title','$description','$footer',$seriesOrdinalId)");
						$seriesId = mysqli_insert_id($sqlConnection);
					}
					$seriesIds[] = $seriesId;
					++$seriesOrdinalId;
				}
			}
			executeSQL("DELETE FROM series WHERE series_id NOT IN(" . implode(',',$seriesIds) . ')');
			
		}

		printEditableIndex();

		break;

}

printFooter();
?>
