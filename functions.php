<?php
// define functions used here
function sqlDie($message) {
	flushBuffers();
	global $sqlConnection;
	if (isset($sqlConnection)) {
		$errorMessage = mysqli_connect_error($sqlConnection);
		$errorNumber = mysqli_connect_errno($sqlConnection);
		if ($errorMessage || $errorNumber) {
			$message .= "<p>(E) SQL Error #$errorNumber - $errorMessage.</p>\n";
		}
		$errorMessage = mysqli_error($sqlConnection);
		$errorNumber = mysqli_errno($sqlConnection);
		if ($errorMessage || $errorNumber) {
			$message .= "<p>(E) SQL Error #$errorNumber - $errorMessage.</p>\n";
		}
	}
	die($message . "\n");
}

function flushBuffers() {
	@ob_end_flush();
	@ob_flush();
	@flush();
	@ob_start();
}

function executeSQL($sqlStatement) {
	global $sqlConnection;
	$sqlResult = mysqli_query($sqlConnection, $sqlStatement);
	if ($sqlResult) {
		return $sqlResult;
	} else {
		sqlDie("<p>(E) Query failed - $sqlStatement</p>");
	}
}

function getFromSQL($sqlStatement) {
	$sqlResult = executeSQL($sqlStatement . ' LIMIT 1');
	$row = mysqli_fetch_row($sqlResult);
	$result = $row[0];
	mysqli_free_result($sqlResult);
	return $result;
}

function getRowFromSQL($sqlStatement) {
	$sqlResult = executeSQL($sqlStatement . ' LIMIT 1');
	$result = mysqli_fetch_row($sqlResult);
	mysqli_free_result($sqlResult);
	return $result;
}

$whiteSpaces = array(" ", ",", "\t", "\r", "\n");
function getInputArray($input) {
	$inputArray = array();
	if (isset($input) && $input) {
		if (get_magic_quotes_gpc()) $input = stripslashes($input);
		/*
		 foreach(preg_split("/[\s,\n\r]+/ms", trim($input)) as $f) {
		$f = str_replace('\\', '/', $f);
		$inputArray[] = $f;
		}
		*/
		global $whiteSpaces;
		$token = $escape = $openDoubleQuote = $openSingleQuote = '';
		$escapes = explode(' ', '" \'');
		foreach(str_split(str_replace('\\', '/', $input)) as $c) {
			if ($escape) {
				if (in_array($c, $escapes)) {
					$token .= $c;
				} else {
					echo "<p>Unknown escape sequence &quot;{$escape}{$c}&quot;, inside &quot;{$input}&quot;<
/p>\n";
				}
				$escape = '';
			} elseif ($c == '\\') {
				$escape = $c;
			} elseif (!$openSingleQuote && $c == '"') {
				$openDoubleQuote = ! $openDoubleQuote;
			} elseif (!$openDoubleQuote && $c == "'") {
				$openSingleQuote = ! $openSingleQuote;
			} elseif ($openDoubleQuote || $openSingleQuote) {
				$token .= $c;
			} elseif (in_array($c, $whiteSpaces)) {
				if ($token) {
					$inputArray[] = $token;
					$token = '';
				}
			} else {
				$token .= $c;
			}
		}
		if ($token) {
			$inputArray[] = $token;
		}
	}
	return $inputArray;
}

function getInput($key) {
	global $_CLEAN_INPUT;
	if (array_key_exists($key, $_CLEAN_INPUT)) {
		return $_CLEAN_INPUT[$key];
	} else {
		return '';
	}
}

function isConfig($key) {
	return getFromSQL("SELECT 1 FROM config WHERE name='$key'");
}

function getConfig($key) {
	return getFromSQL("SELECT value FROM config WHERE name='$key'");
}

function setConfig($key, $value) {
	if ($id = getFromSQL("SELECT id FROM config WHERE name='$key'")) {
		executeSQL("UPDATE config SET value='$value' WHERE id=$id LIMIT 1");
	} else {
		executeSQL("INSERT INTO config VALUES(NULL,'$key','$value')");
	}
}

function quoteIfNecessary($string) {
	global $whiteSpaces;
	$escapes = explode(' ', '" \'');
	foreach($whiteSpaces as $ws) {
		if (strpos($string, $ws) !== false) {
			return '"' . addslashes($string) . '"';
		}
	}
	return $string;
}

