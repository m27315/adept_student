var _nextQuestionNumber = 1;
var _nextSectionNumber = 1;

function insertBox() {
	if (arguments.length > 0) {
		var beforeElem = arguments[0];
		var insertAfter = arguments[1];
		var parentDiv = getParentDivByClassRegex(beforeElem, "_box\\b");

		if (parentDiv) {
			var boxType = parentDiv.className.replace(new RegExp("_box\\b.*"),'');
			var newSection = document.createElement('div');
			newSection.className = boxType + '_box';
			var newInnerHTML = '<p>Box type undefined - ' + boxType + '</p>';
			switch (boxType) {
			case 'series':
				newInnerHTML = '<input type="hidden" name="series_number_' + _nextSeriesNumber 
				+ '" id="series_number_' + _nextSeriesNumber + '" value="' + _nextSeriesNumber 
				+ '" /><input type="hidden" value="new" id="series_id_' 
				+ _nextSeriesNumber + '" name="series_id_' + _nextSeriesNumber + '" /><ul class="top">'
				+ '<li class="move_up"><a href="#" title="Move Up" onclick="moveBox(this,-1,\'series\'); return false">Move Up</a></li>'
				+ '<li class="move_top"><a href="#" title="Move to Top" onclick="moveBox(this,\'top\',\'series\'); return false">Move to Top</a></li>'
				+ '<li class="insert_above"><a href="#" title="Insert New Series Above This One" onclick="insertBox(this); return false">Insert Above</a></li>'
				+ '</ul><div class="mid"><ul class="mid2">'
				+ '<li class="delete"><a href="#" title="Delete This Series" onclick="deleteBox(this,\'series\'); return false">Delete</a></li>'
				+ '</ul></div><div class="bot"><ul class="bot2">'
				+ '<li class="move_down"><a href="#" title="Move Down" onclick="moveBox(this,1,\'series\'); return false">Move Down</a></li>'
				+ '<li class="move_bottom"><a href="#" title="Move to Bottom" onclick="moveBox(this,\'bottom\',\'series\'); return false">Move Bottom</a></li>'
				+ '<li class="insert_below"><a href="#" title="Insert New Series Below This One" onclick="insertBox(this, true); return false">Insert Below</a></li>'
				+ '</ul></div><div class="series_details"><fieldset><legend>Series #' 
				+ _nextSeriesNumber + ' Details:</legend>'
				+ '<label class="required" for="series_' + _nextSeriesNumber + '">Series Title:</label>'
				+ '<input type="text" name="series_' + _nextSeriesNumber + '" id="series_' + _nextSeriesNumber
				+ '" value="some title" /><label for="description_' + _nextSeriesNumber + '">Description:</label>'
				+ '<textarea name="description_' + _nextSeriesNumber + '" id="description_' 
				+ _nextSeriesNumber + '">some description</textarea><p>Series Index:  No lessons yet.</p>'
				+ '<label for="footer_' + _nextSeriesNumber + '">Series Footer:</label>'
				+ '<textarea id="footer_' + _nextSeriesNumber 
				+ '" name="footer_' + _nextSeriesNumber + '">some footer</textarea>'
				+ '</fieldset></div>';

				++_nextSeriesNumber;
				break;

			case 'section':
				newInnerHTML = '<input type="hidden" name="section_number_' + _nextSectionNumber 
				+ '" id="section_number_' + _nextSectionNumber + '" value="' + _nextSectionNumber 
				+ '" /><input type="hidden" value="new" id="section_id_' 
				+ _nextSectionNumber + '" name="section_id_' + _nextSectionNumber + '" /><ul class="top">'
				+ '<li class="move_up"><a href="#" title="Move Up" onclick="moveBox(this,-1,\'section\'); return false">Move Up</a></li>'
				+ '<li class="move_top"><a href="#" title="Move to Top" onclick="moveBox(this,\'top\',\'section\'); return false">Move to Top</a></li>'
				+ '<li class="insert_above"><a href="#" title="Insert New Section Above This One" onclick="insertSection(this); return false">Insert Above</a></li>'
				+ '</ul><div class="mid"><ul class="mid2">'
				+ '<li class="delete"><a href="#" title="Delete This Section" onclick="deleteBox(this,\'section\'); return false">Delete</a></li>'
				+ '</ul></div><div class="bot"><ul class="bot2">'
				+ '<li class="move_down"><a href="#" title="Move Down" onclick="moveBox(this,1,\'section\'); return false">Move Down</a></li>'
				+ '<li class="move_bottom"><a href="#" title="Move to Bottom" onclick="moveBox(this,\'bottom\',\'section\'); return false">Move Bottom</a></li>'
				+ '<li class="insert_below"><a href="#" title="Insert New Section Below This One" onclick="insertSection(this, true); return false">Insert Below</a></li>'
				+ '</ul></div><div class="section_details"><fieldset><legend>Section #' 
				+ _nextSectionNumber + ' Details:</legend>'
				+ '<label class="required" for="section_' + _nextSectionNumber + '">Section Title:</label>'
				+ '<input type="text" name="section_' + _nextSectionNumber + '" id="section_' + _nextSectionNumber
				+ '" value="some title" /><label for="description_' + _nextSectionNumber + '">Description:</label>'
				+ '<textarea name="description_' + _nextSectionNumber + '" id="description_' 
				+ _nextSectionNumber + '">some description</textarea><p>Section Index:</p>'
				+ '<ul><li><a target="_blank" href="edit.php?series=' + _nextSectionNumber 
				+ '&lesson=new&page=1&submit=edit">Create New Lesson</a></li>'
				+ '</ul><label for="footer_' + _nextSectionNumber + '">Section Footer:</label>'
				+ '<textarea id="footer_' + _nextSectionNumber 
				+ '" name="footer_' + _nextSectionNumber + '">some footer</textarea>'
				+ '</fieldset></div>';

				++_nextSectionNumber;
				break;

			}
			newSection.innerHTML = newInnerHTML;

			var boxParent = parentDiv.parentNode;
			if (insertAfter) {
				var nextElement = getNextSibling(parentDiv);
				if (nextElement) {
					boxParent.insertBefore(newSection, nextElement);
				} else {
					boxParent.appendChild(newSection);
				}
			} else {
				boxParent.insertBefore(newSection, parentDiv);
			}

			updateOrderNumber(boxParent, boxType);
		}
	}
}

