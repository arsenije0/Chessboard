/*************************************************************************/
/* Small helpers (declared first, but hoisted so they can be used above) */

function idCatch(id) {
	return document.getElementById(id);
}

function createElement(el, parent) {
	const element = document.createElement(el);
	parent.appendChild(element);
	return element;
}

function displayNone(...args) {
	for (let i = 0; i < args.length; i++) {
		args[i].style.display = "none";
	}
}

function displayBlock(...args) {
	for (let i = 0; i < args.length; i++) {
		args[i].style.display = "block";
	}
}

function displayFlex(...args) {
	for (let i = 0; i < args.length; i++) {
		args[i].style.display = "flex";
	}
}

/*************************************************************************/
/* Element references */

const table = idCatch("table");
const tableBtn = idCatch("table-btn");
const mainContainerOne = idCatch("main-container-one");
const menu = idCatch("menu");
const monitor = idCatch("monitor");
const clock = idCatch("clock");
const pointsMonitor = idCatch("points-monitor");

/* Audio */
const wrongSound = idCatch("wrong-sound");
const correctSound = idCatch("correct-sound");
const startSound = idCatch("start-sound");
const timerSound = idCatch("timer-sound");
wrongSound.volume = 0.3;
correctSound.volume = 0.3;
timerSound.volume = 0.3;

/*************************************************************************/
/* Constants */

const boardLetter = ["a", "b", "c", "d", "e", "f", "g", "h"];
const colorsWood = ["rgb(238, 219, 179)", "rgb(181, 135, 99)"];
const colorsGreen = ["rgb(204, 215, 224)", "rgb(0, 128, 128)"];
const colorsBlue = ["rgb(204, 215, 224)", "rgb(24, 89, 143)"];
const colorsBlack = ["white", "black"];

const GAME_DURATION = 30;
const SCORES_KEY = "topScores";
const MAX_SCORES = 10;

/*************************************************************************/
/* Single source of truth for mutable state. Logic reads from this
   object instead of inferring state from rendered DOM text. */

const state = {
	/* Game board */
	white: true,
	score: 0,
	target: "",
	gameOver: false,
	gameColors: [...colorsGreen],
	points: [],       /* 2D array of game-board square elements */
	pointValues: [],  /* 2D array of the coordinate name of each square */

	/* Tutorial board */
	tutorialWhite: true,
	tutorialPoints: [],
	tutorialValues: [],
};

/* DOM references for the currently rendered leaderboard rows. */
let scoreRows = [];

/*************************************************************************/
/* "Routing" */

/* Initial conditions */
displayNone(idCatch("main-container-two"), menu, idCatch("introduction"));
displayFlex(mainContainerOne);

idCatch("to-intro").addEventListener("click", toIntroduction);
idCatch("back-three").addEventListener("click", fromIntroduction);

idCatch("to-game").addEventListener("click", toGameOne);
tableBtn.addEventListener("click", initiateGame);

idCatch("scores-btn").addEventListener("click", toScores);
idCatch("back-two").addEventListener("click", fromScores);

idCatch("back-one").addEventListener("click", () => {
	displayNone(idCatch("main-container-two"), menu);
	displayFlex(mainContainerOne);
	idCatch("score-div").innerHTML = "";
	idCatch("main-container-two").style.opacity = 0.2;
	tableBtn.innerHTML = "START";
});

