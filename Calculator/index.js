// script.js - DOM Calculator
(() => {
  const displayEl = document.getElementById("display");
  const buttons = document.querySelectorAll(".btn");
  let expression = ""; // holds the expression string
  let lastWasOperator = false; // helper to prevent duplicate operators
  let parenBalance = 0;

  function updateDisplay() {
    displayEl.textContent = expression || "0";
  }

  function pushValue(val) {
    // if val is operator
    const operators = ["+", "-", "*", "/"];
    if (operators.includes(val)) {
      if (!expression && val !== "-") return; // don't start with operator except minus
      if (lastWasOperator) {
        // replace last operator
        expression = expression.slice(0, -1) + val;
      } else {
        expression += val;
      }
      lastWasOperator = true;
    } else if (val === ".") {
      // prevent multiple dots in current numeric token
      const tokens = expression.split(/[\+\-\*\/\(\)]/);
      const current = tokens[tokens.length - 1];
      if (!current.includes(".")) {
        expression += ".";
        lastWasOperator = false;
      }
    } else {
      expression += val;
      lastWasOperator = false;
    }
    updateDisplay();
  }

  function clearAll() {
    expression = "";
    lastWasOperator = false;
    parenBalance = 0;
    updateDisplay();
  }

  function deleteOne() {
    if (!expression) return;
    const last = expression.slice(-1);
    expression = expression.slice(0, -1);
    if (last === "(") parenBalance = Math.max(0, parenBalance - 1);
    if (last === ")") parenBalance++;
    lastWasOperator = /[+\-*/]$/.test(expression);
    updateDisplay();
  }

  function toggleParen() {
    // add '(' if next should open, otherwise add ')'
    if (!expression || lastWasOperator) {
      expression += "(";
      parenBalance++;
    } else if (parenBalance > 0) {
      expression += ")";
      parenBalance--;
    } else {
      // no open paren to close -> open a new one implicitly multiply
      if (/\d$/.test(expression)) expression += "*(";
      else expression += "(";
      parenBalance++;
    }
    lastWasOperator = false;
    updateDisplay();
  }

  function safeEvaluate(expr) {
    // Only allow digits, operators, parentheses and dots
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) throw new Error("Invalid characters");
    // Close any unclosed parentheses
    while (parenBalance > 0) {
      expr += ")";
      parenBalance--;
    }
    // Evaluate using Function (slightly safer than eval in local project)
    // Note: This is fine for a local educational project; don't evaluate untrusted input on servers.
    /* eslint-disable no-new-func */
    return Function(`"use strict"; return (${expr})`)();
  }

  function calculate() {
    try {
      if (!expression) return;
      const result = safeEvaluate(expression);
      expression = String(result);
      lastWasOperator = false;
      parenBalance = 0;
      updateDisplay();
    } catch (err) {
      displayEl.textContent = "Error";
      setTimeout(updateDisplay, 800);
    }
  }

  // Button clicks
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = btn.getAttribute("data-value");
      const action = btn.getAttribute("data-action");

      if (action === "clear") return clearAll();
      if (action === "delete") return deleteOne();
      if (action === "paren") return toggleParen();
      if (action === "equals") return calculate();
      if (v) return pushValue(v);
    });
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (/^[0-9]$/.test(key)) pushValue(key);
    else if (key === ".") pushValue(".");
    else if (key === "Enter" || key === "=") {
      e.preventDefault();
      calculate();
    } else if (key === "Backspace") deleteOne();
    else if (key === "Escape") clearAll();
    else if (["+", "-", "*", "/", "(", ")"].includes(key)) pushValue(key);
  });

  // initialize
  clearAll();
})();
