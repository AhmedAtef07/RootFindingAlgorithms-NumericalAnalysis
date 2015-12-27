var properties = ['scale', 'width', 'height'];
var scale = 40;
var width = 600;
var height = 300;
var a = -5;
var b = 5;
var tolerance = 0.01;
var eta = 0;
var xVector = [];

var constants = {
  rangeLine: {
    current: {
      color: "rgb(66,44,255)",
      thick: 2
    },
    old: {
      color: "rgb(164, 154, 255)",
      thick: 2
    }
  }
};

var isSolving = false;

var rangeLines = {};

var logger;
var equation;
var table;


function runOnce() {
  logger = document.getElementById('equation-status');
  equation = document.getElementById('equation');
  table = document.getElementById('steps-table');
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth - 400;
  canvas.height= window.innerHeight - 70;
  width = canvas.width;
  height = canvas.height;


  $('#equation, #a, #b, #tolerance').bind("propertychange change click keyup input paste", function(event) {
    checkEquation(event);
  });  
  $('#a').val(a);
  $('#b').val(b);
  $('#tolerance').val(tolerance);
  if(get('equation') !== undefined) {
    document.getElementById('equation').value =  get('equation');
  }
  if(get('a') !== undefined) {
    document.getElementById('a').value =  get('a');
  }
  if(get('b') !== undefined) {
    document.getElementById('b').value =  get('b');
  }
  if(get('tolerance') !== undefined) {
    document.getElementById('tolerance').value =  get('tolerance');
  }
  addPropertiesToSideBar();

  tryToDraw();

  if(window.location.search.includes('autostart')) {
    document.getElementsByTagName('button')[0].click();
  }
}

function get(name){
  if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
    return decodeURIComponent(name[1]);
  }
}