function insertSection() {
	if (arguments.length > 0) {
		var beforeElem = arguments[0];
		var insertAfter = arguments[1];
		var parentDiv = getParentDivByClass(beforeElem, 'section_box') || getParentDiv(beforeElem);

		if (parentDiv) {
			var newSection = document.createElement('div');
			newSection.className = "section_box";
			var newInnerHTML = '<input type="hidden" name="section_number_' + _nextSectionNumber 
			+ '" id="section_number_' + _nextSectionNumber + '" value="' + _nextSectionNumber 
			+ '" /><input type="hidden" value="new" id="section_id_' 
			+ _nextSectionNumber + '" name="section_id_' + _nextSectionNumber + '" /><ul class="top">'
			+ '<li class="move_up"><a href="#" title="Move Up" onclick="moveBox(this,-1,\'section\'); return false">Move Up</a></li>'
			+ '<li class="move_top"><a href="#" title="Move to Top" onclick="moveBox(this,\'top\',\'section\'); return false">Move to Top</a></li>'
			+ '<li class="insert_above"><a href="#" title="Insert New Section Above This One" onclick="insertSection(this); return false">Insert Above</a></li>'
			+ '</ul><div class="mid"><ul class="mid2">'
			+ '<li class="delete"><a href="#" title="Delete This Section" onclick="deleteBox(this,\'section\'); return false">Delete</a></li>'
			+ '</ul></div><div class="bot"><ul class="bot2">'
			+ '<li class="move_down"><a href="#" title="Move Down" onclick="moveBox(this,1,\'section\'); return false">Move Down</a></li>'
			+ '<li class="move_bottom"><a href="#" title="Move to Bottom" onclick="moveBox(this,\'bottom\',\'section\'); return false">Move Bottom</a></li>'
			+ '<li class="insert_below"><a href="#" title="Insert New Section Below This One" onclick="insertSection(this, true); return false">Insert Below</a></li>'
			+ '</ul></div><div class="section_details"><fieldset><legend>Section #' 
			+ _nextSectionNumber + ' Details:</legend>'
			+ '<label class="required" for="section_' + _nextSectionNumber + '">Section Title:</label>'
			+ '<input type="text" name="section_' + _nextSectionNumber + '" id="section_' + _nextSectionNumber
			+ '" value="some title" /><label for="description_' + _nextSectionNumber + '">Description:</label>'
			+ '<textarea name="description_' + _nextSectionNumber + '" id="description_' 
			+ _nextSectionNumber + '">some description</textarea><p>Section Index:</p>'
			+ '<ul><li><a target="_blank" href="edit.php?series=' + _nextSectionNumber 
			+ '&lesson=new&page=1&submit=edit">Create New Lesson</a></li>'
			+ '</ul><label for="footer_' + _nextSectionNumber + '">Section Footer:</label>'
			+ '<textarea id="footer_' + _nextSectionNumber 
			+ '" name="footer_' + _nextSectionNumber + '">some footer</textarea>'
			+ '</fieldset></div>';

			newSection.innerHTML = newInnerHTML;

			var sectionBoxParent = parentDiv.parentNode;
			if (insertAfter) {
				var nextElement = getNextSibling(parentDiv);
				if (nextElement) {
					sectionBoxParent.insertBefore(newSection, nextElement);
				} else {
					sectionBoxParent.appendChild(newSection);
				}
			} else {
				sectionBoxParent.insertBefore(newSection, parentDiv);
			}

			++_nextSectionNumber;

			updateOrderNumber(sectionBoxParent, 'section');
		}
	}
}

function updateOrderNumber(boxParent, boxType) {
	var order = new Array();
	var boxes = getElementsByClass(boxParent, 'div', boxType + '_box');
	var boxesLength = boxes.length;
	var box;
	var className;
	for (var i = 0; i < boxesLength; i++) {
		box = boxes[i];
		order.push(getOrderNumber(box, boxType));
		if (i & 1) {
			className = "even";
		} else {
			className = "odd";
		}
		box.className = boxType + '_box ' + className;
		box.getElementsByTagName('legend')[0].innerHTML = boxType.substring(0, 1).toUpperCase() + boxType.substring(1).toLowerCase() + ' #' + (i+1) + ' Details:';
	}
	document.getElementById(boxType + '_order').value = order.join(',');
}

function getOrderNumber(box, boxType) {
	var inputs = box.getElementsByTagName('input');
	if (inputs) {
		var inputsLength = inputs.length;
		var input;
		var pattern = new RegExp('^' + boxType + '_number_\\d+$');
		for (var i = 0; i < inputsLength; ++i) {
			input = inputs[i];
			if (input.type.toLowerCase() == "hidden" && pattern.test(input.name)) {
				return input.value;
			}
		}
	}
	return null;
}


