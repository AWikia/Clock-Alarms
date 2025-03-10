(function () {

		document.querySelector("head").insertAdjacentHTML('afterbegin', 
		'<link rel="manifest" href="manifest.json" crossorigin="use-credentials">' +
		// Standard Light
		'<link rel="shortcut icon" href="favicon.ico">' +
		'<link rel="icon" href="favicon.ico">' +
		'<link rel="favicon" href="favicon.ico">' +
		// Standard Dark
		'<link rel="shortcut icon" href="favicon_dark.ico" media="(prefers-color-scheme:dark)">' +
		'<link rel="icon" href="favicon_dark.ico" media="(prefers-color-scheme:dark)">' +
		'<link rel="favicon" href="favicon_dark.ico" media="(prefers-color-scheme:dark)">' +
		// High Contrast Light
		'<link rel="shortcut icon" href="favicon_hc.ico" media="(forced-colors:active)">' +
		'<link rel="icon" href="favicon_hc.ico" media="(forced-colors:active)">' +
		'<link rel="favicon" href="favicon_hc.ico" media="(forced-colors:active)">' +
		// High Contrast Dark
		'<link rel="shortcut icon" href="favicon_hcDark.ico" media="(forced-colors:active) and (prefers-color-scheme:dark)">' +
		'<link rel="icon" href="favicon_hcDark.ico" media="(forced-colors:active) and (prefers-color-scheme:dark)">' +
		'<link rel="favicon" href="favicon_hcDark.ico" media="(forced-colors:active) and (prefers-color-scheme:dark)">' 
		);
	if (getKey('ckal-default-page') === '-1') {
		insertKey('ckal-default-page', 'clock' );
	}
	if (getKey('ckal-clock-font') === '-1') {
		insertKey('ckal-clock-font', 'standard' );
	}
// Clock
	if (getKey('ckal-screensaver-color') === '-1') {
		insertKey('ckal-screensaver-color', 'highlight' );
	}
	if (getKey('ckal-screensaver-waiting') === '-1') {
		insertKey('ckal-screensaver-waiting', '1' );
	}
	if (getKey('ckal-screensaver-refresh') === '-1') {
		insertKey('ckal-screensaver-refresh', '1' );
	}
	if (getKey('ckal-analog-clock') === '-1') {
		insertKey('ckal-analog-clock', 'false' );
	}
	if (getKey('ckal-seconds-clock') === '-1') {
		insertKey('ckal-seconds-clock', 'false' );
	}
	if (getKey('ckal-date-visibility') === '-1') {
		insertKey('ckal-date-visibility', 'visible' );
	}
	if (getKey('ckal-analog-clock-hidden-ticmarks') === '-1') {
		insertKey('ckal-analog-clock-hidden-ticmarks', 'false' );
	}
// Alarms
	if (getKey('ckal-alarm-sound') === '-1') {
		insertKey('ckal-alarm-sound', '05' );
	}
// Stopwatch
	if (getKey('ckal-stopwatch-sound') === '-1') {
		insertKey('ckal-stopwatch-sound', '13' );
	}
		/* Active Theme */
		document.getElementById("AppTheme" + ['01','02','03','04'][ ['auto','auto-dark','light','dark'].indexOf(getKey('color-scheme')) ]).checked=true;
		/* Default Page */
		default_page = getKey('ckal-default-page');
		$('body').attr("page",  default_page);
		document.getElementById("LandingPage" + ['01','02','03','04'][ ['clock','alarms','stopwatch','timer'].indexOf(default_page) ]).checked=true;
		/* Clock Font */
		clock_font = getKey('ckal-clock-font');
		$('body').attr("clockfont",  clock_font);
		document.getElementById("ClockFont" + ['01','02','03','04'][ ['standard','dynamic','alternate','retro'].indexOf(clock_font) ]).checked=true;
		/* Clock Page */
		window.ckal_oldHour =  '00';
		window.ckal_oldMin =  '00';
		window.ckal_oldSec =  '00';
		window.ckal_olddate = '00/00/0000';
		ChangeDate();
		setInterval(ChangeDate, 1000);
		// Clock Screensaver
		ss_waitingtime = getKey('ckal-screensaver-waiting');
		ss_refreshrate = getKey('ckal-screensaver-refresh');
		document.getElementById("Clock_Screensaver_WaitingTime" + ['01','02','03','04'][ ['0','1','2','3'].indexOf(ss_waitingtime) ]).checked=true;
		document.getElementById("Clock_Screensaver_UpdateSpeed" + ['01','02','03','04'][ ['0','1','2','3'].indexOf(ss_refreshrate) ]).checked=true;
		// Clock Screensaver Color
		document.getElementById("Clock_Screensaver03").checked=(getKey('ckal-screensaver-color') != 'highlight');
		$('body').attr("clockcolor",  getKey('ckal-screensaver-color'));
		// Clock Style
		analog_clock = getKey('ckal-analog-clock');
		document.getElementById("Clock_Style" + ['01','02'][ ['false','true'].indexOf(analog_clock) ]).checked=true;
		if (getKey('ckal-analog-clock') === 'true') {
			document.querySelector('body').classList.add("has-analog-clock");
		}
		// Seconds in Clock
		if (getKey('ckal-seconds-clock') === 'true') {
			document.querySelector('body').classList.add("has-seconds-in-clock");
			document.getElementById("Clock03").checked=true;
		}
		// No Date
		if (getKey('ckal-date-visibility') === 'hidden') {
			document.querySelector('body').classList.add("has-no-date-in-clock");
			document.getElementById("Clock04").checked=true;
		}
		// No Tic Marks in Analog Clock
		if (getKey('ckal-analog-clock-hidden-ticmarks') === 'true') {
			document.querySelector('body').classList.add("has-no-aclock-tickmarks");
			document.getElementById("Clock05").checked=true;
		}
		setInterval(CheckClockScreensaver, 1000);
		clockinterval = null;
		window.ckal_sstime = 0;
		window.ckal_ssactive = false;
		window.ckal_sswaiting = [45,90,180,0][ss_waitingtime];
		window.ckal_ssrefresh = [10,20,30,0][ss_refreshrate];
		
		document.querySelector("body").addEventListener("mousemove", ( function(e) { ClearClockScreensaver(); } ) );
		/* Alarms Page */
		alarms=[];
		alarm_sound = getKey('ckal-alarm-sound');
		$('.cpe-dropdown.cpe-select.alarm_sounds').on( "blur",function() { insertKey('ckal-alarm-sound', getAlarmSound() ) });
		document.querySelector('.cpe-dropdown.cpe-select.alarm_sounds .cpe-select__value').setAttribute("value", getKey('ckal-alarm-sound'));
		document.querySelector('.cpe-dropdown.cpe-select.alarm_sounds .cpe-select__value').innerHTML = getAlarmSoundName();
		document.querySelector('.cpe-dropdown.cpe-select.alarm_sounds .cpe-list.is-linked li[value="'+ getKey('ckal-alarm-sound') + '"').classList.add("selected");
		/* Stopwatch Page */
		stopwatches=[];
		stopwatch_sound = getKey('ckal-stopwatch-sound');
		$('.cpe-dropdown.cpe-select.stopwatch_sounds').on( "blur",function() { insertKey('ckal-stopwatch-sound', getStopwatchSound() ) });
		document.querySelector('.cpe-dropdown.cpe-select.stopwatch_sounds .cpe-select__value').setAttribute("value", getKey('ckal-stopwatch-sound'));
		document.querySelector('.cpe-dropdown.cpe-select.stopwatch_sounds .cpe-select__value').innerHTML = getStopwatchSoundName();
		document.querySelector('.cpe-dropdown.cpe-select.stopwatch_sounds .cpe-list.is-linked li[value="'+ getKey('ckal-stopwatch-sound') + '"').classList.add("selected");
		/* Timer Page */
		window.ckal_totaltime = 0;
		window.ckal_timertime = 0;
		window.ckal_timerbegin = false;
})();

