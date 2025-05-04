'use strict';

const input = document.querySelector('.input');
const main = document.querySelector('.operations');

let res = []; // храним вводимые данные, также результат операций
let operator = null; // оператор для равенства
let rePlace = false; // флаг для замены вводимых данных после применения оператора, при нажатии, например на "+", он переводится в true и следующий ввод заменит текущий в input

const maxLength = 15; // ограничение строки, при изменении input.value напрямую в JS html-тег не робит :(

// ввод цифр
function inputForNum() {
  let curVal = null;
  if (event.type === 'click') {
    // сначала определяем тип события
    curVal = event.target.textContent;
  } else if (event.type === 'keydown') {
    curVal = event.key;
  }

  if (rePlace) {
    //тот самый флаг
    input.value = curVal;
    rePlace = false;
  } else {
    input.value += curVal;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength); // не даем вводить больше чем разрешено
    }
  }
}
// сумма
function sumValues() {
  if (res.length === 1) result(); // если что-то уже было введено, то при нажатии на "+" сначала выполнится то что было введено
  let sum = 0; // промежуточный результат
  res.push(+input.value);
  operator = '+'; // выставляем флаг для равенства
  // в res храним 2 значения (минимально для выражения)
  if (res.length == 2) {
    sum = (+res[0] + +res[1]).toFixed(8).replace(/\.?0+$/, ''); // регулярка для отсечения лишних нулей и toFixed(8) для хоть какого-то обхода потери точности
    res = [];
    res.push(sum);
  }
  input.value = res;
  ifOverMaxLength(); // проверка на првышение длины строки
  rePlace = true; // меняем флаг для замены
}
// произведение - суть схожа с суммой и остальными ниже
function mulValues() {
  if (res.length === 1) result();
  let mul = 0;
  res.push(+input.value);
  operator = '*';
  if (res.length === 2) {
    mul = (+res[0] * +res[1]).toFixed(8).replace(/\.?0+$/, '');
    res = [];
    res.push(mul);
  }
  input.value = res;
  ifOverMaxLength();
  rePlace = true;
}
// разность
function subValues() {
  if (res.length === 1) result();
  let sub = 0;
  res.push(+input.value);
  operator = '-';
  if (res.length === 2) {
    sub = (+res[0] - +res[1]).toFixed(8).replace(/\.?0+$/, '');
    res = [];
    res.push(sub);
  }
  input.value = res;
  ifOverMaxLength();
  rePlace = true;
}
// частное
function divValues() {
  if (res.length === 1) result();
  let div = 0;
  res.push(+input.value);
  operator = '/';
  if (res.length === 2) {
    div = (+res[0] / +res[1]).toFixed(8).replace(/\.?0+$/, '');
    res = [];
    res.push(div);
  }
  input.value = res;
  ifOverMaxLength();
  rePlace = true;
}
//проверка на длину input
function ifOverMaxLength() {
  if (input.value.length > maxLength) input.value = 'over9k!';
}
// проверяем на isNaN
function checkIsNaN() {
  if (isNaN(input.value)) {
    // при нажатии на "=" более одного раза res = [res[0]] из-за чего input.value получит NaN, чтобы так не случилось делаем вот эту проверку
    input.value = res[0]; // и "замораживаем" значение, теперь сколько не тыкай в "=" всегда будет последнее значение
  }
}
// равенство
function result() {
  res.push(+input.value);

  switch (operator) {
    case '+':
      let s = res[0] + res[1];
      input.value = s.toFixed(8).replace(/\.?0+$/, '');
      checkIsNaN();
      res = [];
      break;
    case '*':
      let m = res[0] * res[1];
      input.value = m.toFixed(8).replace(/\.?0+$/, '');
      checkIsNaN();
      res = [];
      break;
    case '-':
      let d = res[0] - res[1];
      input.value = d.toFixed(8).replace(/\.?0+$/, '');
      checkIsNaN();
      res = [];
      break;
    case '/':
      let d1 = res[0] / res[1];
      input.value = d1.toFixed(8).replace(/\.?0+$/, '');
      checkIsNaN();
      res = [];
      break;
  }

  ifOverMaxLength();
  rePlace = true;
}
// обработчик для замены при вводе
input.addEventListener('input', (el) => {
  if (rePlace) {
    // флаг rePlace после нажатия на "+" например будет true, поэтому выполнится
    input.value = el.target.value;
    rePlace = false;
    // возможно стоило еще проверять на input.value !== el.target.value, но вроде и так работает :)
  }
});

// вешаем обработчик на мейн, чтобы не вешать на каждую кнопку
main.addEventListener('click', function (event) {
  let e = event.target.classList; // получаем список классов
  if (e.contains('num')) {
    // вводим с кликов
    inputForNum();
  } else if (e.contains('backspace')) {
    // бекспейс
    input.value = input.value.slice(0, -1);
  } else if (e.contains('clear')) {
    // очистка ввода
    input.value = '';
    res = []; // не забываем очистить результат
  } else if (e.contains('res')) {
    // равенство
    result();
  } else if (e.contains('sum')) {
    // сумма
    sumValues();
  } else if (e.contains('mul')) {
    // произведение
    mulValues();
  } else if (e.contains('sub')) {
    // разность
    subValues();
  } else if (e.contains('div')) {
    // частное
    divValues();
  } else if (e.contains('dot')) {
    // точка (для дробных)
    input.value += '.';
  } else if (e.contains('plus-minus')) {
    // для изменения знака
    let plusMinus = input.value * -1;
    input.value = plusMinus.toFixed(8).replace(/\.?0+$/, '');
  } else if (e.contains('sqr')) {
    // квадрат
    let sqr = input.value ** 2;
    input.value = sqr.toFixed(8).replace(/\.?0+$/, '');
    ifOverMaxLength();
  }
});

// обработчик для кнопок (суть аналогична кликам)
document.addEventListener('keydown', function (event) {
  if (event.key >= 0 && event.key <= 9) {
    // ищем кнопки цифр
    inputForNum();
  }
  switch (
    event.key // ищем соответсвие кнопкам
  ) {
    case '+':
      sumValues();
      break;
    case '*':
      mulValues();
      break;
    case '-':
      subValues();
      break;
    case '/':
      divValues();
      break;
    case 'Enter': // "Enter" это равенство
      result();
      break;
    case 'Backspace':
      input.value = input.value.slice(0, -1);
    case '.': // точки для ru-en с NumPad
    case ',':
      input.value += '.';
      break;
  }
});
