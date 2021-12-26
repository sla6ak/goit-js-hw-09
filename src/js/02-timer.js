import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// поработаем ручками и не удем использовать библиотек для вывода
// объявим переменную для хранения выбранной даты
let selectedTime;
let timeApp;
// это индекс сет таймаута часов
let idTimer = null;
// получим элементы верстки в объект
const refs = {
  enterData: document.querySelector('#datetime-picker'),
  start: document.querySelector('button[data-start]'),
  stop: document.querySelector('button[data-stop]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minuts: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};
// сделаем кнопки неактивными
refs.stop.disabled = 'disabled';
refs.start.disabled = 'disabled';

refs.start.addEventListener('click', onStartClick);
refs.stop.addEventListener('click', onStopClick);

// обратимся к документации библиотеки и создадим объект календаря
const flatpic = flatpickr(refs.enterData, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  // метод закрытия календаря
  onClose(selectedDates) {
    selectedTime = selectedDates[0];
    // сравним выбранную дату с текущей и разблокируем кнопку старта
    if (selectedTime - new Date() > 0) {
      refs.start.disabled = '';
    } else {
      alert('Please choose a date in the future');
    }
  },
});

refs.start.addEventListener('click', onStartClick);

function onStartClick(e) {
  refs.stop.disabled = '';

  // наверняка прошло время между разблокировкой кнопки и кликом.
  // возможно прошло слишком много времени перепроверим даты
  if (selectedTime - new Date() > 0) {
    idTimer = setInterval(() => {
      let curentDateNew = new Date();
      timeApp = selectedTime - curentDateNew;
      let minus = convertMs(timeApp);
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
        refs.stop.disabled = 'disabled';
      }
    }, 1000);
  } else {
    // если мы не успели запустить таймер и момент упущен объявим это
    refs.start.disabled = 'disabled';
    alert('Please choose a date in the future');
  }
}
function onStopClick() {
  // снова проверим а тикают ли часики?
  if (selectedTime - new Date() > 0) {
    clearInterval(idTimer);
    refs.days.textContent = '0';
    refs.hours.textContent = '00';
    refs.minuts.textContent = '00';
    refs.seconds.textContent = '00';
    refs.stop.disabled = 'disabled';
  } else {
    refs.start.disabled = 'disabled';
    refs.stop.disabled = 'disabled';
    alert('Please choose a date in the future');
  }
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
