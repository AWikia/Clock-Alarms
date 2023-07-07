(function () {

		document.querySelector("head").insertAdjacentHTML('afterbegin', 
		'<link rel="manifest" href="manifest.json" crossorigin="use-credentials">' +
		'<link rel="shortcut icon" href="favicon.ico">' +
		'<link rel="icon" href="favicon.ico">' +
		'<link rel="favicon" href="favicon.ico">'
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
