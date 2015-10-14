function fun1(x) { return Math.sin(x);  }
function fun2(x) { return 2 * Math.cos(1 * x);}

var funArray = [
  function (x) {
    return Math.pow(x, 2);
  }
];

function draw(fun) {
  var canvas = document.getElementById("canvas");
  if (null === canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var axes = {};
  axes.x0 = 0.5 * canvas.width;  // x0 pixels from left to x=0
  axes.y0 = 0.5 * canvas.height; // y0 pixels from top to y=0
  axes.scale = 50;                 // 40 pixels from x=0 to x=1

  showAxes(ctx, axes);

  // for(var f in funArray)
  //   funcGraph(ctx,axes,funArray[f],"rgb(11,153,11)",1); 

  // showRangeLine(ctx, axes, 100, "rgb(66,44,255)", 2);
  // showRangeLine(ctx, axes, -100, "rgb(66,44,255)", 2);
  console.log(fun);
  if(fun !== undefined) funcGraph(ctx, axes, fun, "rgb(11,153,11)", 2);

}


function showAxes(ctx, axes) {
  var x0 = axes.x0, w = ctx.canvas.width;
  var y0 = axes.y0, h = ctx.canvas.height;

  ctx.beginPath();
  ctx.strokeStyle = "rgb(128,128,128)"; 
  ctx.moveTo(0, y0);  ctx.lineTo(w,y0);  // X axis
  ctx.moveTo(x0, 0);  ctx.lineTo(x0,h);  // Y axis

  var iMax = Math.round(ctx.canvas.width - x0);
  var iMin = Math.round(-x0);

  ctx.font = "14px Georgia";
  ctx.textBaseline = "middle";

  // Drawing the y-axis numbers
  ctx.textAlign = "left"; 
  for(var i = y0 - axes.scale; i >= -h; i -= axes.scale) {
    ctx.fillText(-(i - h / 2) / axes.scale, x0 + 3, i);
    drawLine(ctx, x0 - 3, i, x0 + 3, i);
  }
  for(var i = y0 + axes.scale; i <= h; i += axes.scale) {
    ctx.fillText(-(i - h / 2) / axes.scale, x0 + 3, i);
    drawLine(ctx, x0 - 3, i, x0 + 3, i);
  }

  // Drawing the x-axis numbers
  ctx.textAlign="center"; 
  for(var i = x0 - axes.scale; i >= -w; i -= axes.scale) {
    ctx.fillText((i - w / 2) / axes.scale, i, y0 + 14);
    drawLine(ctx, i, y0 - 3, i, y0 + 3);
  }
  for(var i = x0 + axes.scale; i <= w; i += axes.scale) {
    ctx.fillText((i - w / 2) / axes.scale, i, y0 + 14);
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
 var scale = axes.scale;

 var iMax = Math.round(ctx.canvas.width - x0);
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
  var scale = axes.scale;

  ctx.beginPath();
  ctx.lineWidth = thick;
  ctx.strokeStyle = color;

  ctx.moveTo(x0 + x, 0);
  ctx.lineTo(x0 + x, y0 * 2);

  ctx.stroke();
}