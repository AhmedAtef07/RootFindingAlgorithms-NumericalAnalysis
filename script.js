var properties = ['scale', 'width', 'height'];
var scale = 40;
var width = 600;
var height = 300;
var a = -5;
var b = 5;
var tolerance = 4;

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

f = {};

var algoStarted = false;

var rangeLines = {};

function runOnce() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth - 400;
  canvas.height= window.innerHeight - 70;
  width = canvas.width;
  height = canvas.height;


  $('#a, #b, #tolerance').bind("propertychange change click keyup input paste", function(event) {
    checkEquation(event);
  });  
  $('#a').val(a);
  $('#b').val(b);
  $('#tolerance').val(tolerance);
  addPropertiesToSideBar();

  tryToDraw();
}

function draw(fun) {
  var canvas = document.getElementById("canvas");
  if (null === canvas || !canvas.getContext) return;

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

function funcGraph (ctx,axes,func,color,thick) {
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
  var x = rangeLine.x * scale;
  var letter = rangeLine.letter;
  var color = rangeLine.color;

  ctx.beginPath();
  ctx.lineWidth = rangeLine.thick;
  ctx.strokeStyle = color;

  drawLine(ctx, x0 + x, 13, x0 + x, y0 * 2 - 13);

  ctx.font = "800 14px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, x0 + x, 5);
  if(step != undefined) ctx.fillText(step, x0 + x, y0 * 2 - 5);

  ctx.stroke();
}

function addNewRangeLine(letter, x) {
  var rangeLine = {
    letter: letter,
    x: x, 
    color: constants.rangeLine.current.color,
    thick: constants.rangeLine.current.thick 
  };
  for(var i in rangeLines) {
    if (rangeLines[i].letter == letter) {
      rangeLines[i].color = constants.rangeLine.old.color;
      rangeLines[i].thick = constants.rangeLine.old.thick;
    }
  }
  rangeLines.push(rangeLine);
}