/* Clock */

function ChangeDate() {
	date = new Date();
	hour = date.getHours().toString().padStart(2, '0');
	min = date.getMinutes().toString().padStart(2, '0');
	sec = date.getSeconds().toString().padStart(2, '0');
	fulldate = date.getDate().toString().padStart(2, '0') + '/' +  (date.getMonth() + 1).toString().padStart(2, '0') + '/' +  date.getFullYear().toString().padStart(4, '0')
	// Analog
	var hourDegrees = ((parseInt(hour) / 12) * 360) + ((parseInt(min)/60)*30) + 90;
	var minsDegrees = ((parseInt(min) / 60) * 360) + ((parseInt(sec)/60)*6) + 90;
	var secondsDegrees = ((parseInt(sec) / 60) * 360) + 90;
	document.querySelector('main.clock .proc_page .clock_time .analogclock .hand.hour-hand').style.transform = `rotate(${hourDegrees}deg)`;
	document.querySelector('main.clock .proc_page .clock_time .analogclock .hand.min-hand').style.transform = `rotate(${minsDegrees}deg)`;
	document.querySelector('main.clock .proc_page .clock_time .analogclock .hand.second-hand').style.transform = `rotate(${secondsDegrees}deg)`;
	// Digital
	if (window.ckal_oldHour != hour) {
		document.querySelector('main.clock .proc_page .clock_time time .hours').innerHTML = hour;
		window.ckal_oldHour =  hour;
	}
	if (window.ckal_oldMin != min) {
		document.querySelector('main.clock .proc_page .clock_time time .mins').innerHTML = ":" + min;
		window.ckal_oldMin =  min;
	}
	if (window.ckal_oldSec != sec) {
		document.querySelector('main.clock .proc_page .clock_time time .secs').innerHTML = ":" + sec;
		window.ckal_oldSec =  sec;
	}
	if (window.ckal_oldDate != fulldate) {	
		document.querySelector('main.clock .proc_page .clock_time date').innerHTML = fulldate;
		window.ckal_oldDate = fulldate
	}

}