idCatch("cancel-btn").addEventListener("click", () => {
	state.gameOver = true;
	displayFlex(menu);
	tableBtn.innerHTML = "RETRY";
	monitor.innerHTML = "";
	clock.children[0].innerHTML = "0";
	pointsMonitor.children[0].innerHTML = "0";
	idCatch("score-div").innerHTML = "";
	state.score = 0;
	state.target = "";
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
	displayFlex(mainContainerOne);
}

/*************************************************************************/
/* Board building part */

renderScores(idCatch("top-scores-div"));
boardBuilder(state.points, true, table, colorsGreen);
valueGiver(state.white, state.pointValues);

boardBuilder(state.tutorialPoints, true, idCatch("table-two"), colorsGreen);
valueGiver(true, state.tutorialValues);
makeHoverElements(state.tutorialPoints, state.tutorialValues);
makeSideElements(state.tutorialPoints, state.tutorialValues);

/*************************************************************************/
/* Tutorial board functionality */

idCatch("board-side-btn").addEventListener("click", () => {
	if (state.tutorialWhite) {
		flipTheBoard(false, false, state.tutorialPoints, state.tutorialValues);
		state.tutorialWhite = false;
		idCatch("text-under").innerHTML = "CHANGE TO<br>WHITE SIDE";
	} else {
		flipTheBoard(true, false, state.tutorialPoints, state.tutorialValues);
		state.tutorialWhite = true;
		idCatch("text-under").innerHTML = "CHANGE TO<br>BLACK SIDE";
	}
	changeHoverElements();
	changeSideElements(state.tutorialPoints, state.tutorialValues);
});

changeBackground(idCatch("g-theme"), idCatch("themes-1"));
idCatch("w-theme").addEventListener("click", () => {
	changeTheme(state.tutorialWhite, state.tutorialPoints, colorsWood);
	changeHoverElements();
	changeBackground(idCatch("w-theme"), idCatch("themes-1"));
});

idCatch("g-theme").addEventListener("click", () => {
	changeTheme(state.tutorialWhite, state.tutorialPoints, colorsGreen);
	changeHoverElements();
	changeBackground(idCatch("g-theme"), idCatch("themes-1"));
});

idCatch("b-theme").addEventListener("click", () => {
	changeTheme(state.tutorialWhite, state.tutorialPoints, colorsBlue);
	changeHoverElements();
	changeBackground(idCatch("b-theme"), idCatch("themes-1"));
});

idCatch("bl-theme").addEventListener("click", () => {
	changeTheme(state.tutorialWhite, state.tutorialPoints, colorsBlack);
	changeHoverElements();
	changeBackground(idCatch("bl-theme"), idCatch("themes-1"));
});

/*************************************************************************/
/* Themes for the game board */

changeBackground(idCatch("w-theme-2"), idCatch("themes-2"));
idCatch("w-theme-2").addEventListener("click", () => {
	changeTheme(state.white, state.points, colorsWood);
	state.gameColors = [...colorsWood];
	changeBackground(idCatch("w-theme-2"), idCatch("themes-2"));
});

idCatch("g-theme-2").addEventListener("click", () => {
	changeTheme(state.white, state.points, colorsGreen);
	state.gameColors = [...colorsGreen];
	changeBackground(idCatch("g-theme-2"), idCatch("themes-2"));
});

idCatch("b-theme-2").addEventListener("click", () => {
	changeTheme(state.white, state.points, colorsBlue);
	state.gameColors = [...colorsBlue];
	changeBackground(idCatch("b-theme-2"), idCatch("themes-2"));
});

idCatch("bl-theme-2").addEventListener("click", () => {
	changeTheme(state.white, state.points, colorsBlack);
	state.gameColors = [...colorsBlack];
	changeBackground(idCatch("bl-theme-2"), idCatch("themes-2"));
});

function changeBackground(x, parent) {
	for (let i = 0; i < parent.children.length; i++) {
		if (x.innerHTML == parent.children.item(i).children.item(1).innerHTML) {
			parent.children.item(i).style.backgroundColor = "#1e2838";
		} else {
			parent.children.item(i).style.backgroundColor = "rgb(14, 19, 27)";
		}
	}
}

/*************************************************************************/
/* Core board helpers */

/* Creates a chessboard inside "parent" and fills "arr" with the squares. */
function boardBuilder(arr, w, parent, colors) {
	let startingColor = w ? 0 : 1;
	for (let i = 0; i < 8; i++) {
		arr[i] = [];
		const row = createElement("div", parent);
		row.setAttribute("class", "row");
		row.setAttribute("id", "row" + i + parent.id);
		row.dataset.row = i;
		let start = startingColor;

		for (let j = 0; j < 8; j++) {
			arr[i][j] = createElement("div", row);
			arr[i][j].setAttribute("class", "field");
			arr[i][j].dataset.col = j;
			if (j > 0) {
				if (start == 0) {
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

		startingColor = startingColor == 0 ? 1 : 0;
	}
}

/* Returns a random square name such as "g7". */
function pickTarget() {
	return boardLetter[Math.round(Math.random() * 7)] + (Math.round(Math.random() * 7) + 1);
}

/* Starts a round. */
function initiateGame() {
	state.gameOver = false;

	const side = Math.round(Math.random()) === 1;
	if (side !== state.white) {
		flipTheBoard(side, true, state.points, state.pointValues);
	}
	if (side) {
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
	state.score = 0;
	clock.style.color = "#5c66f2";
	let time = 0;
	const m = setInterval(go, 1000);

	function go() {
		if (state.gameOver) {
			clearInterval(m);
			return;
		}
		if (time === GAME_DURATION) {
			addScore(state.score);
			renderScores(idCatch("top-scores-div"));
			highlightScore(state.score);
			displayFlex(menu);
			tableBtn.innerHTML = "RETRY";
			monitor.innerHTML = "";
			clock.children[0].innerHTML = "0";
			pointsMonitor.children[0].innerHTML = "";
			idCatch("score-div").innerHTML = "YOUR SCORE:<br>" +
				"<span class='bigger'>" + state.score + "</span>";
			state.score = 0;
			state.target = "";
			removeClickListeners();
			idCatch("main-container-two").style.opacity = 0.2;
			clearInterval(m);
		} else {
			time++;
			clock.children[0].innerHTML = time;
			if (time > 20) {
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
	}

	findThisSquare();
}

/* Picks the next target square and wires click handlers on the board. */
function findThisSquare() {
	state.target = pickTarget();
	monitor.innerHTML = "Find " + state.target;
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			state.points[i][j].addEventListener("click", fieldClickEvent);
		}
	}
}

/* What happens when a square is clicked. */
function fieldClickEvent(e) {
	const a = findCoordinates(e.target);
	const clicked = e.target;
	if (state.target === state.pointValues[a[0]][a[1]]) {
		correctSound.currentTime = 0;
		clicked.style.backgroundColor = "#12b552";
		state.score++;
		pointsMonitor.children[0].innerHTML = state.score;
		state.target = pickTarget();
		monitor.innerHTML = "Find " + state.target;
		setTimeout(() => setFieldColor(clicked), 500);
		correctSound.play();
	} else {
		wrongSound.currentTime = 0;
		clicked.style.backgroundColor = "red";
		state.score--;
		pointsMonitor.children[0].innerHTML = state.score;
		wrongSound.play();
		setTimeout(() => setFieldColor(clicked), 500);
	}
}

/* Restores a square to its correct theme color after the click flash. */
function setFieldColor(x) {
	const [i, j] = findCoordinates(x);
	const light = state.white ? state.gameColors[0] : state.gameColors[1];
	const dark = state.white ? state.gameColors[1] : state.gameColors[0];

	if ((j + 1) % 2 === 0) {
		x.style.backgroundColor = (i + 1) % 2 ? dark : light;
	} else {
		x.style.backgroundColor = (i + 1) % 2 ? light : dark;
	}
}

/* Returns the [row, col] of a square element using data attributes. */
function findCoordinates(x) {
	return [
		parseInt(x.parentElement.dataset.row, 10),
		parseInt(x.dataset.col, 10),
	];
}

function removeClickListeners() {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			state.points[i][j].removeEventListener("click", fieldClickEvent);
		}
	}
}

/*************************************************************************/
/* Board orientation and themes */

/* Flips the board between white and black sides. When changeWhite is true
   it also updates the game side stored in state. */
function flipTheBoard(w, changeWhite, pointsArr, valuesArr) {
	if (changeWhite) {
		state.white = w;
	}
	colorFlip(pointsArr);
	valuesArr.length = 0;
	for (let i = 0; i < 8; i++) {
		valuesArr[i] = [];
	}
	valueGiver(w, valuesArr);
}

function valueGiver(w, arr) {
	if (w) {
		for (let i = 0; i < 8; i++) {
			arr[i] = [];
			for (let j = 0; j < 8; j++) {
				arr[i][j] = boardLetter[j] + parseInt(8 - i);
			}
		}
	} else {
		for (let i = 0; i < 8; i++) {
			arr[i] = [];
			for (let j = 0; j < 8; j++) {
				arr[i][j] = boardLetter[7 - j] + parseInt(i + 1);
			}
		}
	}
}

function colorFlip(arr) {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if (j == 0) {
				const temp = arr[i][j].style.backgroundColor;
				arr[i][j].style.backgroundColor = arr[i][j + 1].style.backgroundColor;
				arr[i][j + 1].style.backgroundColor = temp;
			} else if (j > 1) {
				arr[i][j].style.backgroundColor = arr[i][j - 2].style.backgroundColor;
			}
		}
	}
}

function changeTheme(w, arr, col) {
	let counter = w ? 0 : 1;
	for (let j = 0; j < 8; j++) {
		for (let i = 0; i < 8; i++) {
			arr[i][j].style.backgroundColor = col[counter];
			counter++;
			if (counter == 2) {
				counter = 0;
			}
		}
		counter = counter == 0 ? 1 : 0;
	}
}

/*************************************************************************/
/* Extra elements for the tutorial (non-game) board */

function makeHoverElements(arr, valuesArr) {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const temp = createElement("div", arr[i][j]);
			temp.setAttribute("class", "hoverboard");
			temp.innerHTML = valuesArr[i][j];
			temp.setAttribute("id", "h" + i + "and" + j);
			if (j > 0) {
				temp.style.color = arr[i][j - 1].style.backgroundColor;
			} else {
				temp.style.color = arr[i][j + 1].style.backgroundColor;
			}
		}
	}
}