function getHumanReadableElapsedTime($seconds) {
	$elapsedTime = '';
	if ($seconds >= 2592000) {
		$months = floor($seconds / 2592000);
		$elapsedTime .= " {$months}mo";
		$seconds -= $months * 2592000;
	}
	if ($seconds >= 86400) {
		$days = floor($seconds / 86400);
		$elapsedTime .= " {$days}d";
		$seconds -= $days * 86400;
	}
	if ($seconds >= 3600) {
		$hours = floor($seconds / 3600);
		$elapsedTime .= " {$hours}h";
		$seconds -= $hours * 3600;
	}
	if ($seconds >= 60) {
		$minutes = floor($seconds / 60);
		$elapsedTime .= " {$minutes}m";
		$seconds -= $minutes * 60;
	}
	if ($seconds > 0) {
		$elapsedTime .= sprintf(" %0.4fs", $seconds);
	}
	if ($elapsedTime) $elapsedTime = substr($elapsedTime, 1);
	return $elapsedTime;
}

function convertToBytes($bytes) {
	$suffix = 'B';
	foreach (explode(' ', 'KiB MiB GiB TiB PiB EiB ZiB YiB') as $s) {
		if ($bytes >= 1024) {
			$bytes /= 1024;
			$suffix = $s;
		}
	}
	return sprintf("%0.4f %s", $bytes, $suffix);
}

function validateDate($string) {
	$string = trim($string);
	if (preg_match('/^\d{1,2}-\d{1,2}-\d{4}$/', $string)) {
		return $string;
	}
	return '';
}

function fixDate($string) {
	if (preg_match('/^\d{1,2}-\d{1,2}-\d{4}$/', $string)) {
		list($m, $d, $y) = explode('-', $string);
		return implode('-', array($y, $m, $d));
	} else {
		return $string;
	}
}

function numCmp($a, $b) {
	if ($a == $b) {
		return 0;
	}
	return ($a < $b) ? -1 : 1;
}

function getSeriesId($seriesOrdinalId) {
	if (is_numeric($seriesOrdinalId)) {
		$seriesId = getFromSQL("SELECT series_id FROM series WHERE ordinal=$seriesOrdinalId");
	} else {
		// default to latest series
		$seriesId = getFromSQL("SELECT series_id FROM series ORDER BY ordinal DESC");
	}
	if (! ($seriesId && $seriesId > 0) ) {
		global $currentTimeSQL;
		$seriesOrdinalId = getFromSQL('SELECT MAX(ordinal)+1 FROM series');
		if (! ($seriesOrdinalId && $seriesOrdinalId > 0) ) $seriesOrdinalId = 1;
		executeSQL("INSERT INTO series VALUES (NULL,'$currentTimeSQL','$currentTimeSQL','some title','some description','some footer',$seriesOrdinalId)");
		$seriesId = getFromSQL("SELECT series_id FROM series WHERE ordinal=$seriesOrdinalId");
		if (! ($seriesId && $seriesId > 0) ) {
			sqlDie("Unable to retrieve series, $seriesOrdinalId");
		}
	}
	return $seriesId;
}

function getSeriesOrdinalId($seriesId) {
	$seriesOrdinalId = getFromSQL("SELECT ordinal FROM series WHERE series_id=$seriesId");
	if ($seriesOrdinalId && $seriesOrdinalId > 0) {
		return $seriesOrdinalId;
	} else {
		sqlDie("(E) Could not find series ordinal, $seriesOrdinalId");
	}
}

function getSectionId($sectionOrdinalId) {
	if (is_numeric($sectionOrdinalId)) {
		$sectionId = getFromSQL("SELECT section_id FROM sections WHERE ordinal=$sectionOrdinalId");
		if (! ($sectionId && $sectionId > 0) ) {
			global $currentTimeSQL;
			$sectionOrdinalId = getFromSQL('SELECT MAX(ordinal)+1 FROM sections');
			if (! ($sectionOrdinalId && $sectionOrdinalId > 0) ) $sectionOrdinalId = 1;
			executeSQL("INSERT INTO sections VALUES (NULL,'$currentTimeSQL','$currentTimeSQL','some title','some description','some footer',0,$sectionOrdinalId)");
			$sectionId = getFromSQL("SELECT section_id FROM sections WHERE ordinal=$sectionOrdinalId");
			if (! ($sectionId && $sectionId > 0) ) {
				sqlDie("Unable to retrieve section, $sectionOrdinalId");
			}
		}
		return $sectionId;
	}
}

