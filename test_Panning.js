// canvas related variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width;
var ch = canvas.height;

var offsetX, offsetY;

// account for scrolling
function reOffset() {
	var BB = canvas.getBoundingClientRect();
	offsetX = BB.left;
	offsetY = BB.top;
}

reOffset();
window.onscroll = function (e) {
	reOffset();
};
window.onresize = function (e) {
	reOffset();
};

// mouse drag related variables
var isDown = false;
var startX, startY;

// the accumulated horizontal(X) & vertical(Y) panning the user has done in total
var netPanningX = 0;
var netPanningY = 0;

// just for demo: display the accumulated panning
const results = document.querySelector("#results");

// listen for mouse events
canvas.addEventListener("mousedown", function (evt) {
	handleMouseDown(evt);
});
canvas.addEventListener("mouseup", function (evt) {
	handleMouseUp(evt);
});
canvas.addEventListener("mousemove", function (evt) {
	handleMouseMove(evt);
});
canvas.addEventListener("mouseout", function (evt) {
	handleMouseOut(evt);
});

renderFrame = () => {
	ctx.clearRect(0, 0, cw, ch);
	drawAxis();

	ctx.beginPath();
	ctx.arc(50 + netPanningX, 50 + netPanningY, 50, 0, 2 * Math.PI);
	ctx.stroke();
};

function render() {
	renderFrame();

	window.requestAnimationFrame(this.render.bind(this, this.canvas));
}

function drawAxis() {
	// draw the numbered horizontal & vertical reference lines
	// The horizontal line is offset leftward or rightward by netPanningX
	// The vertical line is offset upward or downward by netPanningY
	var xAxis_start = -50;
	var yAxis_start = -50;
	var xAxis_Y_position = 20; //ch / 2;
	var yAxis_X_position = 20; //cw / 2;
	for (var x = xAxis_start; x < 50; x++) {
		ctx.fillText(x, x * 20 + netPanningX, xAxis_Y_position);
	}
	for (var y = yAxis_start; y < 50; y++) {
		ctx.fillText(y, yAxis_X_position, y * 20 + netPanningY);
	}
}

function handleMouseDown(e) {
	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();

	// calc the starting mouse X,Y for the drag
	startX = parseInt(e.clientX - offsetX);
	startY = parseInt(e.clientY - offsetY);

	// set the isDragging flag
	isDown = true;
}

function handleMouseUp(e) {
	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();

	// clear the isDragging flag
	isDown = false;
}

function handleMouseOut(e) {
	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();

	// clear the isDragging flag
	isDown = false;
}

function handleMouseMove(e) {
	// only do this code if the mouse is being dragged
	if (!isDown) {
		return;
	}

	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();

	// get the current mouse position
	mouseX = parseInt(e.clientX - offsetX);
	mouseY = parseInt(e.clientY - offsetY);

	// dx & dy are the distance the mouse has moved since the last mousemove event
	var dx = mouseX - startX;
	var dy = mouseY - startY;

	// reset the vars for next mousemove
	startX = mouseX;
	startY = mouseY;

	// accumulate the net panning done
	netPanningX += dx;
	netPanningY += dy;
	results.textContent =
		"Net change in panning: x:" +
		netPanningX +
		"px, y:" +
		netPanningY +
		"px";
}
render();
