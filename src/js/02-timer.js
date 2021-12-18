import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
let r;
let timeApp;
let idTimer = null;

const refs = {
  enterData: document.querySelector('#datetime-picker'),
  start: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minuts: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

refs.start.disabled = 'disabled';
// console.log();
const flatpic = flatpickr(refs.enterData, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    let curentDate = new Date();
    r = selectedDates[0];
    timeApp = r - curentDate;
    if (timeApp >= 0) {
      refs.start.disabled = '';
      refs.start.addEventListener('click', onStartClick);
    } else {
      alert('Please choose a date in the future');
    }
  },
});

refs.start.addEventListener('click', onStartClick);

function onStartClick(e) {
  idTimer = setInterval(() => {
    let curentDateNew = new Date();
    let timeApp1 = r - curentDateNew;
    let minus = convertMs(timeApp1);
    refs.days.textContent = minus.days;
    refs.hours.textContent = addZero(minus.hours);
    refs.minuts.textContent = addZero(minus.minutes);
    refs.seconds.textContent = addZero(minus.seconds);
    refs.start.disabled = 'disabled';
    if (
      refs.days.textContent === '0' &&
      refs.hours.textContent === '00' &&
      refs.minuts.textContent === '00' &&
      refs.seconds.textContent === '00'
    ) {
      clearInterval(idTimer);
    }
  }, 1000);
}

// конвертируем милисекунды в нормальное время
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addZero(value) {
  return String(value).padStart(2, '0');
}