function CheckClockScreensaver() {
	if ( (document.querySelector('body').getAttribute("page") == 'clock') && !((window.ckal_ssactive) || (window.ckal_sswaiting == 0)) ) {
		window.ckal_sstime = window.ckal_sstime + 1;
		if (window.ckal_sstime > (window.ckal_sswaiting - 1)) {
			BeginClockScreensaver();
		}
	}
}

function BeginClockScreensaver() {
	if (document.querySelector('body').getAttribute("page") == 'clock') {
		xpos = document.querySelector("main.clock .proc_page .clock_time").getBoundingClientRect().x
		ypos = document.querySelector("main.clock .proc_page .clock_time").getBoundingClientRect().y
		document.querySelector("main.clock .proc_page .clock_time").style.setProperty("--x", xpos + 'px');
		document.querySelector("main.clock .proc_page .clock_time").style.setProperty("--y", ypos + 'px');
		window.ckal_ssactive = true;
		document.querySelector('body').classList.add("clock_screensaver");
		if (ckal_ssrefresh != 0) {
			clockinterval = setInterval(MoveClock,ckal_ssrefresh*1000);
		}
	} 
}

function MoveClock() {
		x = window.innerWidth - document.querySelector("main.clock .proc_page .clock_time").clientWidth - 2
		y = window.innerHeight - document.querySelector("main.clock .proc_page .clock_time").clientHeight - 2
		document.querySelector("main.clock .proc_page .clock_time").style.setProperty("--x", getRandomInt(x) + 'px');
		document.querySelector("main.clock .proc_page .clock_time").style.setProperty("--y", getRandomInt(y) + 'px');
}

function ClearClockScreensaver() {
	window.ckal_sstime = 0;
	if (window.ckal_ssactive) {
		if (ckal_ssrefresh != 0) {
			clearInterval(clockinterval);
		}
		clockinterval = null;
		window.ckal_ssactive = false;
		document.querySelector('body').classList.remove("clock_screensaver");
		document.querySelector("main.clock .proc_page .clock_time").style.removeProperty("--x");
		document.querySelector("main.clock .proc_page .clock_time").style.removeProperty("--y");
	}
}

function SetSSWaitingTime(speed=1) {
	insertKey('ckal-screensaver-waiting', speed );
	window.ckal_sswaiting = [45,90,180,0][getKey('ckal-screensaver-waiting')]
}