function moveBox(box, amount, boxType) {
	if (box && amount && boxType) {
		var parentDiv = getParentDivByClass(box, boxType + '_box');
		if (parentDiv) {
			var boxParent = parentDiv.parentNode; 
			var boxes = getElementsByClass(boxParent, 'div', boxType + '_box');
			if (boxes) {
				if (amount == 'top') {
					var firstBox = boxes[0];
					if (parentDiv != firstBox) {
						boxParent.insertBefore(parentDiv, firstBox);
					}
				} else if (amount == 'bottom') {
					var lastBox = boxes[boxes.length-1];
					if (parentDiv != lastBox) {
						var nextElement = getNextSibling(lastBox);
						if (nextElement) {
							boxParent.insertBefore(parentDiv, nextElement);
						} else {						
							boxParent.appendChild(parentDiv);
						}
					}
				} else if (amount > 0) {
					var k = null;
					var boxesLength = boxes.length;
					for (var i = 0; i < boxesLength; i++) {
						if (boxes[i] == parentDiv) {
							k = i;
						}
					}
					if (k != null) {
						k += amount;
						if (k >= boxesLength) {
							k = boxesLength - 1;
						}
						var nextElement = getNextSibling(boxes[k]);
						if (nextElement) {
							boxParent.insertBefore(parentDiv, nextElement);
						} else {
							boxParent.appendChild(parentDiv);
						}
					}
				} else if (amount < 0) {
					var k = null;
					var boxesLength = boxes.length;
					for (var i = 0; i < boxesLength; i++) {
						if (boxes[i] == parentDiv) k = i;
					}
					if (k != null) {
						k += amount;
						if (k < 0) k = 0;
						boxParent.insertBefore(parentDiv, boxes[k]);
					}
				}
				updateOrderNumber(boxParent, boxType);
			}
		}
	}
}

function deleteBox(box, boxType) {
	if (box) {
		var parentDiv = getParentDivByClass(box, boxType + '_box');
		if (parentDiv) {
			var boxParent = parentDiv.parentNode; 
			boxParent.removeChild(parentDiv);
			updateOrderNumber(boxParent, boxType);
		}
	}
}

function insertField() {
	if (arguments.length > 0) {
		var beforeElem = arguments[0];
		var insertAfter = arguments[1];
		var parentDiv = getParentDivByClass(beforeElem, 'question_box') || getParentDiv(beforeElem);

		if (parentDiv) {
			var newFieldType = parentDiv.getElementsByTagName("select")[0];
			if (newFieldType) {
				newFieldType = newFieldType[newFieldType.selectedIndex].value.toLowerCase();
				var newField = document.createElement('div');
				newField.className = "question_box";
				var selectOptions = '';
				var possibleOptions = 'text,textarea,checkbox,radio,select'.split(',');
				var possibleOptionsLength = possibleOptions.length;
				for (var i = 0; i < possibleOptionsLength; i++) {
					if (possibleOptions[i] == newFieldType) {
						selectOptions += '<option value="' + possibleOptions[i] + '" selected="selected">' + possibleOptions[i] + '</option>';	
					} else {
						selectOptions += '<option value="' + possibleOptions[i] + '">' + possibleOptions[i] + '</option>';	
					}
				}
				var questionDetails = '';
				switch (newFieldType) {
				case "text":
					questionDetails = '<label for="answer_' + _nextQuestionNumber + '" class="required">Answer:</label><input type="text" name="answer_' + _nextQuestionNumber + '" id="answer_' + _nextQuestionNumber + '" />';
					break;
				case "textarea":
					questionDetails = '<label for="answer_' + _nextQuestionNumber + '" class="required">Answer:</label><textarea name="answer_' + _nextQuestionNumber + '" id="answer_' + _nextQuestionNumber + '"></textarea>';
					break;
				case "checkbox":
				case "radio":
				case "select":
					questionDetails = '<label for="options_' + _nextQuestionNumber 
					+ '" class="required">Number of Options:</label><input type="text" name="options_' 
					+ _nextQuestionNumber + '" id="options_' + _nextQuestionNumber 
					+ '" value="2" onChange="updateNumberOfOptions(this)" /><label for="options_' + _nextQuestionNumber 
					+ '_value_1">Option #1:</label><input type="text" name="options_' 
					+ _nextQuestionNumber + '_value_1" id="options_' + _nextQuestionNumber 
					+ '_value_1" /><label for="options_' + _nextQuestionNumber 
					+ '_value_2">Option #2:</label><input type="text" name="options_' 
					+ _nextQuestionNumber + '_value_2" id="options_' + _nextQuestionNumber 
					+ '_value_2" />';
					break;
				}
				var newInnerHTML = '<input type="hidden" name="question_number_' + _nextQuestionNumber 
				+ '" id="question_number_' + _nextQuestionNumber + '" value="' + _nextQuestionNumber 
				+ '" /><input type="hidden" name="question_type_' + _nextQuestionNumber 
				+ '" id="question_type_' + _nextQuestionNumber + '" value="' + newFieldType + '" />'
				+ '<ul class="top">'
				+ '<li class="move_up"><a href="#" title="Move Up" onclick="moveBox(this,-1,\'question\'); return false">Move Up</a></li>'
				+ '<li class="move_top"><a href="#" title="Move to Top" onclick="moveBox(this,\'top\',\'question\'); return false">Move to Top</a></li>'
				+ '<li class="insert_above"><a href="#" title="Insert New Question Above This One" onclick="insertField(this); return false">Insert Above</a></li>'
				+ '</ul><div class="mid"><ul class="mid2">'
				+ '<li class="delete"><a href="#" title="Delete This Question" onclick="deleteBox(this,\'question\'); return false">Delete</a></li>'
				+ '<li><select name="change_field" onChange="changeField(this); return false">' + selectOptions + '</select></li>' 
				+ '</ul></div><div class="bot"><ul class="bot2">'
				+ '<li class="move_down"><a href="#" title="Move Down" onclick="moveBox(this,1,\'question\'); return false">Move Down</a></li>'
				+ '<li class="move_bottom"><a href="#" title="Move to Bottom" onclick="moveBox(this,\'bottom\',\'question\'); return false">Move Bottom</a></li>'
				+ '<li class="insert_below"><a href="#" title="Insert New Question Below This One" onclick="insertField(this, true); return false">Insert Below</a></li>'
				+ '</ul></div><div class="question_details"><fieldset><legend>Question Details:</legend>'
				+ '<label for="preface_' + _nextQuestionNumber + '">Preface:</label><textarea name="preface_' 
				+ _nextQuestionNumber + '" id="preface_' + _nextQuestionNumber + '"></textarea><label for="question_' 
				+ _nextQuestionNumber + '" class="required">Question:</label><textarea name="question_' 
				+ _nextQuestionNumber + '" id="question_' + _nextQuestionNumber + '"></textarea><label for="hint_' 
				+ _nextQuestionNumber + '">Hint:</label><textarea name="hint_' + _nextQuestionNumber 
				+ '" id="hint_' + _nextQuestionNumber + '"></textarea>' + questionDetails + '<label for="explanation_' 
				+ _nextQuestionNumber + '">Explanation:</label><textarea name="explanation_' + _nextQuestionNumber 
				+ '" id="explanation_' + _nextQuestionNumber + '"></textarea></fieldset> </div>';

				newField.innerHTML = newInnerHTML;

				var questionBoxParent = parentDiv.parentNode;
				if (insertAfter) {
					var nextElement = getNextSibling(parentDiv);
					if (nextElement) {
						questionBoxParent.insertBefore(newField, nextElement);
					} else {
						questionBoxParent.appendChild(newField);
					}
				} else {
					questionBoxParent.insertBefore(newField, parentDiv);
				}

				++_nextQuestionNumber;

				updateOrderNumber(questionBoxParent, 'question');
				// updateQuestionNumber(questionBoxParent);
			}
		}
	}
}

