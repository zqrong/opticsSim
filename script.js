var keys;
var points;
var mirrors;
var selected;
var selectedXDelta;
var selectedYDelta;
var downOnSelected;
var rotationOnSelected;
var clocked;
var laserOn;
var laserButton;
var xPosBox;
var yPosBox;
var angleBox;
var isTyping;
var pointer;
var score;
var scoreLabel;
var grid;
var showGrid;
var data;

function startGame(){
	keys = {};
	points = [];
	mirrors = [];
	selected = null;
	downOnSelected = false;
	rotationOnSelected = false;
	clicked = false;
	laserOn = false;
	isTyping = false;
	score = 0.0;
	showGrid = false;

	laserButton = document.getElementById("switch");
	xPosBox = document.getElementById("xPos");
	yPosBox = document.getElementById("yPos");
	angleBox = document.getElementById("angle");
	scoreLabel = document.getElementById("score");
	grid = document.getElementById("grid");
	data = document.getElementById("data");

	document.getElementById("xPos").addEventListener("keydown", function(event) {
    	if (event.keyCode === 13) {
    		setXPos();
    		xPosBox.select();
    	}
	});
	document.getElementById("yPos").addEventListener("keydown", function(event) {
    	if (event.keyCode === 13) {
    		setYPos();
    		yPosBox.select();
    	}
	});
	document.getElementById("angle").addEventListener("keydown", function(event) {
    	if (event.keyCode === 13) {
    		setAngle();
    		angleBox.select();
    	}
	});

	myGameArea.start();

	var tempLength = myGameArea.canvas.width * 0.7 * (6.5 / 56.0);
	for (var i = 0; i < 5; i++){
		mirrors.push(new Mirror(myGameArea.canvas.width * 0.7 + 10 + tempLength * 0.5, (i + 1) * tempLength * 0.5, Math.PI / 4.0, tempLength, 1));
	}
	for (var i = 5; i < 8; i++){
		mirrors.push(new Mirror(myGameArea.canvas.width * 0.7 + 10 + tempLength * 0.5, (i + 1) * tempLength * 0.5, Math.PI / 4.0, tempLength, -1));
	}

	pointer = new Pointer(myGameArea.canvas.width * 0.7 * (5.0 / 8.0) * 0.5);
	pointer.randomize();
}

function setXPos(){
	xPosBox.select();
	var toFloat = parseFloat(xPosBox.value);
    if (toFloat && selected != null){
		mirrors[selected].x = toFloat * ((myGameArea.canvas.width * 0.7) / 56.0) + 10.0;
    }
    setText();
}

function setYPos(){
	yPosBox.select();
	var toFloat = parseFloat(yPosBox.value);
    if (toFloat && selected != null){
		mirrors[selected].y = -toFloat * ((myGameArea.canvas.width * 0.7 * (5.0 / 8.0)) / 35.0) + ((10.0 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0)));
    }
    setText();
}

function setAngle(){
	angleBox.select();
	var toFloat = parseFloat(angleBox.value);
    if ((toFloat || toFloat == 0.0) && selected != null){
		mirrors[selected].angle = normalizeAngle360(-(toFloat - 360) * (Math.PI / 180.0));
    }
    setText();
}

function getHelp(){
	alert("Welcome to The Laser Shoot Simulator!\nHere are a few tips:\n1) Click and drag to move the mirrors.\n2) For precision movement use the arrow keys.\n3) When selected on a mirror hold shift while clicking and dragging to rotate the mirror.\n4) For precision rotation hold shift while pressing the arrow keys.\n5) Press enter when selected on a mirror to toggle between the different mirror styles.");
}

function showHideGrid(){
	if (grid.value == "Show Grid"){
		showGrid = true;
		grid.value = "Hide Grid";
	}
	else{
		showGrid = false;
		grid.value = "Show Grid"
	}
}

