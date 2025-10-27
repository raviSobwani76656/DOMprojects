// script.js - Counter App

// Select DOM elements
const valueEl = document.getElementById("value");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");

let count = 0;

// Update the displayed counter
function updateValue() {
  valueEl.textContent = count;

  // Color feedback based on value
  if (count > 0) {
    valueEl.style.color = "#22c55e"; // green
  } else if (count < 0) {
    valueEl.style.color = "#ef4444"; // red
  } else {
    valueEl.style.color = "#e2e8f0"; // default
  }
}

// Event listeners
increaseBtn.addEventListener("click", () => {
  count++;
  updateValue();
});

decreaseBtn.addEventListener("click", () => {
  count--;
  updateValue();
});

resetBtn.addEventListener("click", () => {
  count = 0;
  updateValue();
});

// Initialize
updateValue();
