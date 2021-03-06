function attachEventsListeners() {
    let days = document.getElementById('days');
    let hours = document.getElementById('hours');
    let minutes = document.getElementById('minutes');
    let seconds = document.getElementById('seconds');

    let secondsEvent = document.getElementById('secondsBtn');
    let daysEvent = document.getElementById('daysBtn');
    let minutesEvent = document.getElementById('minutesBtn');
    let hoursEvent = document.getElementById('hoursBtn');

    secondsEvent.addEventListener('click', () => { convertFromSeconds(+seconds.value) });
    daysEvent.addEventListener('click', () => { convertFromDays(+days.value) });
    minutesEvent.addEventListener('click', () => { convertFromMinutes(+minutes.value) });
    hoursEvent.addEventListener('click', () => { convertFromHours(+hours.value) });

    function convertFromSeconds(param) {
        days.value = param / (24 * 60 * 60);
        hours.value = param / (60 * 60);
        minutes.value = param / 60;
    }

    function convertFromDays(param) {
        hours.value = param * 24;
        minutes.value = param * 24 * 60;
        seconds.value = param * 24 * 60 * 60;
    }

    function convertFromMinutes(param) {
        days.value = param * 24 * 60;
        hours.value = param * 60;
        seconds.value = param / 60;
    }

    function convertFromHours(param) {
        days.value = param * 24;
        minutes.value = param * 24 * 60;
        seconds.value = param * 24 * 60 * 60;
    }
}