function getNextSibling(node) {
	do {
		node = node.nextSibling;
	} while (node && node.nodeType == 3);
	return node;
}

function getPreviousSibling(node) {
	do {
		node = node.previousSibling;
	} while (node && node.nodeType == 3);
	return node;
}

function getBoxType(elem) {
	var className = elem.className || '';
	var pattern = new RegExp("\\S+_box");
	return pattern.exec(className).slice(0, -4);
}

function updateQuestionNumber(questionBoxParent) {
	var questionOrder = new Array();
	var questionBoxes = getElementsByClass(questionBoxParent, 'div', 'question_box');
	var questionBoxesLength = questionBoxes.length;
	var box;
	var className;
	for (var i = 0; i < questionBoxesLength; i++) {
		box = questionBoxes[i];
		questionOrder.push(getQuestionNumber(box));
		if (i & 1) {
			className = "odd";
		} else {
			className = "even";
		}
		box.className = "question_box " + className;
		box.getElementsByTagName('legend')[0].innerHTML = 'Question #' + (i+1) + ' Details:';
	}
	document.getElementById('question_order').value = questionOrder.join(',');
}

function getQuestionNumber(container) {
	var inputs = container.getElementsByTagName('input');
	if (inputs) {
		var inputsLength = inputs.length;
		var input;
		var pattern = new RegExp('^question_number_\\d+$');
		for (var i = 0; i < inputsLength; ++i) {
			input = inputs[i];
			if (input.type.toLowerCase() == "hidden" && pattern.test(input.name)) {
				return input.value;
			}
		}
	}
	return null;
}

function getQuestionType(container) {
	var inputs = container.getElementsByTagName('input');
	if (inputs) {
		var inputsLength = inputs.length;
		var input;
		var pattern = new RegExp('^question_type_\\d+$');
		for (var i = 0; i < inputsLength; ++i) {
			input = inputs[i];
			if (input.type.toLowerCase() == "hidden" && pattern.test(input.name)) {
				return input.value;
			}
		}
	}
	return null;
}

function updateQuestionType(container, newType) {
	var inputs = container.getElementsByTagName('input');
	var oldValue;
	if (inputs) {
		var inputsLength = inputs.length;
		var input;
		var pattern = new RegExp('^question_type_\\d+$');
		for (var i = 0; i < inputsLength; ++i) {
			input = inputs[i];
			if (input.type.toLowerCase() == "hidden" && pattern.test(input.name)) {
				oldValue = input.value;
				input.value = newType;
			}
		}
	}
	return oldValue;
}

