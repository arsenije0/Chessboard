/*************************************************************************/

let table = document.getElementById("table");
let tableBtn = document.getElementById("table-btn");
let mainContainerOne = document.getElementById("main-container-one");
let menu = document.getElementById("menu");
let monitor = document.getElementById("monitor");
let clock = document.getElementById("clock");
let pointsMonitor = document.getElementById("points-monitor");

/*Audio Stuff*/
let wrongSound = document.getElementById("wrong-sound");
let correctSound = document.getElementById("correct-sound");
let startSound = document.getElementById("start-sound");
let timerSound = document.getElementById("timer-sound");
wrongSound.volume = 0.3;
correctSound.volume = 0.3;
timerSound.volume = 0.3;

/*Arrays containing data for the chessboard used for game.*/
let points = [];
let pointValues = [];

let white = true;
let lsElements = [];
let globalPoints = 0;
let str = "";

let boardLetter = ["a", "b", "c", "d", "e", "f", "g", "h"];
let colorsWood = ["rgb(238, 219, 179)", "rgb(181, 135, 99)"];
let colorsGreen = ["rgb(204, 215, 224)", "rgb(0, 128, 128)"];
let colorsBlue = ["rgb(204, 215, 224)", "rgb(24, 89, 143)"];
let colorsBlack = ["white", "black"];
/*tableOneColors are used in setFieldColor()*/
let tableOneColors = ["rgb(204, 215, 224)", "rgb(0, 128, 128)"];

/*************************************************************************/
/*"Routing"*/

/*Initial conditions*/
displayNone(idCatch("main-container-two"),menu, idCatch("introduction"));
displayBlock(mainContainerOne);

idCatch("to-intro").addEventListener("click", toIntroduction);
idCatch("back-three").addEventListener("click", fromIntroduction);

idCatch("to-game").addEventListener("click", toGameOne);
tableBtn.addEventListener("click", initiateGame);

idCatch("scores-btn").addEventListener("click", toScores);
idCatch("back-two").addEventListener("click", fromScores);

idCatch("back-one").addEventListener("click", () => {
	displayNone(idCatch("main-container-two"), menu);
	displayBlock(mainContainerOne);
	idCatch("score-div").innerHTML = "";
	idCatch("main-container-two").style.opacity = 0.2;
	tableBtn.innerHTML = "START";
});

let theEnd = false;
idCatch("cancel-btn").addEventListener("click", () => {
	theEnd = true;
	displayFlex(menu);
	tableBtn.innerHTML = "RETRY";
	monitor.innerHTML = "";
	clock.children[0].innerHTML = "0";
	pointsMonitor.children[0].innerHTML = "0";
	idCatch("score-div").innerHTML = "";
	globalPoints = 0;
	str = "";
	removeClickListeners();
	idCatch("main-container-two").style.opacity = 0.2;
});

function toGameOne() {
	displayNone(mainContainerOne);
	displayFlex(menu);
}

function toScores() {
	displayNone(idCatch("centered-content"));
	displayFlex(idCatch("top-scores-container"));
}

function fromScores() {
	displayFlex(idCatch("centered-content"));
	displayNone(idCatch("top-scores-container"));
}

function toIntroduction() {
	displayBlock(idCatch("introduction"));
	displayNone(mainContainerOne);
}

function fromIntroduction() {
	displayNone(idCatch("introduction"));
	displayBlock(mainContainerOne);
}

/*************************************************************************/
/*Board Building part*/

scoresBuilder(idCatch("top-scores-div"));
boardBuilder(points, true, table, colorsGreen);
valueGiver(white, pointValues);

let secondPoints = [];
let secondValues = [];
boardBuilder(secondPoints, true, idCatch("table-two"), colorsGreen);
valueGiver(true, secondValues);
makeHoverElements(secondPoints, secondValues);
makeSideElements(secondPoints, secondValues);

/*************************************************************************/
/*"Tutorial" Board Functionality*/

idCatch("board-side-btn").addEventListener("click", () => {
	if(idCatch("text-under").innerHTML == "CHANGE TO<br>WHITE SIDE") {
		flipTheBoard(true, false, secondPoints, secondValues);
		changeHoverElements();
		changeSideElements(secondPoints, secondValues);
		idCatch("text-under").innerHTML = "CHANGE TO<br>BLACK SIDE";
	} else if(idCatch("text-under").innerHTML == "CHANGE TO<br>BLACK SIDE") {
		flipTheBoard(false, false, secondPoints, secondValues);
		changeHoverElements();
		changeSideElements(secondPoints, secondValues);
		idCatch("text-under").innerHTML = "CHANGE TO<br>WHITE SIDE";
	}
});

