import Notiflix from 'notiflix';
import '../../node_modules/notiflix/dist/notiflix-3.2.2.min.css';

const refs = {
  btn: document.querySelector('button'),
  form: document.querySelector('.form'),
  delay: document.querySelector('input[name="delay"]'),
  step: document.querySelector('input[name="step"]'),
  amount: document.querySelector('input[name="amount"]'),
};

// наконец слушатель формы внутри которого и будет выполняться весь наш код
refs.btn.addEventListener('click', onFormClick);

function onFormClick(e) {
  // откажемся от перезагрузки страницы
  e.preventDefault();

  // считаем все значения инпутов при клике
  let delay = Number(refs.delay.value);
  let step = Number(refs.step.value);
  let amount = Number(refs.amount.value);
  // создадим переменные для накрутки задержки сервера ведь она будет расти
  // 1)для сет таймаута внутри промиса
  let time = 0;
  // 2) для вывода пользователю
  let time1 = delay;
  //  также переменную для нумерации всех ответов "сервера"
  let position = 1;

  console.log('отсчет до старта:', delay);
  console.log('время ответа сервера:', step);
  console.log('количество запросов на сервер:', amount);

  // создадим функцию для обработки ассинхронных запросов на сервер
  // я пытался вынести функцию из события формы
  // но тогда ей необходимо передавать 3й аргумент тайм
  function createPromise(position, delay) {
    //случайно иммитируем успешные и необработанные запросы
    const shouldResolve = Math.random() > 0.3;
    return new Promise((resolve, reject) => {
      // попытка использовать ООП хоть где-то
      class Popap {
        constructor(position, delay) {
          this.position = position;
          this.delay = delay;
        }
      }
      const popapNotiflix = new Popap(position, delay);
      // в задании указана задержка отклика сервера равная переменной 'step'
      // я не смог ее реализовать с помощью промисов,
      // мне кажеться для этого необходим awei поэтому я симитировал задержку
      // вызвав N-ное количеств прмисов с разным таймингом.
      // тайминг будет меняться перед вызовом функции
      setTimeout(() => {
        if (shouldResolve) {
          resolve(popapNotiflix);
          console.log('нумерация:', popapNotiflix.position);
          console.log('общее время задержки:', popapNotiflix.delay);
        } else {
          reject(popapNotiflix);
          console.log('нумерация:', popapNotiflix.position);
          console.log('общее время задержки:', popapNotiflix.delay);
        }
      }, time);
    });
  }

  // не совсем понятно зачем но мы стартуем не сразу поэтому
  setTimeout(() => {
    // чтоб вызвать функцию  N раз обернем вызов в цикл
    for (position = 1; position <= amount; position += 1) {
      // при вызове промиса наш тайм равен нулю, хотя это не логично,
      // но так показанно на видео в домашке - я с этим не согласен
      // ведь 1й раз сервер так же не должен отвечать мгновенно
      // а первый проверочный инпут может быть равен нулю
      createPromise(position, delay)
        .then(({ position, delay }) => {
          // console.log(position);
          // console.log(delay);
          Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        })
        .catch(({ position, delay }) => {
          Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
        });
      // при каждой итерации будем увеличивать сеттаймаут на шаг
      // так как все таймауты будут вызванны почти сразу
      time = step * position;
      // также и выводить будем обновленное время
      delay = time1 + time;
    }
    // тут указанно время до старта из самого перврвого инпута
  }, delay);
}
