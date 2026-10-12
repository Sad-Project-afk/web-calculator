const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let previousValue = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  if (waitingForSecondOperand && previousValue !== null) {
    display.textContent = `${previousValue} ${operator} `;
    return;
  }

  if (operator && previousValue !== null) {
    display.textContent = `${previousValue} ${operator} ${currentValue}`;
    return;
  }

  display.textContent = currentValue;
}

function inputNumber(value) {
  if (waitingForSecondOperand) {
    currentValue = value;
    waitingForSecondOperand = false;
  } else {
    currentValue = currentValue === '0' ? value : currentValue + value;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    currentValue = '0.';
    waitingForSecondOperand = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function calculate(prev, current, op) {
  switch (op) {
    case '+':
      return prev + current;
    case '-':
      return prev - current;
    case '*':
      return prev * current;
    case '/':
      return current === 0 ? 'Ошибка' : prev / current;
    default:
      return current;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (operator !== null && !waitingForSecondOperand) {
    const result = calculate(previousValue, inputValue, operator);
    previousValue = result;
    currentValue = String(result);
    operator = nextOperator;
    waitingForSecondOperand = true;
    updateDisplay();
    return;
  }

  previousValue = inputValue;
  operator = nextOperator;
  currentValue = '0';
  waitingForSecondOperand = true;
  updateDisplay();
}

function clearAll() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function deleteLast() {
  if (waitingForSecondOperand) return;

  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = '0';
  }

  updateDisplay();
}

function percentage() {
  currentValue = String(Number(currentValue) / 100);
  updateDisplay();
}

function handleEquals() {
  if (operator === null || previousValue === null) {
    return;
  }

  const inputValue = Number(currentValue);
  const result = calculate(previousValue, inputValue, operator);

  display.textContent = `${previousValue} ${operator} ${inputValue} = ${result}`;
  currentValue = String(result);
  previousValue = null;
  operator = null;
  waitingForSecondOperand = false;
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.textContent;

    if (action === 'number') {
      inputNumber(value);
      return;
    }

    if (action === 'decimal') {
      inputDecimal();
      return;
    }

    if (action === 'operator') {
      handleOperator(value);
      return;
    }

    if (action === 'equals') {
      handleEquals();
      return;
    }

    if (action === 'clear') {
      clearAll();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'percent') {
      percentage();
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (/\d/.test(event.key)) {
    inputNumber(event.key);
  }

  if (event.key === '.') {
    inputDecimal();
  }

  if (['+', '-', '*', '/'].includes(event.key)) {
    handleOperator(event.key);
  }

  if (event.key === 'Enter' || event.key === '=') {
    handleEquals();
  }

  if (event.key === 'Backspace') {
    deleteLast();
  }

  if (event.key === 'Escape') {
    clearAll();
  }
});

updateDisplay();