function SetSSUpdateSpeed(speed=1) {
	insertKey('ckal-screensaver-refresh', speed );
	window.ckal_ssrefresh = [10,20,30,0][getKey('ckal-screensaver-refresh')]
}

function toggleScreensaverColor() {
	nosaver = (document.getElementById("Clock_Screensaver03").checked) ? 'white' : 'highlight';
	insertKey('ckal-screensaver-color',nosaver);
	document.querySelector('body').setAttribute("clockcolor",  getKey('ckal-screensaver-color'));
}

function SetClockStyle(style=0) {
	analog = (style == 1) ? 'true' : 'false';
	insertKey('ckal-analog-clock', analog );
	if (analog === 'true') {
		document.querySelector('body').classList.add("has-analog-clock");
	} else {
		document.querySelector('body').classList.remove("has-analog-clock");
	}
}

function toggleClockSeconds() {
	seconds = (document.getElementById("Clock03").checked) ? 'true' : 'false';
	insertKey('ckal-seconds-clock', seconds );
	if (seconds === 'true') {
		document.querySelector('body').classList.add("has-seconds-in-clock");
	} else {
		document.querySelector('body').classList.remove("has-seconds-in-clock");
	}

}

function toggleClockDate() {
	nodate = (document.getElementById("Clock04").checked) ? 'hidden' : 'visible';
	insertKey('ckal-date-visibility', nodate );
	if (nodate === 'hidden') {
		document.querySelector('body').classList.add("has-no-date-in-clock");
	} else {
		document.querySelector('body').classList.remove("has-no-date-in-clock");
	}

}

function toggleAnalogClockTicmarks() {
	nomarks = (document.getElementById("Clock05").checked) ? 'true' : 'false';
	insertKey('ckal-analog-clock-hidden-ticmarks', nomarks );
	if (nomarks === 'true') {
		document.querySelector('body').classList.add("has-no-aclock-tickmarks");
	} else {
		document.querySelector('body').classList.remove("has-no-aclock-tickmarks");
	}

}


/* Alarms */
function toggleAlarm(id=0,a_endtext="Alarm!!!") {
	inactive_alarm = (alarms[id] == undefined) // Toggles Timer State (true = ticking | false = still)
	elem = document.querySelector("main.alarms .proc_page article header[clockid='" + String( id ).padStart(2, '0') + "'] input[type='checkbox']");
	if (inactive_alarm) {
		elem.checked = true;
		alarms[id] = setInterval(countAlarm, 1000, id, a_endtext);
	} else {
		elem.checked = false;
		clearInterval(alarms[id])
		alarms[id] = null;
	}
}

function countAlarm(id,a_endtext="Alarm!!!") {
	// Exclusive
	elemTitle = document.querySelector("main.alarms .proc_page article header[clockid='" + String( id ).padStart(2, '0') + "'] span.name .alarm-name > label");
	elemDate = document.querySelector("main.alarms .proc_page article header[clockid='" + String( id ).padStart(2, '0') + "'] span.time > time").innerHTML;
	date = document.querySelector('main.clock .proc_page .clock_time time .hours').innerHTML + document.querySelector('main.clock .proc_page .clock_time time .mins').innerHTML;
	if (elemDate == date) {
		playAudio('Sounds/Alarm' + getAlarmSound() + '.mp3');
		AddFloatingBanner('<big><b>' + a_endtext + '</b></big><br>' + elemTitle.innerHTML + '<br>' + date ,'success');
		elem.checked = false;
		clearInterval(alarms[id])
		alarms[id] = null;
	}

}