function getLessonId($lessonOrdinalId) {
	if (is_numeric($lessonOrdinalId)) {
		$lessonId = getFromSQL("SELECT lesson_id FROM lessons WHERE ordinal=$lessonOrdinalId");
		if (! ($lessonId && $lessonId > 0) ) {
			global $currentTimeSQL;
			$lessonOrdinalId = getFromSQL('SELECT MAX(ordinal)+1 FROM lessons');
			if (! ($lessonOrdinalId && $lessonOrdinalId > 0) ) $lessonOrdinalId = 1;
			executeSQL("INSERT INTO lessons VALUES (NULL,'$currentTimeSQL','$currentTimeSQL','some title','some description','some header','some footer',0,$lessonOrdinalId)");
			$lessonId = getFromSQL("SELECT lesson_id FROM lessons WHERE ordinal=$lessonOrdinalId");
			if (! ($lessonId && $lessonId > 0) ) {
				sqlDie("Unable to retrieve lesson, $lessonOrdinalId");
			}
		}
		return $lessonId;
	}
}

function getLessonOrdinalId($lessonId) {
	$lessonOrdinalId = getFromSQL("SELECT ordinal FROM lessons WHERE lesson_id=$lessonId");
	if ($lessonOrdinalId && $lessonOrdinalId > 0) {
		return $lessonOrdinalId;
	} else {
		sqlDie("(E) Could not find lesson ordinal, $lessonOrdinalId");
	}
}

function getPageId($lessonId, $pageOrdinalId) {
	if (is_numeric($lessonId) && is_numeric($pageOrdinalId)) {
		$pageId = getFromSQL("SELECT page_id FROM pages WHERE lesson_id={$lessonId} AND ordinal=$pageOrdinalId");
		if (! ($pageId && $pageId > 0) ) {
			global $currentTimeSQL;
			$pageOrdinalId = getFromSQL("SELECT MAX(ordinal)+1 FROM pages WHERE lesson_id={$lessonId}");
			if (! ($pageOrdinalId && $pageOrdinalId > 0) ) $pageOrdinalId = 1;
			executeSQL("INSERT INTO pages VALUES (NULL,'$currentTimeSQL','$currentTimeSQL','some title','some description','some header','some footer',$lessonId,$pageOrdinalId)");
			$pageId = getFromSQL("SELECT page_id FROM pages WHERE lesson_id={$lessonId} AND ordinal={$pageOrdinalId}");
			if (! ($pageId && $pageId > 0) ) {
				sqlDie("Unable to retrieve page, $pageOrdinalId");
			}
		}
		return $pageId;
	}
}

function getPageOrdinalId($pageId) {
	$pageOrdinalId = getFromSQL("SELECT ordinal FROM pages WHERE page_id=$pageId");
	if ($pageOrdinalId && $pageOrdinalId > 0) {
		return $pageOrdinalId;
	} else {
		sqlDie("(E) Could not find page ordinal, $pageOrdinalId");
	}
}

function getPageTitle($pageId) {
	return getFromSQL("SELECT title FROM pages WHERE page_id={$pageId}");
}

function getPageIntroduction($pageId) {
	return getFromSQL("SELECT description FROM pages WHERE page_id={$pageId}");
}

function printHeader($pageTitle) {
	echo <<<EOT
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="author" content="Trevor Bowen" />
<meta name="robots" content="none" />
<title>{$pageTitle}</title>
<script src="js/adept_student.js" type="text/javascript"></script>
<style type="text/css" media="screen">@import "css/adept_student.css";</style>
</head>
<body>
<div id="content">
<h1>{$pageTitle}</h1>
EOT;

}