changeBackground(idCatch("g-theme"), idCatch("themes-1"));
idCatch("w-theme").addEventListener("click", () => {
	let w = false;
	if(idCatch("left7").innerHTML == "1") {
		w = true;
	}
	changeTheme(w, secondPoints, colorsWood);
	changeHoverElements();
	changeBackground(idCatch("w-theme"), idCatch("themes-1"));
})

idCatch("g-theme").addEventListener("click", () => {
	let w = false;
	if(idCatch("left7").innerHTML == "1") {
		w = true;
	}
	changeTheme(w, secondPoints, colorsGreen);
	changeHoverElements();
	changeBackground(idCatch("g-theme"), idCatch("themes-1"));
})

idCatch("b-theme").addEventListener("click", () => {
	let w = false;
	if(idCatch("left7").innerHTML == "1") {
		w = true;
	}
	changeTheme(w, secondPoints, colorsBlue);
	changeHoverElements();
	changeBackground(idCatch("b-theme"), idCatch("themes-1"));
})

idCatch("bl-theme").addEventListener("click", () => {
	let w = false;
	if(idCatch("left7").innerHTML == "1") {
		w = true;
	}
	changeTheme(w, secondPoints, colorsBlack);
	changeHoverElements();
	changeBackground(idCatch("bl-theme"), idCatch("themes-1"));
})

/*************************************************************************/
/*Themes for game board*/

changeBackground(idCatch("w-theme-2"), idCatch("themes-2"));
idCatch("w-theme-2").addEventListener("click", () => {
	changeTheme(white, points, colorsWood);
	tableOneColors = [...colorsWood];
	changeBackground(idCatch("w-theme-2"), idCatch("themes-2"));
})

idCatch("g-theme-2").addEventListener("click", () => {
	changeTheme(white, points, colorsGreen);
	tableOneColors = [...colorsGreen];
	changeBackground(idCatch("g-theme-2"), idCatch("themes-2"));
})

idCatch("b-theme-2").addEventListener("click", () => {
	changeTheme(white, points, colorsBlue);
	tableOneColors = [...colorsBlue];
	changeBackground(idCatch("b-theme-2"), idCatch("themes-2"));
})

idCatch("bl-theme-2").addEventListener("click", () => {
	changeTheme(white, points, colorsBlack);
	tableOneColors = [...colorsBlack];
	changeBackground(idCatch("bl-theme-2"), idCatch("themes-2"));
})

function changeBackground(x, parent) {
	for(let i = 0; i < parent.children.length; i++) {
		if(x.innerHTML == parent.children.item(i).children.item(1).innerHTML) {
			parent.children.item(i).style.backgroundColor = "#1e2838";
		} else {
			parent.children.item(i).style.backgroundColor = "rgb(14, 19, 27)";
		}
	}
}

/*************************************************************************/
/*These functions are instrumental in game section.*/

/*A function that creates a chessboard.*/
function boardBuilder(arr, w, parent, colors) {
	let startingColor = 1;
	if(w) {
		startingColor = 0;
	}
	for(let i = 0; i < 8; i++) {
		arr[i] = new Array();
		temp = createElement("div", parent);
		temp.setAttribute("class", "row");
		temp.setAttribute("id", "row" + i + parent.id);
		let start = startingColor;

		for(let j = 0; j < 8; j++) {
			arr[i][j] = createElement("div", temp);
			arr[i][j].setAttribute("class", "field");
			if(j > 0) {
				if(start == 0) {
					arr[i][j].style.backgroundColor = colors[1];
					start = 1;
				} else {
					arr[i][j].style.backgroundColor = colors[0];
					start = 0;
				}
			} else {
				arr[i][j].style.backgroundColor = colors[startingColor];
			}
		}

		if(startingColor == 0) {
			startingColor = 1
		} else {
			startingColor = 0;
		}
	}
}