function NewAlarm(starttext="Start Alarm",a_endtext="Alarm!!!",namehint="Enter Name:",timehint="Enter time: (Format: HH:MM)") {
	var name = prompt(namehint);
	var time = prompt(timehint).split(":");
	var totaltime = time[0].toString().padStart(2, '0') + ':' + time[1].toString().padStart(2, '0');
	str = 	'<header clockid="' + document.querySelectorAll("main.alarms .proc_page section article .header[clockid]").length.toString().padStart(2, '0') + '" class="header item">' +
				'<span class="name">' +
					'<input type="checkbox" title="' + starttext + '" onclick="toggleAlarm(' + document.querySelectorAll("main.alarms .proc_page section article .header[clockid]").length + ',\'' + a_endtext + '\')" id="Alarm' + document.querySelectorAll("main.alarms .proc_page section article .header[clockid]").length.toString().padStart(2, '0') + '">' +
					'<span class="alarm-name"><label for="Alarm' +  document.querySelectorAll("main.alarms .proc_page section article .header[clockid]").length.toString().padStart(2, '0') + '">' + name + '</label></span>' +
				'</span>' +
				'<span class="time"><time>' + totaltime + '</time></span>' +
				'<span class="repeat">-//-</span>' +
			'</header>'
	document.querySelector("main.alarms .proc_page section article").insertAdjacentHTML('beforeend',str);

}

function getAlarmSound() {
return document.querySelector('.cpe-dropdown.cpe-select.alarm_sounds .cpe-select__value').getAttribute("value");
}

function getAlarmSoundName() {
	return document.querySelector(".cpe-dropdown.cpe-select.alarm_sounds .cpe-dropdown__content > .cpe-list li:nth-child(" + (parseInt(getAlarmSound()) + 1) + ") > a").innerHTML;
}



/* Stopwatch */
function FormatTimeMini(value) { // Used for Stopwatches
	hours = String( Math.floor( value / 3600000 ) ).padStart(2, '0');
	mins = String( Math.floor( (value / 60000) % 60 ) ).padStart(2, '0');
	secs = String( Math.floor( (value / 1000) % 60 ) ).padStart(2, '0');
	return hours + ":" + mins + ":" + secs; 
}

function toggleStopwatch(id=0, starttext="Start", pausetext="Pause",sw_endtext="Stopwatch has been finished!!!") {
	inactive_stopwatch = ((stopwatches[id] == undefined) || stopwatches[id] == 0) // Toggles Timer State (true = ticking | false = still)
	elem = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] button.play");
	elemIcon = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] button.play .cpe-icon");
	elemSpan = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] span.name");
	elemProgress = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] progress");
	elemHeader = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "']");
	if (inactive_stopwatch) {
		if (stopwatches[id] == undefined) {
		elemProgress.setAttribute('value',elemHeader.getAttribute('time'));
		elemProgress.style.setProperty("--range-percent",  (( ((elemProgress.getAttribute('value')) - 0 ) * 100) / (elemProgress.getAttribute('max') - 0) ) + '%'  );
		}
		stopwatches[id] = setInterval(countTimer, 10, id, starttext,sw_endtext);
		/* Turn Pause Button back to Start */
		elem.classList.add('is-pause-color');
		elemIcon.innerHTML = 'pause';
		elem.setAttribute('title',pausetext);
	} else {
		clearInterval(stopwatches[id])
		stopwatches[id] = 0;
		/* Turn Pause Button back to Start */
		elem.classList.remove('is-pause-color');
		elemIcon.innerHTML = 'play_arrow';
		elem.setAttribute('title',starttext);
	}
}

function countTimer(id,starttext='Start', sw_endtext='Stopwatch has been finished!!!') {
	elemSpan = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] span.name");
	elemProgress = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] progress");
	// Exclusive
	elemTitle = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] span.name .title");
	date = document.querySelector('main.clock .proc_page .clock_time time').innerHTML;
	/* Update Time */
	newtime = elemProgress.getAttribute('value') - 10;
	elemProgress.setAttribute('value',newtime);
	elemProgress.style.setProperty("--range-percent",  (( ((elemProgress.getAttribute('value')) - 0 ) * 100) / (elemProgress.getAttribute('max') - 0) ) + '%'  );
	elemSpan.setAttribute('timer',FormatTimeMini(elemProgress.getAttribute('value')));
	/* If time expires, stop stopwatch */
	if (newtime == 0) {
		playAudio('Sounds/Alarm' + getStopwatchSound() + '.mp3');
		AddFloatingBanner('<big><b>' + sw_endtext + '</b></big><br>' + elemTitle.innerHTML + '<br>' + date ,'success');
		StopStopwatch(id,starttext);
	}
}

