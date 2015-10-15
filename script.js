var properties = ["scale", "width", "height"];
var scale = 40;
var width = 600;
var height = 300;

function runOnce() {
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth - 350;
  canvas.height= window.innerHeight - 100;
  width = canvas.width;
  height = canvas.height;
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

  showAxes(ctx, axes);

  // showRangeLine(ctx, axes, 100, "rgb(66,44,255)", 2);
  // showRangeLine(ctx, axes, -100, "rgb(66,44,255)", 2);
  if(fun !== undefined) funcGraph(ctx, axes, fun, "rgb(11,153,11)", 2);

}


function showAxes(ctx, axes) {
  var x0 = axes.x0, w = width;
  var y0 = axes.y0, h = height;

  ctx.beginPath();
  ctx.strokeStyle = "rgb(128,128,128)"; 
  ctx.moveTo(0, y0);  ctx.lineTo(w,y0);  // X axis
  ctx.moveTo(x0, 0);  ctx.lineTo(x0,h);  // Y axis

  var iMax = Math.round(width - x0);
  var iMin = Math.round(-x0);

  ctx.font = "14px Georgia";
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

function showRangeLine(ctx, axes, x, color, thick) {
  var x0 = axes.x0;
  var y0 = axes.y0;

  ctx.beginPath();
  ctx.lineWidth = thick;
  ctx.strokeStyle = color;

  ctx.moveTo(x0 + x, 0);
  ctx.lineTo(x0 + x, y0 * 2);

  ctx.stroke();
}