/*A function that starts the game.*/
function initiateGame() {
	theEnd = false;

	let tempBool = true;
	if(Math.round(Math.random()) == 0) {
		tempBool = false;
	}
	if(tempBool != white) {
		flipTheBoard(tempBool, true, points, pointValues);
	}
	if(tempBool) {
		idCatch("board-color").style.color = "black";
		idCatch("board-color").style.backgroundColor = "white";
		idCatch("board-color").innerHTML = "WHITE";
	} else {
		idCatch("board-color").style.color = "white";
		idCatch("board-color").style.backgroundColor = "black";
		idCatch("board-color").innerHTML = "BLACK";
	}

	startSound.currentTime = 0;
	startSound.play();
	displayNone(menu);
	idCatch("main-container-two").style.opacity = 1;
	displayFlex(idCatch("main-container-two"));
	globalPoints = 0;
	clock.style.color = "#5c66f2";
	let time = 0;
	let m = setInterval(go, 1000);

	function go() {
		if(theEnd == false) {
			if(time == 30) {
				addToStorage(globalPoints);
				deleteScores();
				scoresBuilder(idCatch("top-scores-div"));
				let c = findScore(lsElements, globalPoints);
				if(c != -1) {
					lsElements[c].style.backgroundColor = "#293d96";
				}
				displayFlex(menu);
				tableBtn.innerHTML = "RETRY";
				monitor.innerHTML = "";
				clock.children[0].innerHTML = "0";
				pointsMonitor.children[0].innerHTML = "";
				idCatch("score-div").innerHTML = "YOUR SCORE:<br>" + "<span class='bigger'>"
					+ globalPoints + "</span>";
				globalPoints = 0;
				str = "";
				removeClickListeners();
				idCatch("main-container-two").style.opacity = 0.2;
				clearInterval(m);
			} else {
				time++;
				clock.children[0].innerHTML = time;
				if(time > 20) {
					timerSound.currentTime = 0;
					timerSound.play();
					clock.style.color = "red";
					clock.style.borderColor = "red";
					setTimeout(() => {
						clock.style.color = "#5c66f2";
						clock.style.borderColor = "#171e4d";
					}, 500);
				}
			}
		} else {
			clearInterval(m);
		}
	}
	findThisSquare();
}

/*A function that assingns events to squres, and it changes the global var "str",
which is used for storing the sqaure name the player needs to find.*/
function findThisSquare() {
	str = boardLetter[Math.round(Math.random()*7)] + (Math.round(Math.random()*7) + 1);
	monitor.innerHTML = "Find " + str;
	for(let i = 0; i < 8; i++) {
		for(let j = 0; j < 8; j++) {
			let p = points[i][j];
			points[i][j].addEventListener("click", fieldClickEvent);
		}
	}
}

/*A function that details what happens when the square is clicked.*/
function fieldClickEvent() {
	let a = findCooridinates(event.target);
	if(str == pointValues[a[0]][a[1]]) {
		correctSound.currentTime = 0;
		event.target.style.backgroundColor = "#12b552";
		globalPoints++;
		pointsMonitor.children[0].innerHTML = globalPoints;
		str = boardLetter[Math.round(Math.random()*7)] + (Math.round(Math.random()*7) + 1);
		monitor.innerHTML = "Find " + str;
		let c = event.target;
		setTimeout(() => {
			setFieldColor(c);
		}, 500);
		correctSound.play();
	} else {
		wrongSound.currentTime = 0;
		event.target.style.backgroundColor = "red";
		globalPoints--;
		pointsMonitor.children[0].innerHTML = globalPoints;
		wrongSound.play();
		let c = event.target;
		setTimeout(() => {
			setFieldColor(c);
		}, 500);
		
	}
}

/*A function used in animation for when the square is clicked. Its job is to
restore square color to its previous value.*/
function setFieldColor(x) {
	for(let i = 0; i < 8; i++) {
		let boo = false;
		for(let j = 0; j < 8; j++) {
			let p = pointValues[i][j];
			let c = findCooridinates(x);
			if(p == pointValues[c[0]][c[1]]) {

				boo = true;
				let str1 = "";
				let str2 = "";

				if(white) {
					str1 = tableOneColors[0];
					str2 = tableOneColors[1];
				} else {
					str1 = tableOneColors[1];
					str2 = tableOneColors[0];
				}

				if((j + 1)%2 == 0) {
					if((i + 1)%2) {
						x.style.backgroundColor = str2;
					} else {
						x.style.backgroundColor = str1;
					}
				} else if((j + 1)%2 != 0){
					if((i + 1)%2) {
						x.style.backgroundColor = str1;
					} else {
						x.style.backgroundColor = str2;
					}
				}

				break;
			}
		}
		if(boo) {
			break;
		}
	}
}

/*Given the element as input, it returns its position in our 2D array.*/
function findCooridinates(x) {
	let parent = x.parentElement;
	let a = [];
	a[0] = parseInt(parent.id.split("")[3]);

	for(let i = 0; i < parent.childNodes.length; i++) {
		if(x == parent.childNodes[i]) {
			a[1] = i;
			break;
		}
	}
	return a;
}