function StopStopwatch(id=0, starttext="Start") {
	elem = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] button.play");
	elemIcon = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] button.play .cpe-icon");
	elemSpan = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] span.name");
	elemProgress = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "'] progress");
	elemHeader = document.querySelector("main.stopwatch .proc_page article header[stopwatchid='" + String( id ).padStart(2, '0') + "']");
	/* Clear Timer Data */
	clearInterval(stopwatches[id])
	stopwatches[id] = null;
	elemProgress.setAttribute('value',0);
	elemProgress.style.setProperty("--range-percent",  (( ((elemProgress.getAttribute('value')) - 0 ) * 100) / (elemProgress.getAttribute('max') - 0) ) + '%'  );
	elemSpan.setAttribute('timer',FormatTimeMini(elemHeader.getAttribute('time')));
	/* Turn Pause Button back to Start */
	elem.classList.remove('is-pause-color');
	elemIcon.innerHTML = 'play_arrow';
	elem.setAttribute('title',starttext);
	document.querySelector('.focus-overlay').focus();


}

function NewStopwatch(starttext="Start", pausetext="Pause", stoptext="Stop",sw_endtext="Stopwatch has been finished!!!",namehint="Enter Name:",timehint="Enter time: (Format: HH:MM:SS)") {
	var name = prompt(namehint);
	var time = prompt(timehint).split(":");
	var totaltime = Math.floor( time[0] * 3600000 ) + Math.floor( (time[1] % 60) * 60000 ) + Math.floor( (time[2] % 60) * 1000 );
	str = 	'<header stopwatchid="' + document.querySelectorAll("main.stopwatch .proc_page section article .grid-view .header[stopwatchid]").length.toString().padStart(2, '0') + '" time="' + totaltime + '" class="header item">' +
				'<span class="name" timer="' + FormatTimeMini(totaltime) + '">' +
					'<span class="title">' + name + '</span>' +
					'<progress max="' + totaltime + '" value="0" style="--range-percent: 0%;"></progress>' +
				'</span>' +
				'<div class="controls cpe-floating-button-group">' +
					'<button class="cpe-floating-button play" onclick="toggleStopwatch(' + document.querySelectorAll("main.stopwatch .proc_page section article .grid-view .header[stopwatchid]").length + ',\'' + starttext + ' \',\'' + pausetext + '\',\'' + sw_endtext + '\')" title="' + starttext + '">' +
						'<span translate="no" class="cpe-icon cpe-icon-medium cpe-icon-small material-icons">play_arrow</span>' +
					'</button>' +
					'<div class="separator"></div>' +
					'<button class="cpe-floating-button is-alert-color delete" onclick="StopStopwatch(' + document.querySelectorAll("main.stopwatch .proc_page section article .grid-view .header[stopwatchid]").length +',\'' + starttext + '\')" title="' + stoptext + '">' +
						'<span translate="no" class="cpe-icon cpe-icon-medium cpe-icon-small material-icons">stop</span>' +
					'</button>' +
				'</div>' +
			'</header>'
	document.querySelector("main.stopwatch .proc_page section article .grid-view").insertAdjacentHTML('beforeend',str);

}

function playAudio(audiofile) {
  var audio = new Audio(audiofile);
  audio.play();
}

function getStopwatchSound() {
return document.querySelector('.cpe-dropdown.cpe-select.stopwatch_sounds .cpe-select__value').getAttribute("value");
}

function getStopwatchSoundName() {
	return document.querySelector(".cpe-dropdown.cpe-select.stopwatch_sounds .cpe-dropdown__content > .cpe-list li:nth-child(" + (parseInt(getStopwatchSound()) + 1) + ") > a").innerHTML;
}


/* Timer */
function FormatTime(value) {
	hours = String( Math.floor( value / 3600000 ) ).padStart(2, '0');
	mins = String( Math.floor( (value / 60000) % 60 ) ).padStart(2, '0');
	secs = String( Math.floor( (value / 1000) % 60 ) ).padStart(2, '0');
	ms = String( Math.floor( (value / 10) % 100 ) ).padStart(2, '0');
	return hours + ":" + mins + ":" + secs + "." + ms; 
}