function showHideData(){
	if (data.value == "Show Data"){
		data.value = "Hide Data";
		xPosBox.style.visibility = "visible";
		yPosBox.style.visibility = "visible";
		angleBox.style.visibility = "visible";
	}
	else{
		data.value = "Show Data";
		xPosBox.style.visibility = "hidden";
		yPosBox.style.visibility = "hidden";
		angleBox.style.visibility = "hidden";
	}
}

function textOut(){
	isTyping = false;
	setText();
}

function textIn(){
	isTyping = true;
}

function keyActions(){
	if (isTyping == false){
		if (keys[16] == true){
			if (selected != null && rotationOnSelected == false){
				mirrors[selected].image.src = "rotateMirror" + String(mirrors[selected].numMirrors) + ".png";
			}
			rotationOnSelected = true;

		}
		if (keys[16] == false){
			if (selected != null && rotationOnSelected == true){
				mirrors[selected].image.src = "selectedMirror" + String(mirrors[selected].numMirrors) + ".png";
			}
			rotationOnSelected = false;
		}
	}
}

function laserOnOff(){
	if (laserButton.value == "Laser On"){
		laserOn = true;
		laserButton.value = "Laser Off";
	}
	else{
		laserOn = false;
		laserButton.value = "Laser On"
	}
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        // this.canvas.width = window.innerWidth * 0.7;
        // this.canvas.height = window.innerHeight * 0.7;
		this.canvas.width = 2400;
		this.canvas.height = 1500;
        this.context =  this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            keys[e.keyCode] = true;

            if (isTyping == false){
            	if (keys[13] == true){
					if (selected != null){
						mirrors[selected].numMirrors += 1;
						mirrors[selected].numMirrors %= 4;
						if (mirrors[selected].numMirrors == 3){
							mirrors[selected].numMirrors = -1;
						}
						if (rotationOnSelected == true){
							mirrors[selected].image.src = "rotateMirror" + String(mirrors[selected].numMirrors) + ".png";
						}
						else{
							mirrors[selected].image.src = "selectedMirror" + String(mirrors[selected].numMirrors) + ".png";
						}
					}
				}

				if (keys[37] == true){
					if (selected != null){
						if (selected != null && rotationOnSelected == false){
							mirrors[selected].x -= 0.25;
						}
						else{
							mirrors[selected].angle += 0.005;
						}
					}
					setText();
				}
				if (keys[39] == true){
					if (selected != null){
						if (selected != null && rotationOnSelected == false){
							mirrors[selected].x += 0.25;
						}
						else{
							mirrors[selected].angle -= 0.005;
						}
					}
					setText();
				}
				if (keys[38] == true){
					if (selected != null){
						if (rotationOnSelected == false){
							mirrors[selected].y -= 0.25;
						}
						else{
							mirrors[selected].angle -= 0.005;
						}
					}
					setText();
				}
				if (keys[40] == true){
					if (selected != null){
						if (rotationOnSelected == false){
							mirrors[selected].y += 0.25;
						}
						else{
							mirrors[selected].angle += 0.005;
						}
					}
					setText();
				}
            }
        })
        window.addEventListener('keyup', function (e) {
            keys[e.keyCode] = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

myGameArea.canvas.onmousedown = function(e){
	clicked = true;
	if (selected != null){
		mirrors[selected].image.src = "mirror" + String(mirrors[selected].numMirrors) + ".png";
		mirrors[selected].length *= 439.0 / 541.0;
		mirrors[selected].width *= 138.0 / 210.0;
		if (rotationOnSelected == true){
			mirrors[selected].angle = Math.atan(((e.y * 3) - mirrors[selected].y) / ((e.x * 3) - mirrors[selected].x));
			if (checkDirection(mirrors[selected].x, mirrors[selected].y, (e.x * 3), (e.y * 3), mirrors[selected].angle) == false){
				mirrors[selected].angle = Math.PI + mirrors[selected].angle;
			}
			mirrors[selected].angle = normalizeAngle360(mirrors[selected].angle);
		}
		else{
			selected = null;
		}
	}
	downOnSelected = false;

	var tempSelected = null;
	var minDist = 15000000000000000000.0;
	for (var i = 0; i < mirrors.length; i++){
		var dist = Math.pow(mirrors[i].x - (e.x * 3), 2.0) + Math.pow(mirrors[i].y - (e.y * 3), 2.0);
		if (dist <= Math.pow(mirrors[i].length * 0.5, 2.0)){
			if (dist < minDist){
				tempSelected = i;
				minDist = dist;
			}
		}
	}

	
	if (rotationOnSelected == true){
		if (selected == null && tempSelected != null){
			selected = tempSelected
			setText();
		}
		mirrors[selected].image.src = "rotateMirror" + String(mirrors[selected].numMirrors) + ".png";
		mirrors[selected].length *= 541.0 / 439.0;
		mirrors[selected].width *= 210.0 / 138.0;
		downOnSelected = true;
	}
	else{
		if (tempSelected != null){
			selected = tempSelected;
			setText();
			mirrors[selected].image.src = "selectedMirror" + String(mirrors[selected].numMirrors) + ".png";
			mirrors[selected].length *= 541.0 / 439.0;
			mirrors[selected].width *= 210.0 / 138.0;
			selectedXDelta = (e.x * 3) - mirrors[selected].x
			selectedYDelta = (e.y * 3) - mirrors[selected].y
			downOnSelected = true;
		}
	}
}

function setText(){
	xPosBox.value = String(Math.round((mirrors[selected].x - 10.0) * (56.0 / (myGameArea.canvas.width * 0.7)) * 100.0) / 100.0);
	yPosBox.value = String(Math.round(((10.0 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0)) - mirrors[selected].y) * (35.0 / (myGameArea.canvas.width * 0.7 * (5.0 / 8.0))) * 100.0) / 100.0);
	angleBox.value = String(Math.round((360.0 - (mirrors[selected].angle) * (180.0 / Math.PI)) * 100.0) / 100.0);
}

function finalizeScore(){
	var lastPoint = points[points.length - 1];
	score += Math.max(15.0 - ((Math.abs(lastPoint[1] - pointer.y) * (350.0 / (myGameArea.canvas.width * 0.7 * (5.0 / 8.0))) + Math.abs(lastPoint[0] - (myGameArea.canvas.width * 0.7 + 10.0)) * (560.0 / (myGameArea.canvas.width * 0.7))) / 10.0), 0.0);
}

myGameArea.canvas.onmouseup = function(e){
	downOnSelected = false;
	clicked = false;
}

myGameArea.canvas.onmousemove = function(e){
	if (selected != null && downOnSelected == true && clicked == true){
		if (rotationOnSelected == false){
			mirrors[selected].x = (e.x * 3) - selectedXDelta;
			mirrors[selected].y = (e.y * 3) - selectedYDelta;
		}
		else{
			mirrors[selected].angle = Math.atan(((e.y * 3) - mirrors[selected].y) / ((e.x * 3) - mirrors[selected].x));
			if (checkDirection(mirrors[selected].x, mirrors[selected].y, (e.x * 3), (e.y * 3), mirrors[selected].angle) == false){
				mirrors[selected].angle = Math.PI + mirrors[selected].angle;
			}
			mirrors[selected].angle = normalizeAngle360(mirrors[selected].angle);
		}
		setText();
	}
}

function Mirror(x, y, angle, length, numMirrors){
	this.angle = angle;
	this.x = x;
	this.y = y;
	this.length = length;
	this.width = 15;
	this.standardLength = this.length;
	this.standardWidth = this.width;
	this.numMirrors = numMirrors;

	this.image = new Image();
	this.image.src = "mirror" + String(this.numMirrors) + ".png";

	this.update = function(){
		myGameArea.context.save();
		myGameArea.context.translate(this.x, this.y);
		myGameArea.context.rotate(this.angle);
		myGameArea.context.drawImage(this.image, -this.length * 0.5, -this.width * 0.5, this.length, this.width);
		myGameArea.context.restore();
	}
}

function Pointer(y){
	this.length = 25;
	this.width = 20;
	this.x = 10 + myGameArea.canvas.width * 0.7 - this.length;
	this.y = y;

	this.image = new Image();
	this.image.src = "pointer.png";

	this.update = function(){
		myGameArea.context.save();
		myGameArea.context.drawImage(this.image, this.x, this.y, this.length, this.width);
		myGameArea.context.restore();
	}

	this.randomize = function(){
		this.y = Math.random() * (myGameArea.canvas.width * 0.7 * (5.0 / 8.0) - this.width) + 10.0;
	}
}

function calculatePoints(){
	var angles = [0.0];
	points = [[10, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0) * 0.5]];
	var lastMirrors = [-1];

	if (laserOn == false){
		return;
	}

	while (true){
		var laserPointX = points[points.length - 1][0];
		var laserPointY = points[points.length - 1][1];
		var laserAngle = angles[angles.length - 1];
		var laserSlope = Math.tan(laserAngle);

		var minDistance = 150000000000000000000.0;
		var collidesWith = null;
		var collisionX = null;
		var collisionY = null;
		var collisionSolid = false;

		for (var i = 0; i < mirrors.length; i++){
			if (i == lastMirrors[lastMirrors.length - 1]){
				continue;
			}

			var slopeMirror = Math.tan(mirrors[i].angle);
			var perpendicularSlope = -1.0 / slopeMirror;

			var point1Y = mirrors[i].standardWidth * 0.5 * Math.sin(mirrors[i].angle + Math.PI / 2.0) + mirrors[i].y;
			var point1X = mirrors[i].standardWidth * 0.5 * Math.cos(mirrors[i].angle + Math.PI / 2.0) + mirrors[i].x;

			var intersect1X = ((point1Y - slopeMirror * point1X) - (laserPointY - laserSlope * laserPointX)) / (laserSlope - slopeMirror);
			var intersect1Y = intersect1X * slopeMirror + point1Y - slopeMirror * point1X;

			if (checkDirection(laserPointX, laserPointY, intersect1X, intersect1Y, laserAngle)){
				var bound11 = mirrors[i].standardLength * 0.5 * Math.sin(mirrors[i].angle) + point1Y;
				var bound12 = -mirrors[i].standardLength * 0.5 * Math.sin(mirrors[i].angle) + point1Y;

				if (intersect1Y < Math.max(bound11, bound12) && intersect1Y > Math.min(bound11, bound12)){
					var distance1 = Math.sqrt(Math.pow(laserPointX - intersect1X, 2.0) + Math.pow(laserPointY - intersect1Y, 2.0));
					if (distance1 < minDistance){
						minDistance = distance1;
						collidesWith = i;
						collisionX = intersect1X;
						collisionY = intersect1Y;
						if (mirrors[i].numMirrors == 2){
							collisionSolid = false;
						}
						else{
							collisionSolid = true;
						}
					}
				}
			}

			var point2Y = -mirrors[i].standardWidth * 0.5 * Math.sin(mirrors[i].angle + Math.PI / 2.0) + mirrors[i].y;
			var point2X = -mirrors[i].standardWidth * 0.5 * Math.cos(mirrors[i].angle + Math.PI / 2.0) + mirrors[i].x;

			var intersect2X = ((point2Y - slopeMirror * point2X) - (laserPointY - laserSlope * laserPointX)) / (laserSlope - slopeMirror);
			var intersect2Y = intersect2X * slopeMirror + point2Y - slopeMirror * point2X;

			if (checkDirection(laserPointX, laserPointY, intersect2X, intersect2Y, laserAngle)){
				var bound21 = mirrors[i].standardLength * 0.5 * Math.sin(mirrors[i].angle) + point2Y;
				var bound22 = -mirrors[i].standardLength * 0.5 * Math.sin(mirrors[i].angle) + point2Y;

				if (intersect2Y < Math.max(bound21, bound22) && intersect2Y > Math.min(bound21, bound22)){
					var distance2 = Math.sqrt(Math.pow(laserPointX - intersect2X, 2.0) + Math.pow(laserPointY - intersect2Y, 2.0));

					if (distance2 < minDistance){
						minDistance = distance2;
						collidesWith = i;
						collisionX = intersect2X;
						collisionY = intersect2Y;
						if (mirrors[i].numMirrors == 2 || mirrors[i].numMirrors == 1 || mirrors[i].numMirrors == -1){
							collisionSolid = false;
						}
						else{
							collisionSolid = true;
						}
					}
				}
			}


			var point3Y = mirrors[i].standardLength * 0.5 * Math.sin(mirrors[i].angle) + mirrors[i].y;
			var point3X = mirrors[i].standardLength * 0.5 * Math.cos(mirrors[i].angle) + mirrors[i].x;

			var intersect3X = ((point3Y - perpendicularSlope * point3X) - (laserPointY - laserSlope * laserPointX)) / (laserSlope - perpendicularSlope);
			var intersect3Y = intersect3X * perpendicularSlope + point3Y - perpendicularSlope * point3X;

			if (checkDirection(laserPointX, laserPointY, intersect3X, intersect3Y, laserAngle)){
				var bound31 = mirrors[i].standardWidth * 0.5 * Math.sin(mirrors[i].angle + Math.PI / 2.0) + point3Y;
				var bound32 = -mirrors[i].standardWidth * 0.5 * Math.sin(mirrors[i].angle + Math.PI / 2.0) + point3Y;

				if (intersect3Y < Math.max(bound31, bound32) && intersect3Y > Math.min(bound31, bound32)){
					var distance3 = Math.sqrt(Math.pow(laserPointX - intersect3X, 2.0) + Math.pow(laserPointY - intersect3Y, 2.0));

					if (distance3 < minDistance){
						minDistance = distance3;
						collidesWith = i;
						collisionX = intersect3X;
						collisionY = intersect3Y;
						collisionSolid = true;
					}
				}
			}

			var point4Y = -mirrors[i].standardLength * 0.5 * Math.sin(mirrors[i].angle) + mirrors[i].y;
			var point4X = -mirrors[i].standardLength * 0.5 * Math.cos(mirrors[i].angle) + mirrors[i].x;

			var intersect4X = ((point4Y - perpendicularSlope * point4X) - (laserPointY - laserSlope * laserPointX)) / (laserSlope - perpendicularSlope);
			var intersect4Y = intersect4X * perpendicularSlope + point4Y - perpendicularSlope * point4X;

			if (checkDirection(laserPointX, laserPointY, intersect4X, intersect4Y, laserAngle)){
				var bound41 = mirrors[i].standardWidth * 0.5 * Math.sin(mirrors[i].angle + Math.PI / 2.0) + point4Y;
				var bound42 = -mirrors[i].standardWidth * 0.5 * Math.sin(mirrors[i].angle + Math.PI / 2.0) + point4Y;

				if (intersect4Y < Math.max(bound41, bound42) && intersect4Y > Math.min(bound41, bound42)){
					var distance4 = Math.sqrt(Math.pow(laserPointX - intersect4X, 2.0) + Math.pow(laserPointY - intersect4Y, 2.0));

					if (distance4 < minDistance){
						minDistance = distance4;
						collidesWith = i;
						collisionX = intersect4X;
						collisionY = intersect4Y;
						collisionSolid = true;
					}
				}
			}
		}

		var farWallY = laserSlope * ((myGameArea.canvas.width * 0.7 + 10.0) - laserPointX) + laserPointY;
		if (farWallY >= 10.0 && farWallY <= myGameArea.canvas.width * 0.7 * (5.0 / 8.0) + 10.0 && checkDirection(laserPointX, laserPointY, myGameArea.canvas.width * 0.7 + 10.0, farWallY, laserAngle)){
			var farWallDistance = Math.sqrt(Math.pow(laserPointY - farWallY, 2.0) + Math.pow(laserPointX - (myGameArea.canvas.width * 0.7 + 10.0), 2.0));
			if (farWallDistance < minDistance){
				points.push([myGameArea.canvas.width * 0.7 + 10.0, farWallY]);
				break;
			}
		}

		var nearWallY = laserSlope * (10.0 - laserPointX) + laserPointY;
		if (nearWallY >= 10.0 && nearWallY <= myGameArea.canvas.width * 0.7 * (5.0 / 8.0) + 10.0 && checkDirection(laserPointX, laserPointY, 10.0, nearWallY, laserAngle) && points.length != 1){
			var nearWallDistance = Math.sqrt(Math.pow(laserPointY - nearWallY, 2.0) + Math.pow(laserPointX - 10.0, 2.0));
			if (nearWallDistance < minDistance){
				points.push([10.0, nearWallY]);
				break;
			}		
		}

		var topWallX = (10 - laserPointY) / laserSlope + laserPointX;
		if (topWallX >= 0.0 && topWallX <= myGameArea.canvas.width * 0.7 + 10.0 && checkDirection(laserPointX, laserPointY, topWallX, 10.0, laserAngle)){
			var topWallDistance = Math.sqrt(Math.pow(laserPointY - 10.0, 2.0) + Math.pow(laserPointX - topWallX, 2.0));
			if (topWallDistance < minDistance){
				points.push([topWallX, 10.0]);
				break;
			}	
		}

		var bottomWallX = ((myGameArea.canvas.width * 0.7 * (5.0 / 8.0) + 10.0) - laserPointY) / laserSlope + laserPointX;
		if (bottomWallX >= 0.0 && bottomWallX <= myGameArea.canvas.width * 0.7 + 10.0 && checkDirection(laserPointX, laserPointY, bottomWallX, myGameArea.canvas.width * 0.7 * (5.0 / 8.0) + 10.0, laserAngle)){
			var bottomWallDistance = Math.sqrt(Math.pow(laserPointY - (myGameArea.canvas.width * 0.7 * (5.0 / 8.0) + 10.0), 2.0) + Math.pow(laserPointX - bottomWallX, 2.0));
			if (bottomWallDistance < minDistance){
				points.push([bottomWallX, myGameArea.canvas.width * 0.7 * (5.0 / 8.0) + 10.0]);
				break;
			}	
		}
		points.push([collisionX, collisionY]);

		if (collisionSolid){
			break;
		}

		var finalAngle;
		if (laserAngle > Math.PI / 2.0 && laserAngle <= Math.PI * (3.0 / 2.0)){
			finalAngle = normalizeAngle360(Math.PI - Math.atan(Math.tan(laserAngle)) + 2.0 * Math.atan(Math.tan(mirrors[collidesWith].angle)));
		}
		else{
			finalAngle = normalizeAngle360(-Math.atan(Math.tan(laserAngle)) + 2.0 * Math.atan(Math.tan(mirrors[collidesWith].angle)));
		}
		var loop = false;

		for (var i = 0; i < points.length; i++){
			if (points[i][0] == collisionX && points[i][1] == collisionY && angles[i] == finalAngle){
				loop = true;
				break;
			}
		}
		if (loop == true){
			break;
		}

		var alreadyHit = false;
		if (mirrors[collidesWith].numMirrors == 1 || mirrors[collidesWith].numMirrors == 2){
			for (var i = 0; i < lastMirrors.length; i++){
				if (collidesWith == lastMirrors[i]){
					alreadyHit = true;
					break;
				}
			}
			if (alreadyHit == false){
				score += 2.0;
			}
		}
		if (mirrors[collidesWith].numMirrors == -1){
			for (var i = 0; i < lastMirrors.length; i++){
				if (collidesWith == lastMirrors[i]){
					alreadyHit = true;
					break;
				}
			}
			if (alreadyHit == false){
				score += 5.0;
			}
		}

		angles.push(finalAngle);
		lastMirrors.push(collidesWith);
	}
}