function printEditablePage($lessonOrdinalId, $pageId, $pageOrdinalId) {
	$pageTitle = getPageTitle($pageId);
	if (! $pageTitle) $pageTitle = "some title";
	$pageIntroduction = getPageIntroduction($pageId);
	if (! $pageIntroduction) $pageIntroduction = 'some introduction';

	printHeader("Edit Lesson $lessonOrdinalId, Page $pageOrdinalId: $pageTitle");
	echo <<<EOT
<form method="post" action="edit.php">
<p><label class="required" for="page_title">Page Title:</label><input type="text" name="page_title" id="page_title" value ="{$pageTitle}" /></p>
<p><label for="page_intro">Page Introduction:</label><textarea name="page_intro" id="page_intro">$pageIntroduction</textarea></p>

EOT;

	// retrieve questions
	initializeQuestionsIfNecessary($pageId);
	$questionOrder = array();
	$sqlResult = executeSQL("SELECT question_id,ordinal,preface,question,hint,answer,explanation,type FROM questions WHERE page_id={$pageId} ORDER BY ordinal");
	while ($row = mysqli_fetch_array($sqlResult, MYSQL_ASSOC)) {
		printEditableQuestion($row['question_id'], $row['ordinal'],$row['preface'],$row['question'],$row['hint'],$row['answer'],$row['explanation'],$row['type']);
		$questionOrder[] = $row['ordinal'];
	}
	mysqli_free_result($sqlResult);
	$nextQuestionNumber = 1 + max($questionOrder);
	$questionOrder = implode(',', $questionOrder);

	echo <<<EOT
<div id="ci_footer">
<p><input type="hidden" name="question_order" id="question_order" value="{$questionOrder}" />
<button type="submit" name="submit" value="new"
	onclick="insertField(this); return false">Append New Field</button>
&nbsp; <select name="new_field">
	<option value="text">text</option>
	<option value="textarea">textarea</option>
	<option value="checkbox">checkbox</option>
	<option value="radio">radio</option>
	<option value="select">select</option>
</select></p>
<p>
<button type="submit" name="submit" value="insert">&lt;&lt; Insert Page Before</button>
&nbsp;
<button type="submit" name="submit" value="previous">&lt; Edit Previous Page</button>
&nbsp;
<button type="submit" name="submit" value="save">Save This Page</button>
&nbsp;
<button type="submit" name="submit" value="home">Discard and Go Home</button>
&nbsp;
<button type="submit" name="submit" value="next">Edit Next Page &gt;</button>
&nbsp;
<button type="submit" name="submit" value="append">Append Page After &gt;&gt;</button>
</p>
</div>

</form>
<script type="text/javascript" language="javascript">
//<![CDATA[
_nextQuestionNumber = {$nextQuestionNumber};
//]]>
</script>

EOT;
}

function initializeSeriesIfNecessary() {
	$numberOfSeries = getFromSQL("SELECT COUNT(*) FROM series");
	global $currentTimeSQL;
	if (! ($numberOfSeries && $numberOfSeries > 0)) {
		executeSQL("INSERT INTO series VALUES (NULL,'$currentTimeSQL','$currentTimeSQL','some series title','some series description','some series footer',1)");
	}
	if (! isConfig('created')) {
		setConfig('created',$currentTimeSQL);
	}
	if (! isConfig('updated')) {
		setConfig('updated',$currentTimeSQL);
	}
	if (! isConfig('title')) {
		setConfig('title','Insert Your Index Title Here');
	}
	if (! isConfig('description')) {
		setConfig('description','Insert Your Index Description Here');
	}
	if (! isConfig('footer')) {
		setConfig('footer','Insert Your Index Footer Here');
	}
	if (! isConfig('global_meta')) {
		setConfig('global_meta','Insert Your Global Meta Includes Here');
	}
	if (! isConfig('global_header')) {
		setConfig('global_header','Insert Your Global Header Here');
	}
	if (! isConfig('global_footer')) {
		setConfig('global_footer','Insert Your Global Footer Here');
	}

}

function initializeSectionsIfNecessary($seriesId) {
	$numberOfSections = getFromSQL("SELECT COUNT(*) FROM sections WHERE section_id=$seriesId");
	if (! ($numberOfSections && $numberOfSections > 0)) {
		global $currentTimeSQL;
		executeSQL("INSERT INTO sections VALUES (NULL,'$currentTimeSQL','$currentTimeSQL','some title','some description','some footer',$seriesId,1)");
	}
}


function initializeQuestionsIfNecessary($pageId) {
	$numberOfQuestions = getFromSQL("SELECT COUNT(*) FROM questions WHERE page_id={$pageId}");
	if (! ($numberOfQuestions && $numberOfQuestions > 0) ) {
		global $currentTimeSQL;
		executeSQL("INSERT INTO questions VALUES(NULL,'$currentTimeSQL','$currentTimeSQL','some preface','some question','some hint','some answer','some explanation','text',$pageId,1)");
	}
}

