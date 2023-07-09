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
		/* Active Theme */
		if (getKey('device-theme') === 'light' ) {
			active_tm_theme =  (getKey('color-style-behavior') === 'duo' ) ? 'auto' : 'light'
		} else if ( (getKey('device-theme') === 'dark' ) ) {
			active_tm_theme =  (getKey('color-style-behavior') === 'duo' ) ? 'auto-dark' : 'dark'
		} else if ( (getKey('device-theme') === 'auto' ) || (getKey('device-theme') === 'auto-dark' ) ) {
			active_tm_theme = 'custom';
		} else {
			active_tm_theme = 'auto';
		}
		document.getElementById("AppTheme" + ['01','02','03','04','05'][ ['auto','auto-dark','light','dark','custom'].indexOf(active_tm_theme) ]).checked=true;
		/* Default Page */
		default_page = getKey('ckal-default-page');
		$('body').attr("page",  default_page);
		document.getElementById("LandingPage" + ['01','02','03','04'][ ['clock','alarms','stopwatch','timer'].indexOf(default_page) ]).checked=true;
//Clock
		date = new Date();
		hour = date.getHours().toString().padStart(2, '0');
		min = date.getMinutes().toString().padStart(2, '0');
		document.querySelector('main.clock .proc_page .clock_time time').innerHTML = hour + ':' +  min;
		document.querySelector('main.clock .proc_page .clock_time date').innerHTML = date.getDate().toString().padStart(2, '0') + '/' +  (date.getMonth() + 1).toString().padStart(2, '0') + '/' +  date.getFullYear().toString().padStart(4, '0');
		window.ckal_oldHour =  hour;
		window.ckal_oldMin =  min;
		setInterval(ChangeDate, 1000);
		/* Timer Page */
		window.ckal_totaltime = 0;
		window.ckal_timertime = 0;
		window.ckal_timerbegin = false;

})();


function ChangeDate() {
	date = new Date();
	hour = date.getHours().toString().padStart(2, '0');
	min = date.getMinutes().toString().padStart(2, '0');
	if ( (window.ckal_oldHour != hour) || (window.ckal_oldMin != min) ) {
		document.querySelector('main.clock .proc_page .clock_time time').innerHTML = hour + ':' +  min;
		document.querySelector('main.clock .proc_page .clock_time date').innerHTML = date.getDate().toString().padStart(2, '0') + '/' +  (date.getMonth() + 1).toString().padStart(2, '0') + '/' +  date.getFullYear().toString().padStart(4, '0');
		window.ckal_oldHour =  hour;
		window.ckal_oldMin =  min;
	}

}

function FormatTime(value) {
	hours = String( Math.floor( value / 3600000 ) ).padStart(2, '0');
	mins = String( Math.floor( (value / 60000) % 60 ) ).padStart(2, '0');
	secs = String( Math.floor( (value / 1000) % 60 ) ).padStart(2, '0');
	ms = String( (value % 1000) ).padStart(3, '0');
	return hours + ":" + mins + ":" + secs + "." + ms; 
}

function toggleTimer(starttext="Start", pausetext="Pause") {
	window.ckal_timerbegin = !window.ckal_timerbegin // Toggles Timer State (true = ticking | false = still)
	elem = document.querySelector("main.timer .proc_page footer button.timer-start");
	elemIcon = document.querySelector("main.timer .proc_page footer button.timer-start .cpe-icon");
	elemSpan = document.querySelector("main.timer .proc_page footer button.timer-start .cpe-icon + span");
	if (window.ckal_timerbegin) {
		timerInterval = setInterval(countInterval, 5);
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
	window.ckal_totaltime = window.ckal_totaltime + 5;
	window.ckal_timertime = window.ckal_timertime + 5;
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