function changeField(selectField) {
	if (selectField) {
		var parentDiv = getParentDivByClass(selectField, 'question_box');
		if (parentDiv) {
			var newFieldType = selectField[selectField.selectedIndex].value.toLowerCase();
			var oldFieldType = updateQuestionType(parentDiv, newFieldType);
			// var questionNumber = getQuestionNumber(parentDiv);
			var questionNumber = getOrderNumber(parentDiv, 'question');
			// alert("Question " + questionNumber + ": Old Type=" + oldFieldType
			// + ", New Type=" + newFieldType);
			if (oldFieldType == 'text' || oldFieldType == 'textarea') {
				if (newFieldType == 'textarea' || newFieldType == 'text') {
					convertTextField(parentDiv);
				} else {
					convertTextToOptionsField(parentDiv, questionNumber);
				}
			} else if (newFieldType == 'textarea' || newFieldType == 'text') {
				// oldFieldType = checkbox, radio, or select
				convertOptionsToTextField(parentDiv, newFieldType, questionNumber);
			}
		}
	}
}

function updateNumberOfOptions(numberOfOptionsField) {
	if (numberOfOptionsField) {
		var parent = numberOfOptionsField.parentNode;
		// var questionNumber =
		// getQuestionNumber(getParentDivByClass(parent,'question_box'));
		var questionNumber = getOrderNumber(getParentDivByClass(parent,'question_box'),'question');
		var numberOfOptions = parseInt(numberOfOptionsField.value);
		if (/^\d+$/.test(numberOfOptions) && numberOfOptions > 1) {
			var elements = parent.childNodes;
			var elementsLength = elements.length;
			var elem;
			var elemNumber;
			var elementsToDelete = new Array();
			var pattern = new RegExp("^options_" + questionNumber + "_");
			var maxOptionsFound = 0;
			var lastOptionFound;
			for (var i = 0; i < elementsLength; ++i) {
				elem = elements[i];
				if (elem.nodeType != 3) {
					elemNumber = elem.getAttribute('for') || elem.name;
					if (pattern.test(elemNumber)) {
						elemNumber = parseInt(elemNumber.substring(elemNumber.lastIndexOf('_')+1));
						if (elemNumber > numberOfOptions) {
							elementsToDelete.push(elem);
						}
						if (elemNumber > maxOptionsFound) {
							maxOptionsFound = elemNumber;
						}
						lastOptionFound = elem;
					}
				}
			}
			elementsLength = elementsToDelete.length;
			for (i = 0; i < elementsLength; ++i) {
				parent.removeChild(elementsToDelete[i]);
			}
			var nextField = getNextSibling(lastOptionFound);
			for (i = maxOptionsFound+1; i <= numberOfOptions; ++i) {
				createOptionsFields(parent, questionNumber, i, nextField);
			}
		} else {
			alert("Number of options must be at least 2 (current value=" + numberOfOptionsField.value + ")");
		}
	}
}

function getExplanationTextArea(questionBox) {
	if (questionBox) {
		var textAreaFields = questionBox.getElementsByTagName('textarea');
		if (textAreaFields) {
			var textAreaFieldsLength = textAreaFields.length;
			var field;
			var previousField;
			var pattern = new RegExp("^explanation_\\d+$");
			for (var i = 0; i < textAreaFieldsLength; ++i) {
				field = textAreaFields[i];
				if (pattern.test(field.name)) {
					return getPreviousSibling(field);
				}
				previousField = field;
			}
		}
	}
	return null;
}

function convertTextToOptionsField(questionBox, questionNumber) {
	if (questionBox && questionNumber) {
		var textField = getTextField(questionBox);
		if (textField) {
			questionBox = textField.parentNode;
			var nextField = getNextSibling(textField);

			var newLabel = document.createElement('label');
			newLabel.setAttribute('for', 'options_' + questionNumber);
			newLabel.innerHTML = "Number of Options:";
			newLabel.className = "required";
			questionBox.replaceChild(newLabel,getPreviousSibling(textField));

			var newField = document.createElement('input');
			newField.setAttribute('type', 'text');
			newField.setAttribute('name', 'options_' + questionNumber);
			newField.setAttribute('id', 'options_' + questionNumber);
			newField.setAttribute('onChange', 'updateNumberOfOptions(this)');
			newField.value = "2";
			questionBox.replaceChild(newField,textField);

			for (var i=1; i <= 2; ++i) {
				createOptionsFields(questionBox, questionNumber, i, nextField);
			}
		}
	}
}

function createOptionsFields(parent, questionNumber, i, nextField) {
	var newLabel = document.createElement('label');
	newLabel.setAttribute('for', 'options_' + questionNumber + '_value_' + i);
	newLabel.innerHTML = 'Option #' + i + ' - Value:';
	parent.insertBefore(newLabel, nextField);

	var newField = document.createElement('input');
	newField.setAttribute('type', 'text');
	newField.setAttribute('name', 'options_' + questionNumber + '_value_' + i);
	newField.setAttribute('id', 'options_' + questionNumber + '_value_' + i);
	parent.insertBefore(newField, nextField);
	/*
	 * newLabel = document.createElement('label'); newLabel.setAttribute('for',
	 * 'options_' + questionNumber + '_label_' + i); newLabel.innerHTML =
	 * 'Option #' + i + ' - Label:'; parent.insertBefore(newLabel, nextField);
	 * 
	 * newField = document.createElement('input'); newField.setAttribute('type',
	 * 'text'); newField.setAttribute('name', 'options_' + questionNumber +
	 * '_label_' + i); newField.setAttribute('id', 'options_' + questionNumber +
	 * '_label_' + i); parent.insertBefore(newField, nextField);
	 */
}