function printEditableQuestion($id, $number, $preface, $question, $hint, $answer, $explanation, $type) {
	$parity = ($number & 1) ? 'odd' : 'even';
	echo <<<EOT
	<div class="question_box {$parity}">
		<input type="hidden" value="{$number}" id="question_number_{$number}" name="question_number_{$number}" />
		<input type="hidden" value="{$type}" id="question_type_{$number}" name="question_type_{$number}" />
		<ul class="top">
			<li class="move_up"><a onclick="moveBox(this,-1,'question'); return false" title="Move Up" href="#">Move Up</a></li>
			<li class="move_top"><a onclick="moveBox(this,'top','question'); return false" title="Move to Top" href="#">Move to Top</a></li>
			<li class="insert_above"><a onclick="insertField(this); return false" title="Insert New question Above This One" href="#">Insert Above</a></li>
		</ul>
		<div class="mid">
			<ul class="mid2">
				<li class="delete"><a onclick="deleteBox(this,'question'); return false" title="Delete This question" href="#">Delete</a></li>
				<li><select onchange="changeField(this); return false" name="change_field">

EOT;

	foreach (explode(',', 'text,textarea,checkbox,radio,select') as $t) {
		if ($t == $type) {
			echo "					<option selected=\"selected\" value=\"$t\">$t</option>\n";
		} else {
			echo "					<option value=\"$t\">$t</option>\n";
		}
	}

	echo <<<EOT
				</select></li>
			</ul>
		</div>
		<div class="bot">
			<ul class="bot2">
				<li class="move_down"><a onclick="moveBox(this,1,'question'); return false" title="Move Down" href="#">Move Down</a></li>
				<li class="move_bottom"><a onclick="moveBox(this,'bottom','question'); return false" title="Move to Bottom" href="#">Move Bottom</a></li>
				<li class="insert_below"><a onclick="insertField(this, true); return false" title="Insert New question Below This One" href="#">Insert Below</a></li>
			</ul>
		</div>
		<div class="question_details">
			<fieldset>
				<legend>Question Details:</legend>

				<label for="preface_{$number}">Preface:</label>
				<textarea id="preface_{$number}" name="preface_{$number}">{$preface}</textarea>

				<label class="required" for="question_{$number}">Question:</label>
				<textarea id="question_{$number}" name="question_{$number}">{$question}</textarea>

				<label for="hint_{$number}">Hint:</label>
				<textarea id="hint_{$number}" name="hint_{$number}">{$hint}</textarea>\n\n
EOT;

	switch ($type) {
		case "text":
			echo <<<EOT
				<label class="required" for="answer_{$number}">Answer:</label>
				<input type="text" id="answer_{$number}" name="answer_{$number}" value="{$answer}" />\n
EOT;
			break;
		case "textarea":
			echo <<<EOT
				<label class="required" for="answer_{$number}">Answer:</label>
				<textarea id="answer_{$number}" name="answer_{$number}">{$answer}</textarea>\n
EOT;
			break;
		case "checkbox":
		case "radio":
		case "select":
			echo <<<EOT
				<label class="required" for="options_{$number}">Number of Options:</label>
				<input type="text" name="options_{$number}" id="options_{$number}" value="{$numOfOptions}" onChange="updateNumberOfOptions(this)" />\n
EOT;

			for ($i = 1; $i <= $numberOfOptions; $i++) {
				$optionValue = getFromSQL("SELECT text FROM options WHERE question_id={$id}");
				if (! $optionValue) $optionValue = "some option #{$i}";
				echo <<<EOT
				<label class="required" for="options_{$number}_value_{$i}">Option #{$i}:</label>
				<input type="text" name="options_{$number}_value_{$i}" id="options_{$number}_value_{$i}" value="{$optionValue}" />\n
EOT;
			}

			echo <<<EOT
				<label for="options_{$number}"
				<label class="required" for="options_{$number}">Answer:</label>
				<textarea id="answer_{$number}" name="answer_{$number}">{$answer}</textarea>\n
EOT;
			break;
		case 'default':
			break;
	}

	echo <<<EOT

				<label for="explanation_{$number}">Explanation:</label>
				<textarea id="explanation_{$number}" name="explanation_{$number}">{$explanation}</textarea>
			</fieldset>
		</div>
	</div>\n
EOT;

}

function printFooter() {
	echo <<<EOT

	<p>Powered by <a href="http://github.com/m27315/adept_student" target="_blank">Adept Student</a> software.</p>
</div>

</body>
</html>
EOT;
}