function normalizeAngle360(angle){
	var normalized = angle % (Math.PI * 2.0);
	if (normalized < 0){
		normalized = Math.PI * 2.0 - Math.abs(normalized);
	}
	return normalized;
}
function normalizeAngle180(angle){
	var normalized = angle % Math.PI;
	if (normalized < 0){
		normalized = Math.PI - Math.abs(normalized);
	}
	return normalized;
}

function checkDirection(x1, y1, x2, y2, angle){
	var dist = Math.sqrt(Math.pow(x1 - x2, 2.0) + Math.pow(y1 - y2, 2.0));
	var x3 = dist * Math.cos(angle) + x1;
	var y3 = dist * Math.sin(angle) + y1;
	if (Math.abs(x3 - x2) <= 0.1 && Math.abs(y3 - y2) <= 0.1){
		return true;
	}
	return false;
}

function setGrid(){
	for (var i = 1; i < 56.0; i++){
		myGameArea.context.beginPath();
		myGameArea.context.lineWidth = "1";
		myGameArea.context.strokeStyle = "grey";
		myGameArea.context.moveTo((10 + myGameArea.canvas.width * 0.7) * (i / 56.0), 10.0);
		myGameArea.context.lineTo((10 + myGameArea.canvas.width * 0.7) * (i / 56.0), 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0));
		myGameArea.context.stroke();
	}

	for (var i = 1; i < 35.0; i++){
		myGameArea.context.beginPath();
		myGameArea.context.lineWidth = "1";
		myGameArea.context.strokeStyle = "grey";
		myGameArea.context.moveTo(10.0, (10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0)) * (i / 35.0));
		myGameArea.context.lineTo(10 + myGameArea.canvas.width * 0.7, (10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0)) * (i / 35.0));
		myGameArea.context.stroke();
	}
}