function draw(fun) {
  var canvas = document.getElementById("canvas");
  if(null === canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var axes = {};
  axes.x0 = width / 2;
  axes.y0 = height / 2;
  axes.color = "rgb(128,128,128)";
  axes.thick = 2;

  showAxes(ctx, axes);

  if(fun !== undefined) f = fun;
  if(f !== undefined) {
    funcGraph(ctx, axes, f, "rgb(11,153,11)", 2);
  }

  for(var i in rangeLines) {
    showRangeLine(ctx, axes, rangeLines[i], i);    
  }
}

function showAxes(ctx, axes) {
  var x0 = axes.x0, w = width;
  var y0 = axes.y0, h = height;

  ctx.beginPath();
  ctx.strokeStyle = axes.color;
  ctx.lineWidth = axes.thick;
  ctx.moveTo(0, y0);  ctx.lineTo(w,y0);  // X axis
  ctx.moveTo(x0, 0);  ctx.lineTo(x0,h);  // Y axis

  var iMax = Math.round(width - x0);
  var iMin = Math.round(-x0);

  ctx.font = "14px Arial";
  ctx.fillStyle = axes.color;
  ctx.textBaseline = "middle";

  // Drawing the y-axis numbers
  ctx.textAlign = "left"; 
  for(var i = y0 - scale; i >= -h; i -= scale) {
    ctx.fillText(-(i - h / 2) / scale, x0 + 3, i);
    drawLine(ctx, x0 - 3, i, x0 + 3, i);
  }
  for(var i = y0 + scale; i <= h; i += scale) {
    ctx.fillText(-(i - h / 2) / scale, x0 + 3, i);
    drawLine(ctx, x0 - 3, i, x0 + 3, i);
  }

  // Drawing the x-axis numbers
  ctx.textAlign="center"; 
  for(var i = x0 - scale; i >= -w; i -= scale) {
    ctx.fillText((i - w / 2) / scale, i, y0 + 14);
    drawLine(ctx, i, y0 - 3, i, y0 + 3);
  }
  for(var i = x0 + scale; i <= w; i += scale) {
    ctx.fillText((i - w / 2) / scale, i, y0 + 14);
    drawLine(ctx, i, y0 - 3, i, y0 + 3);
  }

  ctx.stroke();
}

function drawLine (ctx, x0, y0, x1, y1) {
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
}

function funcGraph (ctx, axes, func, color, thick) {
  var x0 = axes.x0;
  var y0 = axes.y0;

  var iMax = Math.round(width - x0);
  var iMin = Math.round(-x0);

  ctx.beginPath();
  ctx.lineWidth = thick;
  ctx.strokeStyle = color;

  for (var i = iMin; i <= iMax; i++) {
    xx = i; 
    yy = scale * func(xx / scale);
    if (i == iMin) ctx.moveTo(x0 + xx, y0 - yy);
    else           ctx.lineTo(x0 + xx, y0 - yy);
  }
  ctx.stroke();
}

function showRangeLine(ctx, axes, rangeLine, step) {
  var x0 = axes.x0;
  var y0 = axes.y0;

  var x1 = rangeLine.x1 * scale;
  var y1 = rangeLine.y1 * scale;
  var x2 = rangeLine.x2 * scale;
  var y2 = rangeLine.y2 * scale;

  var letter = rangeLine.letter;

  var color = rangeLine.color;

  ctx.beginPath();
  ctx.lineWidth = rangeLine.thick;
  ctx.strokeStyle = color;

  drawLine(ctx, x0 + x1, y0 - y1, x0 + x2, y0 - y2);

  // ctx.font = "800 14px Arial";
  // ctx.fillStyle = color;
  // ctx.textAlign = "center";
  // ctx.textBaseline = "middle";
  // ctx.fillText(letter, x0 + x1, 5);
  // if(step !== undefined) ctx.fillText(step, x0 + x1, y0 * 2 - 5);

  ctx.stroke();
}

function addNewRangeLine(letter, x1, y1, x2, y2) {
  var rangeLine = {
    letter: letter,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    color: constants.rangeLine.current.color,
    thick: constants.rangeLine.current.thick 
  };
  // Changing old range lines colors.
  for(var i in rangeLines) {
    if (rangeLines[i].letter == letter) {
      rangeLines[i].color = constants.rangeLine.old.color;
      rangeLines[i].thick = constants.rangeLine.old.thick;
    }
  }
  rangeLines.push(rangeLine);
}

function checkEquation (event) {
  try {
    var x = 0;
    var res = eval(equation.value); 
    logger.innerHTML = "Result at x=0: " + res;
    logger.style.color = "green";
    tryToDraw();
  } catch (e) {
    logger.innerHTML = e.message;
    logger.style.color = "red";
  }
}

function tryToDraw() {
  var fun = new Function('x', 'return ' + equation.value);

  a = parseFloat(document.getElementById('a').value);
  b = parseFloat(document.getElementById('b').value);
  tolerance = parseFloat(document.getElementById('tolerance').value);

  rangeLines = [];
  addNewRangeLine('A', a, -height, a, height);
  addNewRangeLine('B', b, -height, b, height);

  draw(fun);
}  

function propertiesChanged(event) {
  elem = event.currentTarget;
  if (elem.value >= 7) {
    eval(elem.id + '= parseFloat(elem.value)');
  }
  draw();
}

function addPropertiesToSideBar() {
  var parentDiv = document.getElementById('properties');
  for(var i in properties) {
    var e = properties[i];
    var label = document.createElement('label');
    label.innerHTML = e;
    label.htmlFor = e;
    var input = document.createElement('input');
    input.className = 'u-full-width';
    input.type = 'number';
    input.min = 7;
    input.id = e;
    input.value = eval(e);
    parentDiv.appendChild(label);
    parentDiv.appendChild(input);
    $('input').bind("propertychange change click keyup input paste", function(event) {
      propertiesChanged(event);
    });     
  }
}

function startAlgo(event) {
  isSolving = !isSolving;
  var target = event.target || event.srcElement;
  $('#equation-section :input').prop("disabled", isSolving);
  if (isSolving) {
    target.innerHTML = "Reset";
    target.classList.remove("button-primary");
  } else {
    target.innerHTML = "Start";
    target.classList.add("button-primary");
    return;
  } 
  xVector.push(Math.min(a, b));
  xVector.push(Math.max(a, b));
  var f = new Function('x', 'return ' + equation.value);
  // var etaF = new Function('x', 'return', etaf); 
  eta = (b - a ) / f(a);
  startLooping(0);
}

function startLooping(stepNumber) {
  if (!isSolving) return;
  var finish = false;
  // addNewRangeLine('A', a, f(a), b, f(b));
  var f = new Function('x', 'return ' + equation.value);

  xn2 = xVector[xVector.length - 1];
  xn1 = xVector[xVector.length - 1];
  console.log(xn1);
  xs = successiveMethod(xn1);
  diff = Math.abs(xs - xn1);

  values = {
    "Iteration #": stepNumber,
    "x-1": xn2,
    "x0": xn1,
    "F(x-1)": f(xn2),
    "F(x0)": f(xn1),
    "x+1": xs,
    "|x+1 - x0|": diff
  };
  xVector.push(xs);    
  addTableRow(values);

  if (diff < tolerance) {
    finish = true;
  }

  if(finish) {
    logger.innerHTML = "Root found = " + xs + "<br>" +
      "After " + (stepNumber) + " iterations.";
    logger.style.color = "green";
  } else {
    setTimeout( function() { startLooping(stepNumber + 1); }, 500);
  } 
}

function addTableRow(values) {
  var p = Math.max(0, Math.floor(Math.log10(tolerance)) * -1 + 1);
  var cells = [];
  var row = table.insertRow();
  for (var v in values) {
    row.insertCell().innerHTML = values[v].toFixed(p);
  }  
}

function successiveMethod(x0) {
  var f = new Function('x', 'return ' + equation.value);
  console.log(f);
  return x0 + eta * f(x0);
}