const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let storedValue = null;
let operator = null;
let waitingForNewValue = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function inputNumber(value) {
  if (waitingForNewValue) {
    currentValue = value;
    waitingForNewValue = false;
  } else {
    currentValue = currentValue === '0' ? value : currentValue + value;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForNewValue) {
    currentValue = '0.';
    waitingForNewValue = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function performCalculation() {
  const inputValue = Number(currentValue);

  if (storedValue === null || operator === null) {
    return inputValue;
  }

  switch (operator) {
    case '+':
      return storedValue + inputValue;
    case '-':
      return storedValue - inputValue;
    case '*':
      return storedValue * inputValue;
    case '/':
      return inputValue === 0 ? 'Ошибка' : storedValue / inputValue;
    default:
      return inputValue;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (storedValue === null) {
    storedValue = inputValue;
  } else if (!waitingForNewValue) {
    const result = performCalculation();
    currentValue = String(result);
    storedValue = result;
  }

  operator = nextOperator;
  waitingForNewValue = true;
  updateDisplay();
}

function clearAll() {
  currentValue = '0';
  storedValue = null;
  operator = null;
  waitingForNewValue = false;
  updateDisplay();
}

function deleteLast() {
  if (waitingForNewValue) return;

  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = '0';
  }

  updateDisplay();
}

function percentage() {
  const value = Number(currentValue) / 100;
  currentValue = String(value);
  updateDisplay();
}

function handleEquals() {
  if (operator === null || waitingForNewValue) {
    return;
  }

  const result = performCalculation();
  currentValue = String(result);
  storedValue = null;
  operator = null;
  waitingForNewValue = false;
  updateDisplay();
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