function updateGameArea() {
    myGameArea.clear();
    score = 0.0;
    keyActions();

    // myGameArea.canvas.width = window.innerWidth * 0.7;
    // myGameArea.canvas.height = window.innerHeight * 0.7;
	myGameArea.canvas.width = 2400;
	myGameArea.canvas.height = 1500;

    myGameArea.context.beginPath();
	myGameArea.context.lineWidth = "2";
	myGameArea.context.strokeStyle = "black";
	rectWidth = myGameArea.canvas.width * 0.7;
	rectHeight = myGameArea.canvas.width * 0.7 * (5.0 / 8.0);
	myGameArea.context.rect(10, 10, rectWidth, rectHeight);
	myGameArea.context.stroke();

	var A3Y = rectHeight / 350 * 279;
	myGameArea.context.beginPath();
	myGameArea.context.moveTo(10, A3Y + 10);
	myGameArea.context.lineTo(rectWidth + 10, A3Y + 10);
	myGameArea.context.strokeStyle = "green";
	myGameArea.context.stroke();

	var A3X = rectWidth / 560 * 432;
	myGameArea.context.beginPath();
	myGameArea.context.moveTo(A3X + 10, 10);
	myGameArea.context.lineTo(A3X + 10, rectHeight + 10);
	myGameArea.context.strokeStyle = "green";
	myGameArea.context.stroke();

	myGameArea.context.beginPath();
	myGameArea.context.lineWidth = "1";
	myGameArea.context.strokeStyle = "grey";
	myGameArea.context.setLineDash([15, 15]);
	myGameArea.context.moveTo(10, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0) * 0.5);
	myGameArea.context.lineTo(10 + myGameArea.canvas.width * 0.7, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0) * 0.5);
	myGameArea.context.stroke();
	myGameArea.context.setLineDash([]);

	myGameArea.context.beginPath();
	myGameArea.context.lineWidth = "1";
	myGameArea.context.strokeStyle = "blue";
	myGameArea.context.moveTo(10, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0) * 1/3);
	myGameArea.context.lineTo(10 + myGameArea.canvas.width * 0.7, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0) * 1/3);
	myGameArea.context.stroke();

	myGameArea.context.beginPath();
	myGameArea.context.lineWidth = "1";
	myGameArea.context.strokeStyle = "blue";
	myGameArea.context.moveTo(10, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0) * 2/3);
	myGameArea.context.lineTo(10 + myGameArea.canvas.width * 0.7, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0) * 2/3);
	myGameArea.context.stroke();

	myGameArea.context.beginPath();
	myGameArea.context.lineWidth = "1";
	myGameArea.context.strokeStyle = "blue";
	myGameArea.context.moveTo(10 + myGameArea.canvas.width * 0.7 * 1/3, 10);
	myGameArea.context.lineTo(10 + myGameArea.canvas.width * 0.7 * 1/3, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0));
	myGameArea.context.stroke();

	myGameArea.context.beginPath();
	myGameArea.context.lineWidth = "1";
	myGameArea.context.strokeStyle = "blue";
	myGameArea.context.moveTo(10 + myGameArea.canvas.width * 0.7 * 2/3, 10);
	myGameArea.context.lineTo(10 + myGameArea.canvas.width * 0.7 * 2/3, 10 + myGameArea.canvas.width * 0.7 * (5.0 / 8.0));
	myGameArea.context.stroke();

	if (showGrid){
		setGrid();
	}

	calculatePoints();

	myGameArea.context.beginPath();
	myGameArea.context.lineWidth = "4";
	myGameArea.context.strokeStyle = "red";
	myGameArea.context.moveTo(points[0][0], points[0][1]);
	for (var i = 1; i < points.length; i++){
		myGameArea.context.lineTo(points[i][0], points[i][1]);
		if (i == points.length - 1 && points[i][0] == myGameArea.canvas.width * 0.7 + 10){
			myGameArea.context.lineTo(A3X - 5, points[i][1]);
		}
	}
	myGameArea.context.stroke();

	for (var i = 0; i < mirrors.length; i++){
		mirrors[i].update();
	}

	pointer.update();
	finalizeScore();
	scoreLabel.innerText = "Score: " + String(Math.round(score * 100.0) / 100.0);
}

