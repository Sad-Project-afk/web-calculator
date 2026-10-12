const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';
let currentNumber = '0';
let previousNumber = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = expression + currentNumber;
}

function inputNumber(value) {
  if (shouldResetDisplay) {
    currentNumber = value;
    shouldResetDisplay = false;
  } else {
    currentNumber = currentNumber === '0' ? value : currentNumber + value;
  }

  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentNumber = '0.';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (!currentNumber.includes('.')) {
    currentNumber += '.';
    updateDisplay();
  }
}

function performCalculation(prev, current, op) {
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
  const inputValue = Number(currentNumber);

  if (previousNumber !== null && operator && !shouldResetDisplay) {
    // Если уже есть оператор, вычислим промежуточный результат
    const result = performCalculation(previousNumber, inputValue, operator);
    currentNumber = String(result);
    expression = `${result} ${nextOperator} `;
    previousNumber = result;
  } else {
    // Первый раз вводим оператор
    previousNumber = inputValue;
    expression = `${currentNumber} ${nextOperator} `;
  }

  operator = nextOperator;
  shouldResetDisplay = true;
  updateDisplay();
}

function clearAll() {
  expression = '';
  currentNumber = '0';
  previousNumber = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetDisplay) return;

  if (currentNumber.length > 1) {
    currentNumber = currentNumber.slice(0, -1);
  } else {
    currentNumber = '0';
  }

  updateDisplay();
}

function percentage() {
  currentNumber = String(Number(currentNumber) / 100);
  updateDisplay();
}

function handleEquals() {
  if (previousNumber === null || operator === null) {
    return;
  }

  const inputValue = Number(currentNumber);
  const result = performCalculation(previousNumber, inputValue, operator);

  currentNumber = String(result);
  expression = `${previousNumber} ${operator} ${inputValue} = `;
  previousNumber = null;
  operator = null;
  shouldResetDisplay = true;
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