function convertOptionsToTextField(questionBox, newFieldType, questionNumber) {
	if (questionBox && newFieldType && questionNumber) {
		var explanation = getExplanationTextArea(questionBox);
		if (explanation) {
			questionBox = explanation.parentNode;
			var elements = questionBox.childNodes;
			var elementsLength = elements.length;
			var elementsToDelete = new Array();
			var pattern = new RegExp("^options_");
			var elem;
			for (var i = 0; i < elementsLength; ++i) {
				if (elem = elements[i]) {
					var tagName = elem.tagName;
					if (tagName && tagName.toLowerCase() == 'label') {
						if (pattern.test(elem.getAttribute('for'))) {
							elementsToDelete.push(elem);
						}
					} else if (pattern.test(elem.name)) {
						elementsToDelete.push(elem);
					}
				}
			}
			var elementsToDeleteLength = elementsToDelete.length;
			for (i = 0; i < elementsToDeleteLength; ++i) {
				questionBox.removeChild(elementsToDelete[i]);
			}
			var newLabel = document.createElement('label');
			newLabel.setAttribute('for', 'answer_' + questionNumber);
			newLabel.innerHTML = "Answer:";
			newLabel.className = "required";
			questionBox.insertBefore(newLabel, explanation);
			var newTextField;
			if (newFieldType == 'textarea') {
				newTextField = document.createElement('textarea');
			} else {
				newTextField = document.createElement('input');
				newTextField.setAttribute('type', 'text');
			}
			newTextField.setAttribute('name', 'answer_' + questionNumber);
			newTextField.setAttribute('id', 'answer_' + questionNumber);
			questionBox.insertBefore(newTextField, explanation);
			return newTextField;
		}
	}
	return null;
}

function getTextField(questionBox) {
	if (questionBox) {
		var fieldset = getElementsByClass(questionBox, 'div', 'question_details')[0].getElementsByTagName('fieldset')[0];
		if (fieldset) {
			var elements = fieldset.childNodes;
			if (elements) {
				var elementsLength = elements.length;
				var elem;
				var pattern = new RegExp("^answer_");
				for (var i = 0; i < elementsLength; ++i) {
					elem = elements[i];
					if (pattern.test(elem.name)) {
						return elem;
					}
				}
			}
		}
	}
	return null;
}

function convertTextField(questionBox) {
	var field = getTextField(questionBox);
	if (field) {
		var name = field.name;
		var id = field.getAttribute('id');
		var value = field.value;
		var newTextField;
		if (field.tagName.toLowerCase() == 'textarea') {
			newTextField = document.createElement('input');
			newTextField.setAttribute('type', 'text');
		} else {
			newTextField = document.createElement('textarea');
		}
		newTextField.setAttribute('name', name);
		newTextField.setAttribute('id', id);
		newTextField.value = value;
		field.parentNode.replaceChild(newTextField,field);
		return newTextField;
	}
}

function deleteField(field) {
	if (field) {
		var parentDiv = getParentDivByClass(field, 'question_box');
		if (parentDiv) {
			var questionBoxParent = parentDiv.parentNode; 
			questionBoxParent.removeChild(parentDiv);
			updateQuestionNumber(questionBoxParent);
		}
	}
}

function moveField(field, amount) {
	if (field && amount) {
		var parentDiv = getParentDivByClass(field, 'question_box');
		if (parentDiv) {
			var questionBoxParent = parentDiv.parentNode; 
			var questionBoxes = getElementsByClass(questionBoxParent, 'div', 'question_box');
			if (questionBoxes) {
				if (amount == 'top') {
					var firstQuestionBox = questionBoxes[0];
					if (parentDiv != firstQuestionBox) {
						questionBoxParent.insertBefore(parentDiv, firstQuestionBox);
					}
				} else if (amount == 'bottom') {
					var lastQuestionBox = questionBoxes[questionBoxes.length-1];
					if (parentDiv != lastQuestionBox) {
						var nextElement = getNextSibling(lastQuestionBox);
						if (nextElement) {
							questionBoxParent.insertBefore(parentDiv, nextElement);
						} else {						
							questionBoxParent.appendChild(parentDiv);
						}
					}
				} else if (amount > 0) {
					var k = null;
					var questionBoxesLength = questionBoxes.length;
					for (var i = 0; i < questionBoxesLength; i++) {
						if (questionBoxes[i] == parentDiv) {
							k = i;
						}
					}
					if (k != null) {
						k += amount;
						if (k >= questionBoxesLength) {
							k = questionBoxesLength - 1;
						}
						var nextElement = getNextSibling(questionBoxes[k]);
						if (nextElement) {
							questionBoxParent.insertBefore(parentDiv, nextElement);
						} else {
							questionBoxParent.appendChild(parentDiv);
						}
					}
				} else if (amount < 0) {
					var k = null;
					var questionBoxesLength = questionBoxes.length;
					for (var i = 0; i < questionBoxesLength; i++) {
						if (questionBoxes[i] == parentDiv) k = i;
					}
					if (k != null) {
						k += amount;
						if (k < 0) k = 0;
						questionBoxParent.insertBefore(parentDiv, questionBoxes[k]);
					}
				}
				updateQuestionNumber(questionBoxParent);
			}
		}
	}
}

function verifyDeletion(formId) {
	if (confirm("Tem certeza que deseje deletar contatos?")) {
		var form;
		if (formId && (form = document.getElementById(formId))) {
			form.action = "delete.php";
		}
		return true;
	}
	return false;
}

