const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';
let justEvaluated = false;

function updateDisplay() {
  display.textContent = expression || '0';
}

function appendToken(token) {
  if (justEvaluated) {
    expression = '';
    justEvaluated = false;
  }

  expression += token;
  updateDisplay();
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

function inputNumber(value) {
  if (justEvaluated) {
    expression = '';
    justEvaluated = false;
  }

  if (expression === '0' && value === '0') {
    return;
  }

  if (expression === '0') {
    expression = value;
  } else {
    expression += value;
  }

  updateDisplay();
}

function inputDecimal() {
  if (justEvaluated) {
    expression = '';
    justEvaluated = false;
  }

  if (!expression) {
    expression = '0.';
    updateDisplay();
    return;
  }

  const lastToken = expression.split(/([+\-*/()])/).pop();

  if (lastToken && lastToken.includes('.')) {
    return;
  }

  if (/[+\-*/(]$/.test(expression)) {
    expression += '0.';
  } else {
    expression += '.';
  }

  updateDisplay();
}

function handleOperator(value) {
  if (!expression) return;

  if (isOperator(expression.slice(-1))) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  justEvaluated = false;
  updateDisplay();
}

function handleLeftParen() {
  if (!expression || isOperator(expression.slice(-1)) || expression.endsWith('(')) {
    expression += '(';
  } else {
    expression += '*(';
  }

  justEvaluated = false;
  updateDisplay();
}

function handleRightParen() {
  if (!expression || /[+\-*/(]$/.test(expression)) return;
  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;

  if (openCount <= closeCount) return;

  expression += ')';
  justEvaluated = false;
  updateDisplay();
}

function clearAll() {
  expression = '';
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (!expression) return;

  expression = expression.slice(0, -1);

  if (!expression) {
    expression = '0';
  }

  justEvaluated = false;
  updateDisplay();
}

function evaluateExpression(rawExpression) {
  const sanitized = rawExpression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');

  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${sanitized});`)();
}

function percentage() {
  if (!expression) return;

  try {
    const value = evaluateExpression(expression);
    expression = String(value / 100);
    justEvaluated = true;
    updateDisplay();
  } catch (error) {
    expression = 'Ошибка';
    justEvaluated = true;
    updateDisplay();
  }
}

function handleEquals() {
  if (!expression) return;

  try {
    const result = evaluateExpression(expression);

    if (!Number.isFinite(result)) {
      expression = 'Ошибка';
    } else {
      expression = String(result);
    }

    justEvaluated = true;
    updateDisplay();
  } catch (error) {
    expression = 'Ошибка';
    justEvaluated = true;
    updateDisplay();
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.textContent;

    if (action === 'number') {
      inputNumber(value);
      return;
    }

    if (action === 'operator') {
      handleOperator(value);
      return;
    }

    if (action === 'decimal') {
      inputDecimal();
      return;
    }

    if (action === 'left-paren') {
      handleLeftParen();
      return;
    }

    if (action === 'right-paren') {
      handleRightParen();
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
      return;
    }

    if (action === 'equals') {
      handleEquals();
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

  if (event.key === '(') {
    handleLeftParen();
  }

  if (event.key === ')') {
    handleRightParen();
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