function exportPDF() {
    var canvas = document.querySelector("canvas");

	function simulateCanvasMouseDown(canvas, x, y) {
		var event = new MouseEvent('mousedown', {
			bubbles: true,
			cancelable: true,
			view: window,
			clientX: x,
			clientY: y
		});
		canvas.dispatchEvent(event);
	}
	simulateCanvasMouseDown(canvas, 2399, 1499);
	
	setTimeout(function() {
		var x = 10;
		var y = 10;
		var rectWidth = myGameArea.canvas.width * 0.7
		var rectHeight = myGameArea.canvas.width * 0.7 * (5.0 / 8.0);
		var width = rectWidth;
		var height = rectHeight;
		
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = width * 3;
		tempCanvas.height = height * 3;
		
		tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
		
		var dataURL = tempCanvas.toDataURL("image/png");

		var pdf = new jspdf.jsPDF(
			{
				orientation: 'landscape',
				unit: 'mm',
				format: [560, 350],
			}
		);

		pdf.addImage(dataURL, "PNG", 0, 0, width, height);

		pdf.save("canvas_to_pdf.pdf");
	}, 500);
}

function exportPNG() {
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");

	var x = 10;
	var y = 10;
	var rectWidth = myGameArea.canvas.width * 0.7
	var rectHeight = myGameArea.canvas.width * 0.7 * (5.0 / 8.0);
	var width = rectWidth;
	var height = rectHeight;
    
    var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
    
    var dataURL = tempCanvas.toDataURL("image/png");
    
    var link = document.createElement('a');
    link.href = dataURL;
    link.download = 'clipped_image.png';
    link.click();
}