function validateAnyForm(form) {
	var fail  = highlightError(form.email, validateEmail4(form.email.value));
	var stringFields = Array(
			{"field": form.nome, 		"message": "Por favor, digite seu nome completo."},
			{"field": form.endereco, 	"message": "Por favor, digite seu endereço completo."},
			{"field": form.bairro, 		"message": "Por favor, digite o nome do seu bairro."},
			{"field": form.cidade, 		"message": "Por favor, digite o nome da sua cidade."},
			{"field": form.estado, 		"message": "Por favor, escolha seu estado."},
			{"field": form.cep, 		"message": "Por favor, digite seu CEP."},
			{"field": form.telefone, 	"message": "Por favor, digite seu número de telefone, ou digite \"nenhum\"."},
			{"field": form.country, 	"message": "Por favor, escolha seu país."},
			{"field": form.idade,	 	"message": "Por favor, escolha sua faixa etária."},
			{"field": form.data,		"message": "Por favor, digite a data do seu primeiro contato."}
	);
	// document.write("<p>StringFields: (length=" + stringFields.length + ") " +
	// stringFields.toString() + "</p>\n");
	var tup;
	for (var i = 0 ; i < stringFields.length ; ++i) {
		if (tup = stringFields[i]) {
			// document.write("<p>!!!! i=" + i + ", tup=" + tup + "</p>\n");
			if (field = tup["field"]) {
				message = tup["message"];
				// document.write("<p>i=" + i + ", field: " + field.name + ",
				// value=" + field.value + ", message=" + message + "</p>\n");
				fail += highlightError(field, validateString(field.value, message));
			}
		}
	}
	var radioFields = Array(
			{"fields": form.elements["sexo"],	"message": "Por favor, indique seu sexo."}		
	);
	var fields;
	for (var i = 0; i < radioFields.length; ++i) {
		if ((tup = radioFields[i]) && (fields = tup["fields"])) {
			fail += highlightError(fields[0], validateRadio(fields, tup["message"]));
		}
	}
	var checkBoxFields = Array(
			{"prefix": "id_",		"message": "Para completar este formulário, por favor, assinale pelo menos um horário de estudo a qual você pretende assistir."}		
	);
	for (var i = 0; i < checkBoxFields.length; ++i) {
		if (tup = checkBoxFields[i]) {
			fail += validateCheckBox(form, tup["prefix"], 1, tup["message"]);
		}
	}
	if (fail == "") { 
		return true;
	} else {
		alert("   *** Informações necessárias que ainda faltam ***\n\n" + fail);
		return false;
	}
}

function highlightError(field, returnValue, id) {
	// Changes font and background colors to shades of red to highlight any
	// fields with erroneous data.
	var skipFocus = false;
	var parent = null;
	var tag;
	if (id && (parent = document.getElementById(id))) {
		skipFocus = true;
	} else {
		parent = field;
		var j = 1;
		do {
			j++;
			if (parent = parent.parentNode) {
				tag = parent.tagName;
			} else {
				tag = "<NO-TAG>";
			}
// document.write("<p>j=" + j + ", parent=" + tag + ", returnValue=" +
// returnValue + "</p>\n");
		} while ((j < 10) && parent && (tag != "P") && (tag != "TR"));
	}
	if (parent && (tag = parent.tagName) && (tag == "P") || (tag == "TR")) {
		if (returnValue == "") {
			if (/_error$/.test(parent.className)) {
				parent.className = parent.className.replace("_error", "");
			}
		} else {
			if (! /_error$/.test(parent.className)) {
				parent.className += "_error";
				if (! skipFocus) {
					field.focus();
				}
			}
		}
	}
	return returnValue;
}

function removeErrorHighlight(elem) {
	var parent = getParent(elem);
	if (parent && /_error$/.test(parent.className)) {
		parent.className = parent.className.replace("_error", "");
	}
}

function addErrorHighlight(elem) {
	var parent = getParent(elem);
	if (parent && (! /_error$/.test(parent.className))) {
		parent.className += "_error";
	}
}

function setAllInParent(link, checked) {
	if (link) {
		if (! checked) checked = false;
		var parent = getParent(link);
		if (parent && (tag = parent.tagName) && (tag =="P") || (tag == "TR")) {
			var checkBoxes = parent.getElementsByTagName("input");
			if (checkBoxes) {
				for (var i = 0; i < checkBoxes.length; ++i) {
					var checkBox = checkBoxes[i];
					if (checkBox && (checkBox.type.toLowerCase() == "checkbox")) {
						checkBox.checked = checked;
					}
				}
			}
		}
	} 
	return false;
}

function getParent(obj) {
	var tag;
	if (obj) {
		do {
			if (obj = obj.parentNode) {
				tag = obj.tagName.toLowerCase();
			} else {
				tag = null;
			}
		} while (obj && (tag != "p") && (tag != "tr"));
		if (obj && (tag = obj.tagName.toLowerCase()) && (tag == "p" || tag == "tr")) {
			return obj;
		}
	}
	return null;
}

function getParentDiv(obj) {
	var tag;
	if (obj) {
		do {
			if (obj = obj.parentNode) {
				tag = obj.tagName.toLowerCase();
			} else {
				tag = null;
			}
		} while (obj && (tag != "div"));
		if (obj && (tag = obj.tagName.toLowerCase()) && (tag == "div")) {
			return obj;
		}
	}
	return null;
}

