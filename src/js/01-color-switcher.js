function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const refs = {
  body: document.querySelector('body'),
  start: document.querySelector('button[data-start]'),
  stop: document.querySelector('button[data-stop]'),
  value: document.querySelector('.value'),
};
let colorId;

refs.start.addEventListener('click', onStartClick);
refs.stop.addEventListener('click', onStopClick);

function onStartClick() {
  console.log('start');
  colorId = setInterval(() => {
    let color = getRandomHexColor();
    refs.body.style.backgroundColor = color;
    refs.value.textContent = color;
  }, 1000);
  refs.start.disabled = 'disabled';
  refs.stop.disabled = '';
}

function onStopClick() {
  console.log('stop');
  clearInterval(colorId);
  refs.start.disabled = '';
  refs.stop.disabled = 'disabled';
}