function printEditableSection($seriesOrdinalId,$sectionId,$created,$updated,$title,$description,$footer,$number) {
	global $sqlConnection;
	//if (! $title) $title = "some title";
	//if (! $description) $description = "some description";
	//if (! $footer) $footer = "some footer";
	$parity = ($number & 1) ? 'odd' : 'even';

	echo <<<EOT
	<div class="section_box {$parity}">
		<input type="hidden" value="{$number}" id="section_number_{$number}" name="section_number_{$number}" />
		<input type="hidden" value="$sectionId" id="section_id_{$number}" name="section_id_{$number}" />
		<ul class="top">
			<li class="move_up"><a onclick="moveBox(this,-1,'section'); return false" title="Move Up" href="#">Move Up</a></li>
			<li class="move_top"><a onclick="moveBox(this,'top','section'); return false" title="Move to Top" href="#">Move to Top</a></li>
			<li class="insert_above"><a onclick="insertBox(this); return false" title="Insert New Section Above This One" href="#">Insert Above</a></li>
		</ul>
		<div class="mid">
			<ul class="mid2">
				<li class="delete"><a onclick="deleteBox(this,'section'); return false" title="Delete This Section" href="#">Delete</a></li>
			</ul>
		</div>
		<div class="bot">
			<ul class="bot2">
				<li class="move_down"><a onclick="moveBox(this,1,'section'); return false" title="Move Down" href="#">Move Down</a></li>
				<li class="move_bottom"><a onclick="moveBox(this,'bottom','section'); return false" title="Move to Bottom" href="#">Move Bottom</a></li>
				<li class="insert_below"><a onclick="insertBox(this, true); return false" title="Insert New Section Below This One" href="#">Insert Below</a></li>
			</ul>
		</div>
		<div class="section_details">
			<fieldset>
				<legend>Section #$number Details:</legend>

				<label for="section_created_{$number}">Section Created:</label>
				<input type="text" name="section_created_{$number}" id="section_created_{$number}" readonly="readonly" value="$created" /></p>

				<label for="section_updated_{$number}">Section Updated:</label>
				<input type="text" name="section_updated_{$number}" id="section_updated_{$number}" readonly="readonly" value="$updated" /></p>
				
				<label class="required" for="section_{$number}">Section Title:</label>
				<input type="text" name="section_{$number}" id="section_{$number}" value="$title" /></p>

				<label for="description_{$number}">Description:</label>
				<textarea id="description_{$number}" name="description_{$number}">{$description}</textarea>
				
				<p>Section Index:</p>
				<ul class="section">\n
EOT;

	$sqlStatement = "SELECT lesson_id,title FROM lessons WHERE section_id={$sectionId} ORDER BY ordinal";
	$sqlResult = mysqli_query($sqlConnection, $sqlStatement) or sqlDie("<p>(E) Query failed - $sqlStatement</p>");
	while ($row = mysqli_fetch_array($sqlResult, MYSQL_ASSOC)) {
		printEditableLesson($sectionId, $row['lesson_id'], $row['title']);
	}
	//echo "	<li><a target=\"_blank\" href=\"edit.php?series={$seriesOrdinalId}&lesson=new&page=1&submit=edit\">Create New Lesson</a></li>\n";
	printEditableLesson($sectionId, 'new1', 'Create New Lesson');
	printEditableLesson($sectionId, 'new2', 'Create New Lesson');
	echo <<<EOT
				</ul>
				
				<label for="footer_{$number}">Section Footer:</label>
				<textarea id="footer_{$number}" name="footer_{$number}">{$footer}</textarea>
			</fieldset>
		</div>
	</div>\n
EOT;
}

function printEditableSeries($seriesId, $seriesOrdinalId) {
	global $sqlConnection;
	printHeader('Edit Interactive Correspondence Course Lessons');
	list($created,$updated,$title,$description,$footer,$ordinal) = getRowFromSQL("SELECT created,updated,title,description,footer,ordinal FROM series WHERE series_id=$seriesId");
	//if (! $title) $title = "some title";
	//if (! $description) $description = "some description";
	//if (! $footer) $footer = "some footer";

	echo <<<EOT
<form method="post" action="edit.php">
<input type="hidden" name="series" id="series" value="$seriesOrdinalId" />
<p><label for="series_created">Series Created:</label><input type="text" name="series_created" id="series_created" readonly="readonly" value="$created" /></p>
<p><label for="series_updated">Series Updated:</label><input type="text" name="series_updated" id="series_updated" readonly="readonly" value="$updated" /></p>
<p><label class="required" for="series_title">Series Title:</label><input type="text" name="series_title" id="series_title" value ="{$title}" /></p>
<p><label for="series_description">Series Description:</label><textarea name="series_description" id="series_description">$description</textarea></p>

EOT;

	initializeSectionsIfNecessary($seriesId);
	$order = array();
	$sqlResult = executeSQL("SELECT section_id,created,updated,title,description,footer,ordinal FROM sections WHERE series_id={$seriesId} ORDER BY ordinal");
	while ($row = mysqli_fetch_array($sqlResult, MYSQL_ASSOC)) {
		printEditableSection($ordinal,$row['section_id'],$row['created'],$row['updated'],$row['title'],$row['description'],$row['footer'],$row['ordinal']);
		$order[] = $row['ordinal'];
	}
	mysqli_free_result($sqlResult);
	$nextNumber = 1 + max($order);
	$order = implode(',', $order);

	echo <<<EOT
<p><label for="series_footer">Series Footer:</label><textarea name="series_footer" id="series_footer">$footer</textarea></p>
<div id="ci_footer">
<p>
<input type="hidden" name="section_order" id="section_order" value="{$order}" />
<!--
<button type="submit" name="submit" value="new"
	onclick="insertBox(this); return false">Append New Section</button>
&nbsp;
-->
<button type="submit" name="submit" value="save">Save This Index</button>
</p>
</div>

</form>
<script type="text/javascript" language="javascript">
//<![CDATA[
_nextSectionNumber = {$nextNumber};
//]]>
</script>

EOT;

}