function toggleTimer(starttext="Start", pausetext="Pause") {
	window.ckal_timerbegin = !window.ckal_timerbegin // Toggles Timer State (true = ticking | false = still)
	elem = document.querySelector("main.timer .proc_page footer button.timer-start");
	elemIcon = document.querySelector("main.timer .proc_page footer button.timer-start .cpe-icon");
	elemSpan = document.querySelector("main.timer .proc_page footer button.timer-start .cpe-icon + span");
	if (window.ckal_timerbegin) {
		timerInterval = setInterval(countInterval, 10);
		/* Turn Start Button to Pause */
		elem.classList.replace('is-success-color', 'is-pause-color');
		elemIcon.innerHTML = 'pause';
		elemSpan.innerHTML = pausetext;
		/* Update Timer Data */
		document.querySelector("main.timer .proc_page footer button.timer-lap").disabled = false;
		document.querySelector("main.timer .proc_page footer button.timer-stop").disabled = false;
	} else {
		clearInterval(timerInterval)
		timerInterval = null;
		/* Turn Pause Button back to Start */
		elem.classList.replace('is-pause-color', 'is-success-color');
		elemIcon.innerHTML = 'play_arrow';
		elemSpan.innerHTML = starttext;
		/* Update Timer Data */
		document.querySelector("main.timer .proc_page footer button.timer-lap").disabled = true;
		document.querySelector("main.timer .proc_page footer button.timer-stop").disabled = false;
	}
}

function countInterval() {
	window.ckal_totaltime = window.ckal_totaltime + 10;
	window.ckal_timertime = window.ckal_timertime + 10;
	document.querySelector('main.timer .proc_page .upper.timer time').innerHTML = FormatTime(window.ckal_totaltime);
}

function NewLap() {
	str = 	'<header lapid="' + document.querySelectorAll("main.timer .proc_page section article .lap").length.toString().padStart(2, '0') +'" class="header item lap">' +
				'<span class="id">' + (1 + document.querySelectorAll("main.timer .proc_page section article .lap").length) + '</span>' +
				'<span class="name timer laptime"><time>' + FormatTime(window.ckal_timertime) + '</time></span>' +
				'<span class="name timer totaltime"><time>' + FormatTime(window.ckal_totaltime) + '</time></span>' +
			'</header>'
	document.querySelector("main.timer .proc_page section article").insertAdjacentHTML('afterbegin',str);
	window.ckal_timertime = 0;
}

function StopTimer(starttext="Start") {
		/* Clear Timer Data */
		window.ckal_timerbegin = false;
		clearInterval(timerInterval)
		timerInterval = null;
		window.ckal_totaltime = 0;
		window.ckal_timertime = 0;
		/* Turn Pause Button back to Start */
		elem = document.querySelector("main.timer .proc_page footer button.timer-start");
		elemIcon = document.querySelector("main.timer .proc_page footer button.timer-start .cpe-icon");
		elemSpan = document.querySelector("main.timer .proc_page footer button.timer-start .cpe-icon + span");
		elem.classList.replace('is-pause-color', 'is-success-color');
		elemIcon.innerHTML = 'play_arrow';
		elemSpan.innerHTML = starttext;
		/* Update Timer Data */
		document.querySelector('main.timer .proc_page .upper.timer time').innerHTML = FormatTime(window.ckal_totaltime);
		document.querySelector("main.timer .proc_page footer button.timer-lap").disabled = true;
		document.querySelector("main.timer .proc_page footer button.timer-stop").disabled = true;
		document.querySelector("main.timer .proc_page section article").innerHTML = '';
		document.querySelector('.focus-overlay').focus();
}

function setFont(font='standard') {
	insertKey('ckal-clock-font', font);
	$('body').attr("clockfont",  font);
}

/* Section Changing Functions */

function Tab0() {
		$('body').attr("page", "clock");
}

function Tab1() {
		$('body').attr("page", "alarms");
}

function Tab2() {
		$('body').attr("page", "stopwatch");
}

function Tab3() {
		$('body').attr("page", "timer");
}

function Tab4() {
		$('body').attr("page", "settings");
}