function removeClickListeners() {
	for(let i = 0; i < 8; i++) {
		for(let j = 0; j < 8; j++) {
			points[i][j].removeEventListener("click", fieldClickEvent);
		}
	}
}


/*************************************************************************/
/*A function that changes sides of the board, black or white, and it
has an option to change global var "white", which stores the current side
of the game board.*/
function flipTheBoard(w, changeWhite, pointsArr, valuesArr) {
	if(changeWhite == true) {
		white = w;
	}
	colorFlip(pointsArr);
	valuesArr.length = 0;
	for(let i = 0; i < 8; i++){
		valuesArr[i] = new Array();
	}
	valueGiver(w, valuesArr);
}

function valueGiver(w, arr) {
	if(w) {
		for(let i = 0; i < 8; i++) {
			arr[i] = new Array();
			for(let j = 0; j < 8; j++) {
				arr[i][j] =  boardLetter[j] + parseInt(8 - i);
			}
		}
	} else {
		for(let i = 0; i < 8; i++) {
			arr[i] = new Array();
			for(let j = 0; j < 8; j++) {
				arr[i][j] = boardLetter[7 - j] + parseInt(i + 1);
			}
		}
	}
}

function colorFlip(arr) {

	for(let i = 0; i < 8; i++) {
		for(let j = 0; j < 8; j++) {
			if(j == 0){
				let temp = arr[i][j].style.backgroundColor;
				arr[i][j].style.backgroundColor = arr[i][j + 1].style.backgroundColor;
				arr[i][j + 1].style.backgroundColor = temp;
			} else if(j > 1) {
				arr[i][j].style.backgroundColor = arr[i][j - 2].style.backgroundColor;
			}
		}
	}
}

/*A function that changes board colors*/
function changeTheme(w, arr, col) {

	let counter = 0;
	if(w == false) {
		counter = 1;
	}
	for(let j = 0; j < 8; j++) {
		for(let i = 0; i < 8; i++) {
			arr[i][j].style.backgroundColor = col[counter];
			counter++;
			if(counter == 2) {
				counter = 0;
			}
		}
		if(counter == 0) {
			counter = 1;
		} else {
			counter = 0;
		}
	}
}


/*************************************************************************/
/*These next functions create additional elements and functionality for
the non-game board, located in tutorial section.*/


function makeHoverElements(arr, valuesArr) {
	for(let i = 0; i < 8; i++) {
		for(let j = 0; j < 8; j++) {
			let temp = createElement("div", arr[i][j]);
			temp.setAttribute("class", "hoverboard");
			temp.innerHTML = valuesArr[i][j];
			temp.setAttribute("id", "h" + i + "and" + j);
			if(j > 0) {
				temp.style.color = arr[i][j - 1].style.backgroundColor;
			} else {
				temp.style.color = arr[i][j + 1].style.backgroundColor;
			}
		}
	}
}

function changeHoverElements() {
	for(let i = 0; i < 8; i++) {
		for(let j = 0; j < 8; j++) {
			idCatch("h" + i + "and" + j).innerHTML = secondValues[i][j];
			if(j > 0) {
				idCatch("h" + i + "and" + j).style.color = secondPoints[i][j - 1].style.backgroundColor;
			} else {
				idCatch("h" + i + "and" + j).style.color = secondPoints[i][j + 1].style.backgroundColor;
			}
		}
	}
}

function makeSideElements(arrPoints, arrValues) {
	for(let i = 0; i < 8; i++) {
		let temp = createElement("div", arrPoints[i][0].parentElement);
		temp.style.position = "absolute";
		temp.style.color = "white";
		temp.innerHTML = arrValues[i][0].split("")[1];
		temp.style.top = "50%";
		temp.style.transform = "translateY(-50%)";
		temp.style.left = "-5%";
		temp.style.fontWeight = "bold";
		temp.style.fontSize = "11px";
		temp.setAttribute("id", "left" + i);
		temp.style.zIndex = 1000;
	}
	for(let i = 0; i < 8; i++) {
		let temp = createElement("div", arrPoints[7][i].parentElement);
		temp.style.position = "absolute";
		temp.style.color = "white";
		temp.innerHTML = arrValues[7][i].split("")[0];
		temp.style.left = 6.25*(i*2 + 1) + "%";
		temp.style.transform = "translateX(-50%)";
		temp.style.bottom = "-50%";
		temp.style.fontWeight = "bold";
		temp.style.fontSize = "11px";
		temp.setAttribute("id", "bottom" + i);
		temp.style.zIndex = 1000;
	}

}

