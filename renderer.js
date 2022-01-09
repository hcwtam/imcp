const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
const canvas = document.getElementById("progress-bar");
const context = canvas.getContext("2d");
const sourceButton = document.getElementById("source");
const targetButton = document.getElementById("target");
const targetPath = document.getElementById("target-path");
const button = document.getElementById("button");
// const panel = document.getElementById("panel");
const success = document.getElementById("success");
const resetButton = document.getElementById("reset");
const items = document.getElementById("items");
const size = document.getElementById("size");
const timeLeft = document.getElementById("time-left");

// states
let startDateValue, endDateValue;
let srcDir, trgDir;
let showPanel = false;

// On app start, look for DCIM directory for phone, set it to srcDir if it's found
if (window.props.phoneDir) {
  srcDir = window.props.phoneDir;
  sourceButton.style.backgroundColor = "#d7ecf7";
  sourceButton.title = window.props.phoneDir;
}

// select dates
startInput.addEventListener("change", (event) => {
  startDateValue = event.target.value;
  if (!endDateValue) {
    endInput.setAttribute("min", startDateValue);
    button.disabled = true;
    return;
  }
  if (endDateValue && new Date(endDateValue) < new Date(startDateValue)) {
    endInput.value = "";
    endInput.setAttribute("min", startDateValue);
    endDateValue = "";
    button.disabled = true;
  } else if (
    new Date(endDateValue) >= new Date(startDateValue) &&
    srcDir &&
    trgDir
  ) {
    button.disabled = false;
  }
});

endInput.addEventListener("change", (event) => {
  endDateValue = event.target.value;
  if (startDateValue && srcDir && trgDir) button.disabled = false;
});

// progress bar
// let al = 0;
// let start = 4.72;
// let cw = context.canvas.width / 2;
// let ch = context.canvas.height / 2;
// let diff;

// function progressBar() {
//   diff = (al / 100) * Math.PI * 2;
//   context.clearRect(0, 0, 400, 400);
//   context.beginPath();
//   context.arc(cw, ch, 160, 0, 2 * Math.PI, false);
//   context.fillStyle = "#FFF";
//   context.fill();
//   context.strokeStyle = "#eee";
//   context.stroke();
//   context.fillStyle = "#000";
//   context.strokeStyle = "#84c6c6";
//   context.textAlign = "center";
//   context.lineWidth = 5;
//   context.font = "8pt Verdana";
//   context.beginPath();
//   context.arc(cw, ch, 160, start, diff + start, false);
//   context.stroke();
//   if (al >= 100) {
//     clearTimeout(bar);
//   }

//   al += 0.1;
// }

// let bar = setInterval(progressBar, 5);

// select directory
sourceButton.onclick = () => {
  window.api.selectSrcDirectory();
};

window.api.srcDir((data) => {
  srcDir = data;
  if (srcDir) {
    sourceButton.title = srcDir;
    sourceButton.style.backgroundColor = "#d7ecf7";
  }
  if (startDateValue && endDateValue) button.disabled = false;
});

targetButton.onclick = () => {
  window.api.selectTrgDirectory();
};

window.api.trgDir((data) => {
  trgDir = data;
  if (trgDir) {
    targetPath.textContent = getFileName(trgDir);
    targetPath.title = trgDir;
    targetButton.title = trgDir;
    targetButton.style.backgroundColor = "#d7ecf7";
  }
  if (startDateValue && endDateValue) button.disabled = false;
});

// panel
// if (!showPanel) {
//   panel.style.display = "none";
// }

// submit
button.onclick = () => {
  // showPanel = true;
  window.api.copyFiles(startDateValue, endDateValue);
  button.style.display = "none";
  // panel.style.display = "flex";
};

//success
window.api.success((msg) => {
  success.innerText = msg;
  resetButton.style.display = "block";
});

// reset button
resetButton.onclick = () => {
  resetButton.style.display = "none";
  success.innerText = "";
  button.style.display = "block";
};

// utils
function getFileName(path) {
  const array = path.split("/");
  return "/" + array[array.length - 1];
}