function changeHoverElements() {
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			idCatch("h" + i + "and" + j).innerHTML = state.tutorialValues[i][j];
			if (j > 0) {
				idCatch("h" + i + "and" + j).style.color = state.tutorialPoints[i][j - 1].style.backgroundColor;
			} else {
				idCatch("h" + i + "and" + j).style.color = state.tutorialPoints[i][j + 1].style.backgroundColor;
			}
		}
	}
}

function makeSideElements(arrPoints, arrValues) {
	for (let i = 0; i < 8; i++) {
		const temp = createElement("div", arrPoints[i][0].parentElement);
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
	for (let i = 0; i < 8; i++) {
		const temp = createElement("div", arrPoints[7][i].parentElement);
		temp.style.position = "absolute";
		temp.style.color = "white";
		temp.innerHTML = arrValues[7][i].split("")[0];
		temp.style.left = 6.25 * (i * 2 + 1) + "%";
		temp.style.transform = "translateX(-50%)";
		temp.style.bottom = "-50%";
		temp.style.fontWeight = "bold";
		temp.style.fontSize = "11px";
		temp.setAttribute("id", "bottom" + i);
		temp.style.zIndex = 1000;
	}
}

function changeSideElements(arrPoints, arrValues) {
	for (let i = 0; i < 8; i++) {
		idCatch("left" + i).innerHTML = arrValues[i][0].split("")[1];
	}
	for (let i = 0; i < 8; i++) {
		idCatch("bottom" + i).innerHTML = arrValues[7][i].split("")[0];
	}
}

/*************************************************************************/
/* Local storage and scores handling.

   Scores are stored as a single JSON array under one key, sorted in
   descending order and capped at MAX_SCORES. This replaces the previous
   per-index storage, which had an off-by-one that hid the top score and
   rendered empty rows. */

function getScores() {
	try {
		const raw = localStorage.getItem(SCORES_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch (err) {
		return [];
	}
}

function addScore(score) {
	const scores = getScores();
	scores.push(score);
	scores.sort((a, b) => b - a);
	if (scores.length > MAX_SCORES) {
		scores.length = MAX_SCORES;
	}
	localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

function renderScores(mainParent) {
	mainParent.innerHTML = "";
	scoreRows = [];

	const scores = getScores();
	const container = createElement("h1", mainParent);
	const title = createElement("h1", container);
	title.innerHTML = "TOP SCORES";

	if (scores.length === 0) {
		const empty = createElement("p", container);
		empty.style.fontSize = "20px";
		empty.style.textAlign = "center";
		empty.innerHTML = "No scores yet...";
		return;
	}

	for (let i = 0; i < scores.length; i++) {
		const row = createElement("div", container);
		scoreRows.push(row);
		row.setAttribute("class", "fx");
		row.style.borderLeft = "3px solid teal";
		row.style.borderRight = "3px solid teal";

		const rank = createElement("p", row);
		rank.innerHTML = (i + 1) + ".";
		rank.style.width = "15%";
		rank.style.margin = "5px 0 5px 0";
		rank.style.paddingRight = "10px";
		rank.style.fontWeight = "bold";
		rank.style.fontSize = "11px";
		rank.style.textAlign = "center";
		rank.style.color = "#1d3b6b";

		const value = createElement("p", row);
		value.innerHTML = scores[i];
		value.style.margin = "5px 0 5px 0";
		value.style.fontWeight = "bold";
		value.style.fontSize = "17px";
		value.style.textAlign = "center";
		value.style.width = "85%";
		value.style.color = "#03a8a8";
	}
}

/* Highlights the row belonging to the score just achieved. When several
   rows share the value, the lowest-ranked one (the new entry) is used. */
function highlightScore(score) {
	const scores = getScores();
	let idx = -1;
	for (let i = 0; i < scores.length; i++) {
		if (scores[i] === score) {
			idx = i;
		}
	}
	if (idx !== -1 && scoreRows[idx]) {
		scoreRows[idx].style.backgroundColor = "#293d96";
	}
}
