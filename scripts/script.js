const codeContent = document.querySelector('#editor');
const codeOutput = document.querySelector('#output');
const consoleOutput = document.querySelector('#console');
const executeBtn = document.querySelector('#execute');
const clearConsoleBtn = document.querySelector('#clear');
const lineCounter = document.querySelector('#line-counter');

const autoCloseChars = new Map([
  ['{', '}'],
  ['(', ')'],
  ['[', ']'],
  ['"', '"'],
  ["'", "'"],
  ['`', '`'],
])

function runCode() {
  const code = codeContent.value;
  console.log = function (message) {
    if (typeof message == 'object') {
      consoleOutput.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
    } else {
      consoleOutput.innerHTML += message + '<br />';
    }
  }
  let result
  try {
    result = eval(code);
  } catch (e) {
    result = e.message;
  }
  if (typeof result === "object") result = JSON.stringify(result);
  codeOutput.innerHTML = result;
}

function clearConsole() {
  consoleOutput.innerHTML = '';
  codeOutput.innerHTML = '';
}

function handleAutoClose(e) {
  const key = e.data;
  if (!autoCloseChars.get(key)) return;
  const {
    selectionStart,
    selectionEnd,
    value
  } = e.target;
  const char = value[selectionStart - 1];
  const closeChar = autoCloseChars.get(char);
  if (closeChar) {
    e.target.value = value.slice(0, selectionStart) + closeChar + value.slice(selectionEnd);
    e.target.selectionStart = selectionStart;
    e.target.selectionEnd = selectionEnd;
  }
}

function handleLineCount() {
  const lines = codeContent.value.split(/\r|\r\n|\n/);
  lineCounter.innerHTML = '';
  for (let i = 1; i <= Math.max(lines.length, 10); i++) {
    lineCounter.innerHTML += `<div class="code-line">${i}</div>`;
  }
}

function handleIndentation(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  let {
    selectionStart,
    selectionEnd,
    value
  } = e.target;
  const beforeCursor = value.slice(0, selectionStart);
  const afterCursor = value.slice(selectionStart);
  let count = 0;
  for (let char of beforeCursor) {
    if (char === '{') count++;
    if (char === '}') count--;
  }
  const cursorPosition = selectionStart;
  if (value[cursorPosition - 1] === '{' && value[cursorPosition] === '}') {
    e.target.value = beforeCursor + "\n" + ' '.repeat(count * 2) + "\n" + ' '.repeat((count - 1) * 2) + afterCursor;
  } else {
    e.target.value = beforeCursor + "\n" + ' '.repeat(count * 2) + afterCursor;
  }
  e.target.setSelectionRange(cursorPosition + (count * 2) + 1, cursorPosition + (count * 2) + 1);

  handleLineCount();
}

document.addEventListener('DOMContentLoaded', () => {
  // loadCodeFromLocalStorage();
  handleLineCount();
  executeBtn.addEventListener('click', runCode);
  clearConsoleBtn.addEventListener('click', clearConsole);
  codeContent.addEventListener('input', (e) => {
    handleAutoClose(e);
    handleLineCount();
    // saveCodeToLocalStorage();
  })
  codeContent.addEventListener('keydown', (e) => {
    handleIndentation(e);
  });
});