function changeSideElements(arrPoints, arrValues) {
	for(let i = 0; i < 8; i++) {
		idCatch("left" + i).innerHTML = arrValues[i][0].split("")[1];
	}
	for(let i = 0; i < 8; i++) {
		idCatch("bottom" + i).innerHTML = arrValues[7][i].split("")[0];
	}
}


/*************************************************************************/
/*Local storage and scores handling*/

function addToStorage(data) {
	let temp = [];
	for(let i = 0; i < localStorage.length; i++) {
        temp[i] = parseInt(localStorage.getItem(i));
    }
 	temp[localStorage.length] = data;
    let a = sortArr(temp);

    if(localStorage.length == 0) {
    	localStorage.setItem(0, a[0]);
    } else {
    	let limit = 0;
    	if(localStorage.length == 10) {
    		a.pop();
    		limit = localStorage.length;
    	} else {
    		limit = localStorage.length + 1;
    	}
	    for(let i = 0; i < limit; i++) {
	    	localStorage.setItem(i, a[i]);
	    }
	}
}

function scoresBuilder(mainParent) {
	if(localStorage.length == 0) {
		let parent = createElement("h1", mainParent);
		let element = createElement("h1", parent);
		element.innerHTML = "TOP SCORES";
		let element2 = createElement("p", parent);
		element2.style.fontSize = "20px";
		element2.innerHTML = "No scores yet...";
		element2.style.textAlign = "center";
	} else {
		let parent = createElement("h1", mainParent);
		let title = createElement("h1", parent);
		title.innerHTML = "TOP SCORES";
		for(let i = 0; i < 10; i++) {
			let parent2 = createElement("div", parent);
			lsElements.push(parent2);
			parent2.setAttribute("class", "fx");
			parent2.style.borderLeft = "3px solid teal";
			parent2.style.borderRight = "3px solid teal";
			let element = createElement("p", parent2);
			element.innerHTML = (i + 1) + ".";
			element.style.width = "15%";
			element.style.margin = "5px 0 5px 0";
			element.style.paddingRight = "10px";
			element.style.fontWeight = "bold";
			element.style.fontSize = "11px";
			element.style.textAlign = "center";
			element.style.color = "#1d3b6b";
			let element2 = createElement("p", parent2);
			element2.style.width = "30px";
			element2.innerHTML = localStorage.getItem(i + 1);
			element2.style.margin = "5px 0 5px 0";
			element2.style.fontWeight = "bold";
			element2.style.fontSize = "17px";
			element2.style.textAlign = "center";
			element2.style.width = "85%";
			element2.style.color = "#03a8a8";
		}
	}
}

function deleteScores() {
	idCatch("top-scores-div").removeChild(idCatch("top-scores-div").children[0]);
	lsElements.length = 0;
}

function findScore(a, num) {
    let index = -1;
    for (let i = 0; i < a.length; i++) { 
        if (i < a.length - 1) {
            if ((num == parseInt(a[i].children[1].innerHTML)) 
            	&& (num != parseInt(a[i+1].children[1].innerHTML))) {
                index = i;
            }
        } else if (num == parseInt(a[a.length - 1].children[1].innerHTML)){
            index = a.length - 1;
        }
    }
    return index;
}

function sortArr(a) {
    for (let i = 0; i < a.length; i++) {
        let min = a[i];
        let index = i;
        for (let j = i; j < a.length; j++) {
            if (a[j] > min) {
                min = a[j];
                index = j;
            }
        }
        if (a[i] != min) {
            let temp = a[i];
            a[i] = a[index];
            a[index] = temp;
        }
    }
    return a;
}

/*************************************************************************/

function rgbColorSplitter(str) {
	let s = str.split(",");
	let a = [];
	a[0] = parseInt(s[0].split("(")[1]);
	a[1] = parseInt(s[1]);
	a[2] = parseInt(s[2].split(")")[0]);
	return a;
}

function createElement(el, parentId) {
    let element = document.createElement(el);
    parentId.appendChild(element);
    return element;
}

function idCatch(id) {
    return document.getElementById(id);
}

/*Display functions*/
function displayNone(...arg){
    for(let i = 0; i < arg.length; i++){
        arg[i].style.display = "none";
    }
}

function displayBlock(...arg){
    for(let i = 0; i < arg.length; i++){
        arg[i].style.display = "block";
    }
}

function displayFlex(...arg){
    for(let i = 0; i < arg.length; i++){
        arg[i].style.display = "flex";
    }
}