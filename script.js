/* 
Data source: data.json.
*** Information for search ***
There are two devices in data.json:
1) Аналитические весы OHAUS Adventurer АХ324 (B715976163), number = B715976163, guid = 508b2a71-662e-4983-ae0c-3cb0c1cd21c5, bid = 49db8db1-585f-4b9e-bbf0-8a59698edc8b, tam = А-001234;
2) Аналитические весы OHAUS Adventurer 1111111 (B1111111), number = B1111111, guid = 1111112, bid = 1111114, tam = 1111111.
*/

var device = "";

function searchData() {
	getDevice(document.getElementById('search_box').value);
	if (device === "") {
		alert("No results. Please try again!");
	} else {
		setDeviceData();
		showDiv("flex_container", "flex");
	}
}

function getDevice(searchValue) {
	var jsonData = JSON.parse(data);
	for (let i = 0; i < jsonData.length; i++) {
		if (jsonData[i].number === searchValue || jsonData[i].guid === searchValue || 
			jsonData[i].bid === searchValue || jsonData[i].tam == searchValue) {
			device = jsonData[i];
		}
	}
}

function setDeviceData() {
	setInnerById('device_name', device.name);
	setInnerById('type', device.type);
	setInnerById('status', device.status);
	setInnerById('made', device.made);
	setInnerById('model', device.model);
	setInnerById('repair', device.repair);
	setInnerById('users', device.users);
	setInnerById('mol', device.mol);
	setInnerById('place', device.place);
	setInnerById('number', device.number);
	setInnerById('guid', device.guid);
	setInnerById('bid', device.bid);
	setInnerById('tam', device.tam);
}

function setInnerById(id, inner) {
	document.getElementById(id).innerHTML = inner;
}

function generateReport() { 
	var reportType = document.querySelector('input[name="n1"]:checked').value;
	switch (reportType) {
		case 'Calibration':
			setInnerById('report_name', "Calibration report");
			deleteAllReportRows();
			generateCalibrationReport();
			break;
		case 'Measuring':
			setInnerById('report_name', "Measuring report");
			deleteAllReportRows();
			break;
		case 'Using':
			setInnerById('report_name', "Using report");
			deleteAllReportRows();
			break;
	}
	showDiv("report_page", "block");
}

function generateCalibrationReport() {
	var sortedCalibrs = searchRowsByDate();
	for (let i = 0; i < sortedCalibrs.length; i++) {
		addRowToReport(sortedCalibrs[i]);
	}
}

function searchRowsByDate() {
	var calibrs = device.calibr;
	var sortedCalibrs = [];
	var selPer = getSelectedPeriod();
	for (let i = 0; i < calibrs.length; i++) {
		if (new Date(calibrs[i].date) > selPer){
			sortedCalibrs.push(calibrs[i]);	
		}
	}
	return sortedCalibrs;
}

function getSelectedPeriod() {
	var sBox = document.getElementById('select_box');
	var nowD = new Date();

	switch (sBox.options[sBox.selectedIndex].value) {
  		case "1":
  			return nowD.setMonth(nowD.getMonth() - 1);
  		case "2":
    		return nowD.setMonth(nowD.getMonth() - 6);
  		case "3":
    		return nowD.setFullYear(nowD.getFullYear() - 1);
	}
}

function addRowToReport(calibration) {
	var tBody = document.getElementById('report_content');
	var row = document.createElement("tr");
	var flag = true;

	addCellToRow(calibration.date.replace(/ /g,'<br>'), "report_font");
	addCellToRow(calibration.buffer.join('<br>'), "report_font1");
	addCellToRow(calibration.slope, "report_font2");
	addPictToRow(isValueBetween(calibration.slope, 95, 105));
	addCellToRow(calibration.offset, "report_font2");
	addPictToRow(isValueBetween(calibration.offset, -20, 20));
	addCellToRow(calibration.user, "report_font3");

	tBody.appendChild(row);

	function addCellToRow(inner, stClass) {
		var td = document.createElement("td");
		td.innerHTML = inner;
		td.className = stClass;
		row.appendChild(td);
	}

	function addPictToRow(isYes) {
		var td = document.createElement("td");
		var img = document.createElement("img");
		if (isYes) {
			img.src = "icons/yes.png";
			img.alt = "yes";
			img.className = "icon_size";
		} else {
			img.src = "icons/no.png";
			img.alt = "no";
			img.className = "icon_size";
		}
		td.appendChild(img);
		row.appendChild(td);
	}

	function isValueBetween(value, a, b){
		if (a < value && value < b) {
			return true;
		} else {
			return false;
		}
	}
}

function deleteAllReportRows() {
	var table = document.getElementById('report_content');
	var rows = table.querySelectorAll('tr');

	for (let i = rows.length - 1; i >= 1; i--) {
		rows[i].remove();
	}
}

function showDiv(id, display) {
	document.getElementById(id).style.display = display;
}