function printEditableLesson($sectionId, $lessonId, $lessonTitle) {

	//echo "	<li><a target=\"_blank\" href=\"edit.php?lesson={$lessonId}&page=1&submit=edit\">{$lessonTitle}</a></li>\n";
	echo <<<EOT
	<li>
		<ul class="lesson">
			<li class="move_up"><a onclick="moveLesson(this,-1); return false" title="Move Up" href="#">Move Up</a></li>
			<li class="move_top"><a onclick="moveLesson(this,'top'); return false" title="Move to Top" href="#">Move to Top</a></li>
			<li class="insert_above"><a onclick="insertLesson(this); return false" title="Insert New Lesson Above This One" href="#">Insert Above</a></li>
			<li class="edit"><a onclick="editLesson(this); return false" title="Edit This Lesson" href="#">Edit</a></li>
			<li class="delete"><a onclick="deleteLesson(this); return false" title="Delete This Lesson" href="#">Delete</a></li>
			<li class="move_down"><a onclick="moveLesson(this,1'); return false" title="Move Down" href="#">Move Down</a></li>
			<li class="move_bottom"><a onclick="moveLesson(this,'bottom'); return false" title="Move to Bottom" href="#">Move Bottom</a></li>
			<li class="insert_below"><a onclick="insertLesson(this, true); return false" title="Insert New Lesson Below This One" href="#">Insert Below</a></li>
			<li><div class="comboBox"><input class="comboEdit" type="text" name="lesson_{$sectionId}_{$lessonId}" id="lesson_{$sectionId}_{$lessonId}" value="$lessonTitle" /><select tabindex="-1" class="comboList" name="select_{$sectionId}_{$lessonId}" id="select_{$sectionId}_{$lessonId}"><option value="1">Item 1</option><option value="2">Item 2</option><option value="3">Item 3</option><option value="4">Item 4</option></select></div></li>
		</ul>
	</li>
EOT;
	//	echo 			<li><input type="text"  /></li>

}

function printEditableIndex() {
	global $sqlConnection;
	printHeader('Edit Correspondence Index Configuration');
	initializeSeriesIfNecessary();

	$created = getConfig('created');
	$updated = getConfig('updated');
	$title = getConfig('title');
	$description = getConfig('description');
	$footer = getConfig('footer');
	$globalMeta = getConfig('global_meta');
	$globalHeader = getConfig('global_header');
	$globalFooter = getConfig('global_footer');

	echo <<<EOT
<form method="post" action="edit.php">
<p><label for="index_created">Index Created:</label><input type="text" name="index_created" id="index_created" readonly="readonly" value="$created" /></p>
<p><label for="index_updated">Index Updated:</label><input type="text" name="index_updated" id="index_updated" readonly="readonly" value="$updated" /></p>
<p><label for="global_meta">Global HTML Head includes (META):</label><textarea name="global_meta" id="global_meta">$globalMeta</textarea></p>
<p><label for="global_header">Global Header:</label><textarea name="global_header" id="global_header">$globalHeader</textarea></p>
<p><label class="required" for="index_title">Index Title:</label><input type="text" name="index_title" id="index_title" value ="{$title}" /></p>
<p><label for="index_description">Index Description:</label><textarea name="index_description" id="index_description">$description</textarea></p>

EOT;

	$order = array();
	$sqlResult = executeSQL("SELECT series_id,created,updated,title,description,footer,ordinal FROM series ORDER BY ordinal");
	while ($row = mysqli_fetch_array($sqlResult, MYSQL_ASSOC)) {
	$order[] = $row['ordinal'];
		printEditableSeriesFromIndex($row['series_id'],$row['created'],$row['updated'],$row['title'],$row['description'],$row['footer'],$row['ordinal']);
	}
	mysqli_free_result($sqlResult);
	$nextNumber = 1 + max($order);
	$order = implode(',', $order);

	echo <<<EOT
<p><label for="index_footer">Index Footer:</label><textarea name="index_footer" id="index_footer">$footer</textarea></p>
<p><label for="global_footer">Global Footer:</label><textarea name="global_footer" id="global_footer">$globalFooter</textarea></p>
<div id="ci_footer">
	<p><input type="hidden" name="series_order" id="series_order" value="{$order}" /><button type="submit" name="submit" value="save">Save This Index</button></p>
</div>

</form>

<script type="text/javascript" language="javascript">
//<![CDATA[
_nextSeriesNumber = {$nextNumber};
//]]>
</script>

EOT;
}