function getParentDivByClass(obj, className) {
	var thisTag;
	var thisClass;
	pattern = new RegExp("\\b" + className + "\\b");
	if (obj) {
		do {
			if (obj = obj.parentNode) {
				thisTag = obj.tagName;
				if (thisTag) {
					thisTag = thisTag.toLowerCase();
				}
				thisClass = obj.className;
			} else {
				thisTag = null;
				thisClass = null;
			}
		} while (obj && !((thisTag == "div") && pattern.test(thisClass)));
		if (obj && 
				(thisTag = obj.tagName) && (thisTag = thisTag.toLowerCase()) && (thisTag == "div") && 
				(thisClass = obj.className) && pattern.test(thisClass)) {

			return obj;
		}
	}
	return null;
}

function getParentDivByClassRegex(obj, classNameRegex) {
	var thisTag;
	var thisClass;
	pattern = new RegExp(classNameRegex);
	if (obj) {
		do {
			if (obj = obj.parentNode) {
				thisTag = obj.tagName;
				if (thisTag) {
					thisTag = thisTag.toLowerCase();
				}
				thisClass = obj.className;
			} else {
				thisTag = null;
				thisClass = null;
			}
		} while (obj && !((thisTag == "div") && pattern.test(thisClass)));
		if (obj && 
				(thisTag = obj.tagName) && (thisTag = thisTag.toLowerCase()) && (thisTag == "div") && 
				(thisClass = obj.className) && pattern.test(thisClass)) {

			return obj;
		}
	}
	return null;
}

function deleteAllTextNodes() {
	var documentTextNodes = document.getElementsByTagName('TextNode');
	var documentTextNodesLength = documentTextNodes.length;
	for (var i=0; i < documentTextNodesLength; ++i) {
		var elem = documentTextNodes[i];
		elem.parentNode.removeChild(elem);
	}
}

function getElementsByClass(domNode, tagName, searchClass) {
	if (domNode == null) domNode = document;
	var elements;
	if (tagName == null || tagName == '*') {
		elements = domNode.childNodes;
	} else {
		elements = domNode.getElementsByTagName(tagName);
	}
	var elementsLength = elements.length;
	var returnElements = new Array();
	var searchClassPattern = new RegExp('\\b' + searchClass + '\\b');
	for(var i=0; i < elementsLength; ++i) {
		var elem = elements[i];
		if (searchClassPattern.test(elem.className)) returnElements.push(elem);
	}
	return returnElements;
}

function validateEmail(field) {
	if (field == "") {
		return "É necessário digitar um e-mail válido.\n\n";
	} else if (! (
			(field.indexOf("@") > 0) && (field.indexOf(".", field.indexOf("@")) > 0))
			|| /[^a-zA-Z0-9.@_-]/.test(field)
	) {
		return "Este e-mail é inválido.\n\n";
	}
	return "";
}

function validateEmail2(str) {

	var at="@";
	var dot=".";
	var lat=str.indexOf(at);
	var lstr=str.length;
	var ldot=str.indexOf(dot);

	if (str.indexOf(at)==-1){
		return "Este e-mail é inválido.\n\n";
	}
	if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr) {
		return "Este e-mail é inválido.\n\n";
	}
	if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr) {
		return "Este e-mail é inválido.\n\n";
	}
	if (str.indexOf(at,(lat+1))!=-1) {
		return "Este e-mail é inválido.\n\n";
	}
	if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot) {
		return "Este e-mail é inválido.\n\n";
	}
	if (str.indexOf(dot,(lat+2))==-1) {
		return "Este e-mail é inválido.\n\n";
	}
	if (str.indexOf(" ")!=-1) {
		return "Este e-mail é inválido.\n\n";
	}
	return "";
}

function validateEmail3(string) {
	if (string.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
		return "";
	else
		return "Este e-mail é inválido.\n\n";
}

function validateEmail4(string) {
	if (string.search(/^[a-zA-Z]+([_\.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\.-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,4})+$/) != -1)
		return "";
	else
		return "Este e-mail é inválido.\n\n";
}

function validateRadio(fields, message) {
	var aCheck = false;
	if (fields && fields.length > 0) {
		for (i = 0; i < fields.length; ++i) {
			if (fields[i].checked) aCheck = true;
		}
	}
	if (aCheck) {
		return "";
	} else if (message) {
		return message;
	} else {
		return "Error! Field was undefined!";
	}
}

function validateString(field, message) {
	if (field && field.length > 1) {
		return "";
	} else if (message) {
		return message + "\n\n";
	} else {
		return "Error! Field was undefined!";
	}
}

function validateCheckBox(form, prefix, minimumChecked, message) {
	var boxesFound = 0;
	var boxesChecked = 0;
	var checkBoxes = form.getElementsByTagName("input");
	var uncheckedBoxes = new Array;
	if (checkBoxes) {
		var checkBoxesLength = checkBoxes.length;
		for (var i = 0; i < checkBoxesLength; ++i) {
			var checkBox = checkBoxes[i];
			if (checkBox && (checkBox.type.toLowerCase() == "checkbox") && (checkBox.name.indexOf(prefix) == 0)) {
				++boxesFound;
				removeErrorHighlight(checkBox);
				if (checkBox.checked) {
					++boxesChecked;
				} else {
					uncheckedBoxes.push(checkBox);
				}
			}
		}
	}
	if (minimumChecked > 0 && boxesFound >= minimumChecked && boxesChecked < minimumChecked) {
		var uncheckedBoxesLength = uncheckedBoxes.length;
		for (var i = 0; i < uncheckedBoxesLength; ++i) {
			addErrorHighlight(uncheckedBoxes[i]);
		}
		if (message) {
			return message + "\n\n";
		} else {
			return "(E) At least " + minimumChecked + " boxes must be checked out of the " + boxesFound + " check boxes.\n\n";
		}
	} else {
		return "";
	}
}
