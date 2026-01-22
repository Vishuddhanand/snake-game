const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');

const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');

const restartGameButton = document.querySelector('.btn-restart')

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 50;
const blockWidth = 50

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let minutes = 0;
let seconds = 0;
let time = `00:00s`;

highScoreElement.innerText = highScore;


const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerInterrvalId = null;

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random()) * cols }


const blocks = [];
let snake = [{ x: 1, y: 3 }]

let direction = "down";

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row} - ${col}`] = block;
    }
}

function render() {

    let head = null;

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    // wall collision logic

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex"



        return;

    }


    blocks[`${food.x} - ${food.y}`].classList.add("food");


    //food consume logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x} - ${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random()) * cols }

        blocks[`${food.x} - ${food.y}`].classList.add("food");

        snake.unshift(head);

        score += 10;
        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score
            localStorage.setItem("highScore", highScore.toString());
        }

    }

    snake.forEach(segment => {
        blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
    })


    snake.unshift(head);
    snake.pop();

    snake.forEach(segment => {
        blocks[`${segment.x} - ${segment.y}`].classList.add("fill");
    })



}



startButton.addEventListener("click", function () {
    intervalId = setInterval(() => {
        modal.style.display = "none";
        render();
    }, 500);

    timerInterrvalId = setInterval(() => {
        seconds++;

        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }

        time = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}s`;
        timeElement.innerText = time;

    }, 1000);

})

restartGameButton.addEventListener("click", restartGame)

function restartGame() {

    clearInterval(intervalId);
    clearInterval(timerInterrvalId);

    blocks[`${food.x} - ${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
    })

    score = 0;
    minutes = 0;
    seconds = 0;
    time = `00:00s`
    timeElement.innerText = time;
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;

    // restart intervals
    timerInterrvalId = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        timeElement.innerText =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}s`;
    }, 1000);

    modal.style.display = "none";
    snake = [{ x: 1, y: 3 }];
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random()) * cols }
    direction = "down";
    intervalId = setInterval(() => {
        modal.style.display = "none";
        render();
    }, 500);
}


addEventListener("keydown", function (e) {

    console.log(e.key)
    if (e.key === "ArrowUp") {
        direction = "up";
    } else if (e.key === "ArrowDown") {
        direction = "down";
    } else if (e.key === "ArrowLeft") {
        direction = "left";
    } else if (e.key === "ArrowRight") {
        direction = "right";
    }
})