function printEditableSeriesFromIndex($seriesId,$created,$updated,$title,$description,$footer,$number) {
	global $sqlConnection;
	//if (! $title) $title = "some title";
	//if (! $description) $description = "some description";
	//if (! $footer) $footer = "some footer";
	$parity = ($number & 1) ? 'odd' : 'even';

	echo <<<EOT
<div class="series_box {$parity}">
	<input type="hidden" value="{$number}" id="series_number_{$number}" name="series_number_{$number}" />
	<input type="hidden" value="$seriesId" id="series_id_{$number}" name="series_id_{$number}" />
	<ul class="top">
		<li class="move_up"><a onclick="moveBox(this,-1,'series'); return false" title="Move Up" href="#">Move Up</a></li>
		<li class="move_top"><a onclick="moveBox(this,'top','series'); return false" title="Move to Top" href="#">Move to Top</a></li>
		<li class="insert_above"><a onclick="insertBox(this); return false" title="Insert New Series Above This One" href="#">Insert Above</a></li>
	</ul>

	<div class="mid">
		<ul class="mid2">
			<li class="delete"><a onclick="deleteBox(this,'series'); return false" title="Delete This Series" href="#">Delete</a></li>
		</ul>
	</div>
	<div class="bot">
		<ul class="bot2">
			<li class="move_down"><a onclick="moveBox(this,1,'series'); return false" title="Move Down" href="#">Move Down</a></li>
			<li class="move_bottom"><a onclick="moveBox(this,'bottom','series'); return false" title="Move to Bottom" href="#">Move Bottom</a></li>
			<li class="insert_below"><a onclick="insertBox(this, true); return false" title="Insert New Series Below This One" href="#">Insert Below</a></li>
		</ul>
	</div>
	<div class="series_details">
		<fieldset>
		<legend>Series #$number Details:</legend>

		<label for="series_created_{$number}">Series Created:</label>
		<input type="text" name="series_created_{$number}" id="series_created_{$number}" readonly="readonly" value="$created" /></p>

		<label for="series_updated_{$number}">Series Updated:</label>
		<input type="text" name="series_updated_{$number}" id="series_updated_{$number}" readonly="readonly" value="$updated" /></p>

		<label class="required" for="series_{$number}">Series Title:</label>
		<input type="text" name="series_{$number}" id="series_{$number}" value="$title" /></p>

		<label for="description_{$number}">Description:</label>
		<textarea id="description_{$number}" name="description_{$number}">{$description}</textarea>

		<p><a href="edit.php?series={$number}" target="_blank">Series Index:</a></p>
		<ul>\n
EOT;

		$sqlStatement = "SELECT title FROM sections WHERE series_id={$seriesId} ORDER BY ordinal";
		$sqlResult = mysqli_query($sqlConnection, $sqlStatement) or sqlDie("<p>(E) Query failed - $sqlStatement</p>");
		$numberOfSections = 0;
		while ($row = mysqli_fetch_array($sqlResult, MYSQL_ASSOC)) {
			echo "	<li>{$row['title']}</li>\n";
			$numberOfSections++;
		}
		if ($numberOfSections == 0) {
			echo "	<li>No Sections defined yet.</li>\n";
		}
		echo <<<EOT
		</ul>
				
		<label for="footer_{$number}">Series Footer:</label>
		<textarea id="footer_{$number}" name="footer_{$number}">{$footer}</textarea>
		</fieldset>
	</div>
</div>\n
EOT;
}
?>